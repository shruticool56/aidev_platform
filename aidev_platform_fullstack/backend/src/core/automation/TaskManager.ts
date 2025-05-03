import { Task, TaskStep } from "../../types";
import { loggerService } from "../services/LoggerService";
import { v4 as uuidv4 } from 'uuid'; // Need to install uuid
import { plannerService } from "../cognition/PlannerService";
import { executionService } from "../execution/ExecutionService";
import { io } from "../../server"; // Import socket io server instance

// Simple in-memory store for tasks
const taskStore: Map<string, Task> = new Map();

class TaskManager {
    private static instance: TaskManager;

    private constructor() {}

    public static getInstance(): TaskManager {
        if (!TaskManager.instance) {
            TaskManager.instance = new TaskManager();
        }
        return TaskManager.instance;
    }

    private updateTaskState(taskId: string, updates: Partial<Task>) {
        const task = taskStore.get(taskId);
        if (!task) {
            loggerService.warn(`Task not found for update: ${taskId}`);
            return null;
        }
        const updatedTask = { ...task, ...updates };
        taskStore.set(taskId, updatedTask);
        // Emit status update to frontend
        io?.to(taskId).emit("task:status", {
            taskId: taskId,
            status: updatedTask.status,
            currentStepIndex: updatedTask.currentStepIndex,
            plan: updatedTask.plan, // Send the whole plan for now
            // log: updates.logs ? updates.logs[updates.logs.length - 1] : undefined // Send last log? Or handle logs separately?
        });
        return updatedTask;
    }

    addLog(taskId: string, message: string) {
        const task = taskStore.get(taskId);
        if (task) {
            const logEntry = `[${new Date().toLocaleTimeString()}] ${message}`;
            const updatedLogs = [...task.logs, logEntry];
            this.updateTaskState(taskId, { logs: updatedLogs });
            // Emit individual log entry
            io?.to(taskId).emit("task:log", { taskId, log: logEntry });
        } else {
            loggerService.warn(`Cannot add log, task not found: ${taskId}`);
        }
    }

    async startTask(goal: string, socketId: string): Promise<Task | null> {
        const taskId = uuidv4();
        const initialTask: Task = {
            id: taskId,
            goal: goal,
            plan: [],
            status: "planning",
            currentStepIndex: -1,
            logs: [],
            startTime: Date.now(),
        };
        taskStore.set(taskId, initialTask);
        loggerService.info(`Task started: ${taskId} - Goal: ${goal}`);
        this.addLog(taskId, `Task started: ${goal}`);

        // Join the socket to a room associated with the task
        const socket = io?.sockets.sockets.get(socketId);
        if (socket) {
            socket.join(taskId);
            loggerService.info(`Socket ${socketId} joined room ${taskId}`);
        } else {
            loggerService.warn(`Socket ${socketId} not found for joining room ${taskId}`);
        }

        // Emit initial task creation status
        io?.to(taskId).emit("task:status", { taskId, status: "planning", goal });

        try {
            // 1. Decompose task into steps using PlannerService
            this.addLog(taskId, "Planning task steps...");
            const steps = await plannerService.decomposeTask(goal);
            if (!steps || steps.length === 0) {
                throw new Error("Failed to generate a plan.");
            }
            this.addLog(taskId, `Plan generated with ${steps.length} steps.`);
            const updatedTask = this.updateTaskState(taskId, { plan: steps, status: "running", currentStepIndex: 0 });

            if (updatedTask) {
                // 2. Start executing the first step
                this.executeNextStep(taskId);
            } else {
                 throw new Error("Failed to update task state after planning.");
            }
            return updatedTask;

        } catch (error: any) {
            loggerService.error(`Task planning failed for ${taskId}:`, error);
            this.addLog(taskId, `Error during planning: ${error.message}`);
            this.updateTaskState(taskId, { status: "failed", error: error.message, endTime: Date.now() });
            return taskStore.get(taskId) || null;
        }
    }

    private async executeNextStep(taskId: string) {
        const task = taskStore.get(taskId);
        if (!task || task.status !== "running") {
            loggerService.warn(`Task ${taskId} not found or not in running state for execution.`);
            return;
        }

        if (task.currentStepIndex >= task.plan.length) {
            // All steps completed
            this.addLog(taskId, "Task completed successfully.");
            this.updateTaskState(taskId, { status: "completed", endTime: Date.now() });
            loggerService.info(`Task ${taskId} completed.`);
            return;
        }

        const currentStep = task.plan[task.currentStepIndex];
        this.updateTaskState(taskId, { plan: task.plan.map((s, i) => i === task.currentStepIndex ? { ...s, status: "running", startTime: Date.now() } : s) });
        this.addLog(taskId, `Executing step ${task.currentStepIndex + 1}: ${currentStep.description}`);

        try {
            const result = await executionService.executeStep(currentStep, { taskId });
            this.addLog(taskId, `Step ${task.currentStepIndex + 1} result: ${result.output}`);

            // Update step status to completed
            const completedStepUpdate = { 
                ...currentStep, 
                status: "completed" as const, 
                result: result.output, 
                endTime: Date.now() 
            };
            const updatedPlan = task.plan.map((s, i) => i === task.currentStepIndex ? completedStepUpdate : s);
            
            const updatedTask = this.updateTaskState(taskId, { 
                plan: updatedPlan,
                currentStepIndex: task.currentStepIndex + 1 
            });

            if (updatedTask) {
                 // Proceed to the next step recursively
                 this.executeNextStep(taskId);
            } else {
                throw new Error("Failed to update task state after step completion.");
            }

        } catch (error: any) {
            loggerService.error(`Step ${task.currentStepIndex + 1} failed for task ${taskId}:`, error);
            this.addLog(taskId, `Error executing step ${task.currentStepIndex + 1}: ${error.message}`);
            
            // Update step status to failed
             const failedStepUpdate = { 
                ...currentStep, 
                status: "failed" as const, 
                error: error.message, 
                endTime: Date.now() 
            };
            const updatedPlan = task.plan.map((s, i) => i === task.currentStepIndex ? failedStepUpdate : s);

            this.updateTaskState(taskId, { plan: updatedPlan, status: "failed", error: error.message, endTime: Date.now() });
        }
    }

    getTask(taskId: string): Task | undefined {
        return taskStore.get(taskId);
    }

    // Add methods for pause, resume, cancel if needed
}

export const taskManager = TaskManager.getInstance();


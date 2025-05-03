"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskManager = void 0;
const LoggerService_1 = require("../services/LoggerService");
const uuid_1 = require("uuid"); // Need to install uuid
const PlannerService_1 = require("../cognition/PlannerService");
const ExecutionService_1 = require("../execution/ExecutionService");
const server_1 = require("../../server"); // Import socket io server instance
// Simple in-memory store for tasks
const taskStore = new Map();
class TaskManager {
    constructor() { }
    static getInstance() {
        if (!TaskManager.instance) {
            TaskManager.instance = new TaskManager();
        }
        return TaskManager.instance;
    }
    updateTaskState(taskId, updates) {
        const task = taskStore.get(taskId);
        if (!task) {
            LoggerService_1.loggerService.warn(`Task not found for update: ${taskId}`);
            return null;
        }
        const updatedTask = Object.assign(Object.assign({}, task), updates);
        taskStore.set(taskId, updatedTask);
        // Emit status update to frontend
        server_1.io === null || server_1.io === void 0 ? void 0 : server_1.io.to(taskId).emit("task:status", {
            taskId: taskId,
            status: updatedTask.status,
            currentStepIndex: updatedTask.currentStepIndex,
            plan: updatedTask.plan, // Send the whole plan for now
            // log: updates.logs ? updates.logs[updates.logs.length - 1] : undefined // Send last log? Or handle logs separately?
        });
        return updatedTask;
    }
    addLog(taskId, message) {
        const task = taskStore.get(taskId);
        if (task) {
            const logEntry = `[${new Date().toLocaleTimeString()}] ${message}`;
            const updatedLogs = [...task.logs, logEntry];
            this.updateTaskState(taskId, { logs: updatedLogs });
            // Emit individual log entry
            server_1.io === null || server_1.io === void 0 ? void 0 : server_1.io.to(taskId).emit("task:log", { taskId, log: logEntry });
        }
        else {
            LoggerService_1.loggerService.warn(`Cannot add log, task not found: ${taskId}`);
        }
    }
    startTask(goal, socketId) {
        return __awaiter(this, void 0, void 0, function* () {
            const taskId = (0, uuid_1.v4)();
            const initialTask = {
                id: taskId,
                goal: goal,
                plan: [],
                status: "planning",
                currentStepIndex: -1,
                logs: [],
                startTime: Date.now(),
            };
            taskStore.set(taskId, initialTask);
            LoggerService_1.loggerService.info(`Task started: ${taskId} - Goal: ${goal}`);
            this.addLog(taskId, `Task started: ${goal}`);
            // Join the socket to a room associated with the task
            const socket = server_1.io === null || server_1.io === void 0 ? void 0 : server_1.io.sockets.sockets.get(socketId);
            if (socket) {
                socket.join(taskId);
                LoggerService_1.loggerService.info(`Socket ${socketId} joined room ${taskId}`);
            }
            else {
                LoggerService_1.loggerService.warn(`Socket ${socketId} not found for joining room ${taskId}`);
            }
            // Emit initial task creation status
            server_1.io === null || server_1.io === void 0 ? void 0 : server_1.io.to(taskId).emit("task:status", { taskId, status: "planning", goal });
            try {
                // 1. Decompose task into steps using PlannerService
                this.addLog(taskId, "Planning task steps...");
                const steps = yield PlannerService_1.plannerService.decomposeTask(goal);
                if (!steps || steps.length === 0) {
                    throw new Error("Failed to generate a plan.");
                }
                this.addLog(taskId, `Plan generated with ${steps.length} steps.`);
                const updatedTask = this.updateTaskState(taskId, { plan: steps, status: "running", currentStepIndex: 0 });
                if (updatedTask) {
                    // 2. Start executing the first step
                    this.executeNextStep(taskId);
                }
                else {
                    throw new Error("Failed to update task state after planning.");
                }
                return updatedTask;
            }
            catch (error) {
                LoggerService_1.loggerService.error(`Task planning failed for ${taskId}:`, error);
                this.addLog(taskId, `Error during planning: ${error.message}`);
                this.updateTaskState(taskId, { status: "failed", error: error.message, endTime: Date.now() });
                return taskStore.get(taskId) || null;
            }
        });
    }
    executeNextStep(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = taskStore.get(taskId);
            if (!task || task.status !== "running") {
                LoggerService_1.loggerService.warn(`Task ${taskId} not found or not in running state for execution.`);
                return;
            }
            if (task.currentStepIndex >= task.plan.length) {
                // All steps completed
                this.addLog(taskId, "Task completed successfully.");
                this.updateTaskState(taskId, { status: "completed", endTime: Date.now() });
                LoggerService_1.loggerService.info(`Task ${taskId} completed.`);
                return;
            }
            const currentStep = task.plan[task.currentStepIndex];
            this.updateTaskState(taskId, { plan: task.plan.map((s, i) => i === task.currentStepIndex ? Object.assign(Object.assign({}, s), { status: "running", startTime: Date.now() }) : s) });
            this.addLog(taskId, `Executing step ${task.currentStepIndex + 1}: ${currentStep.description}`);
            try {
                const result = yield ExecutionService_1.executionService.executeStep(currentStep, { taskId });
                this.addLog(taskId, `Step ${task.currentStepIndex + 1} result: ${result.output}`);
                // Update step status to completed
                const completedStepUpdate = Object.assign(Object.assign({}, currentStep), { status: "completed", result: result.output, endTime: Date.now() });
                const updatedPlan = task.plan.map((s, i) => i === task.currentStepIndex ? completedStepUpdate : s);
                const updatedTask = this.updateTaskState(taskId, {
                    plan: updatedPlan,
                    currentStepIndex: task.currentStepIndex + 1
                });
                if (updatedTask) {
                    // Proceed to the next step recursively
                    this.executeNextStep(taskId);
                }
                else {
                    throw new Error("Failed to update task state after step completion.");
                }
            }
            catch (error) {
                LoggerService_1.loggerService.error(`Step ${task.currentStepIndex + 1} failed for task ${taskId}:`, error);
                this.addLog(taskId, `Error executing step ${task.currentStepIndex + 1}: ${error.message}`);
                // Update step status to failed
                const failedStepUpdate = Object.assign(Object.assign({}, currentStep), { status: "failed", error: error.message, endTime: Date.now() });
                const updatedPlan = task.plan.map((s, i) => i === task.currentStepIndex ? failedStepUpdate : s);
                this.updateTaskState(taskId, { plan: updatedPlan, status: "failed", error: error.message, endTime: Date.now() });
            }
        });
    }
    getTask(taskId) {
        return taskStore.get(taskId);
    }
}
exports.taskManager = TaskManager.getInstance();

import { Agent, AgentContext, AgentResult, TaskStep } from "../../types";
import { loggerService } from "../services/LoggerService";
import { agentOS } from "../agent-os"; // Assuming agent-os index exports necessary functions
import { taskManager } from "../automation/TaskManager";

class ExecutionService {
    private static instance: ExecutionService;

    private constructor() {}

    public static getInstance(): ExecutionService {
        if (!ExecutionService.instance) {
            ExecutionService.instance = new ExecutionService();
        }
        return ExecutionService.instance;
    }

    /**
     * Executes a single task step by selecting an appropriate agent and calling its execute method.
     * @param step The task step to execute.
     * @param context The execution context (e.g., taskId).
     * @returns A promise resolving to the agent's result.
     */
    async executeStep(step: TaskStep, context: AgentContext): Promise<AgentResult> {
        loggerService.info(`Executing step: ${step.description} (Task: ${context.taskId})`);
        taskManager.addLog(context.taskId, `Selecting agent for step: "${step.description}"`);

        try {
            // 1. Select Agent
            const agentName = agentOS.selectAgentForStep(step);
            const agent = agentOS.getAgent(agentName);

            if (!agent) {
                loggerService.error(`Agent "${agentName}" not found for step: ${step.description}`);
                throw new Error(`Agent "${agentName}" not found.`);
            }

            taskManager.addLog(context.taskId, `Selected agent: ${agent.name}`);
            loggerService.info(`Selected agent ${agent.name} for step: ${step.description}`);

            // Update step with assigned agent
            // This might be better handled within TaskManager after selection but before execution
            // taskManager.updateStep(context.taskId, step.id, { assignedAgentName: agent.name });

            // 2. Execute Agent
            const result = await agent.execute(step, context);

            if (result.error) {
                loggerService.error(`Agent ${agent.name} failed step ${step.id}: ${result.error}`);
                throw new Error(result.error); // Propagate agent error
            }

            loggerService.info(`Agent ${agent.name} completed step ${step.id} successfully.`);
            return result;

        } catch (error: any) {
            loggerService.error(`Error during step execution (Step ID: ${step.id}, Task ID: ${context.taskId}):`, error);
            // Ensure the error is propagated
            throw new Error(`Step execution failed: ${error.message}`);
        }
    }
}

export const executionService = ExecutionService.getInstance();


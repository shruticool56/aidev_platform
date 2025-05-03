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
exports.executionService = void 0;
const LoggerService_1 = require("../services/LoggerService");
const agent_os_1 = require("../agent-os"); // Assuming agent-os index exports necessary functions
const TaskManager_1 = require("../automation/TaskManager");
class ExecutionService {
    constructor() { }
    static getInstance() {
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
    executeStep(step, context) {
        return __awaiter(this, void 0, void 0, function* () {
            LoggerService_1.loggerService.info(`Executing step: ${step.description} (Task: ${context.taskId})`);
            TaskManager_1.taskManager.addLog(context.taskId, `Selecting agent for step: "${step.description}"`);
            try {
                // 1. Select Agent
                const agentName = agent_os_1.agentOS.selectAgentForStep(step);
                const agent = agent_os_1.agentOS.getAgent(agentName);
                if (!agent) {
                    LoggerService_1.loggerService.error(`Agent "${agentName}" not found for step: ${step.description}`);
                    throw new Error(`Agent "${agentName}" not found.`);
                }
                TaskManager_1.taskManager.addLog(context.taskId, `Selected agent: ${agent.name}`);
                LoggerService_1.loggerService.info(`Selected agent ${agent.name} for step: ${step.description}`);
                // Update step with assigned agent
                // This might be better handled within TaskManager after selection but before execution
                // taskManager.updateStep(context.taskId, step.id, { assignedAgentName: agent.name });
                // 2. Execute Agent
                const result = yield agent.execute(step, context);
                if (result.error) {
                    LoggerService_1.loggerService.error(`Agent ${agent.name} failed step ${step.id}: ${result.error}`);
                    throw new Error(result.error); // Propagate agent error
                }
                LoggerService_1.loggerService.info(`Agent ${agent.name} completed step ${step.id} successfully.`);
                return result;
            }
            catch (error) {
                LoggerService_1.loggerService.error(`Error during step execution (Step ID: ${step.id}, Task ID: ${context.taskId}):`, error);
                // Ensure the error is propagated
                throw new Error(`Step execution failed: ${error.message}`);
            }
        });
    }
}
exports.executionService = ExecutionService.getInstance();

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
const child_process_1 = require("child_process");
const util_1 = require("util");
const LoggerService_1 = require("../../services/LoggerService");
const agent_os_1 = require("../../agent-os"); // To register the agent
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class ExecutorAgent {
    constructor() {
        this.name = "ExecutorAgent";
        this.description = "Executes shell commands.";
        this.capabilities = ["execute_shell"];
    }
    execute(step, context) {
        return __awaiter(this, void 0, void 0, function* () {
            // Attempt to extract a command from the step description
            // This is a very basic extraction, ideally use LLM for command synthesis
            const commandMatch = step.description.match(/execute command:?\s*(.*)/i)
                || step.description.match(/run command:?\s*(.*)/i)
                || step.description.match(/run:?\s*(.*)/i);
            const command = commandMatch ? commandMatch[1].trim() : step.description; // Fallback to using the whole description
            if (!command) {
                return { output: "", error: "No command specified or extracted for execution." };
            }
            LoggerService_1.loggerService.info(`[${this.name}] Executing command for task ${context.taskId}: ${command}`);
            try {
                // WARNING: Executing arbitrary commands is highly insecure, especially if derived from LLM output.
                // Implement strict sandboxing, input validation, and command filtering in a real system.
                const { stdout, stderr } = yield execAsync(command, { timeout: 30000 }); // 30-second timeout
                if (stderr) {
                    LoggerService_1.loggerService.warn(`[${this.name}] Command execution for task ${context.taskId} produced stderr: ${stderr}`);
                    // Decide if stderr should be treated as an error or just output
                    return { output: `stdout:\n${stdout}\nstderr:\n${stderr}` };
                }
                LoggerService_1.loggerService.info(`[${this.name}] Command executed successfully for task ${context.taskId}.`);
                return { output: stdout };
            }
            catch (error) {
                LoggerService_1.loggerService.error(`[${this.name}] Command execution failed for task ${context.taskId}: ${command}`, error);
                return { output: error.stdout || "", error: `Command failed: ${error.message}\nstderr: ${error.stderr || ""}` };
            }
        });
    }
}
// Register the agent instance
agent_os_1.agentOS.registerAgent(new ExecutorAgent());
exports.default = ExecutorAgent;

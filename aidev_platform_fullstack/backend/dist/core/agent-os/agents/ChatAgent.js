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
const LoggerService_1 = require("../../services/LoggerService");
const agent_os_1 = require("../../agent-os");
const LLMService_1 = require("../../llm-orchestration/LLMService");
class ChatAgent {
    constructor() {
        this.name = "ChatAgent";
        this.description = "Uses an LLM to answer questions, provide explanations, or perform general reasoning tasks.";
        this.capabilities = ["llm_chat", "reasoning"];
    }
    execute(step, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = step.description;
            LoggerService_1.loggerService.info(`[${this.name}] Processing prompt for task ${context.taskId}: "${prompt}"`);
            if (!prompt) {
                return { output: "", error: "No prompt provided for chat agent." };
            }
            try {
                // Use the default LLM configured in the system
                const response = yield LLMService_1.llmService.generate(prompt);
                LoggerService_1.loggerService.info(`[${this.name}] Received LLM response for task ${context.taskId}.`);
                return { output: response.content };
            }
            catch (error) {
                LoggerService_1.loggerService.error(`[${this.name}] LLM generation failed for task ${context.taskId}:`, error);
                return { output: "", error: `Chat generation failed: ${error.message}` };
            }
        });
    }
}
// Register the agent instance
agent_os_1.agentOS.registerAgent(new ChatAgent());
exports.default = ChatAgent;

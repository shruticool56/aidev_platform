import { Agent, AgentContext, AgentResult, TaskStep } from "../../../types";
import { loggerService } from "../../services/LoggerService";
import { agentOS } from "../../agent-os";
import { llmService } from "../../llm-orchestration/LLMService";

class ChatAgent implements Agent {
    name = "ChatAgent";
    description = "Uses an LLM to answer questions, provide explanations, or perform general reasoning tasks.";
    capabilities = ["llm_chat", "reasoning"];

    async execute(step: TaskStep, context: AgentContext): Promise<AgentResult> {
        const prompt = step.description;
        loggerService.info(`[${this.name}] Processing prompt for task ${context.taskId}: "${prompt}"`);

        if (!prompt) {
            return { output: "", error: "No prompt provided for chat agent." };
        }

        try {
            // Use the default LLM configured in the system
            const response = await llmService.generate(prompt);
            
            loggerService.info(`[${this.name}] Received LLM response for task ${context.taskId}.`);
            return { output: response.content };

        } catch (error: any) {
            loggerService.error(`[${this.name}] LLM generation failed for task ${context.taskId}:`, error);
            return { output: "", error: `Chat generation failed: ${error.message}` };
        }
    }
}

// Register the agent instance
agentOS.registerAgent(new ChatAgent());

export default ChatAgent;


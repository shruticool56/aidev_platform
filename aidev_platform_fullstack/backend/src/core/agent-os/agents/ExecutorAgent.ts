import { exec } from "child_process";
import { promisify } from "util";
import { Agent, AgentContext, AgentResult, TaskStep } from "../../../types";
import { loggerService } from "../../services/LoggerService";
import { agentOS } from "../../agent-os"; // To register the agent

const execAsync = promisify(exec);

class ExecutorAgent implements Agent {
    name = "ExecutorAgent";
    description = "Executes shell commands.";
    capabilities = ["execute_shell"];

    async execute(step: TaskStep, context: AgentContext): Promise<AgentResult> {
        // Attempt to extract a command from the step description
        // This is a very basic extraction, ideally use LLM for command synthesis
        const commandMatch = step.description.match(/execute command:?\s*(.*)/i) 
                          || step.description.match(/run command:?\s*(.*)/i)
                          || step.description.match(/run:?\s*(.*)/i);
        
        const command = commandMatch ? commandMatch[1].trim() : step.description; // Fallback to using the whole description

        if (!command) {
            return { output: "", error: "No command specified or extracted for execution." };
        }

        loggerService.info(`[${this.name}] Executing command for task ${context.taskId}: ${command}`);

        try {
            // WARNING: Executing arbitrary commands is highly insecure, especially if derived from LLM output.
            // Implement strict sandboxing, input validation, and command filtering in a real system.
            const { stdout, stderr } = await execAsync(command, { timeout: 30000 }); // 30-second timeout

            if (stderr) {
                loggerService.warn(`[${this.name}] Command execution for task ${context.taskId} produced stderr: ${stderr}`);
                // Decide if stderr should be treated as an error or just output
                return { output: `stdout:\n${stdout}\nstderr:\n${stderr}` }; 
            }

            loggerService.info(`[${this.name}] Command executed successfully for task ${context.taskId}.`);
            return { output: stdout };

        } catch (error: any) {
            loggerService.error(`[${this.name}] Command execution failed for task ${context.taskId}: ${command}`, error);
            return { output: error.stdout || "", error: `Command failed: ${error.message}\nstderr: ${error.stderr || ""}` };
        }
    }
}

// Register the agent instance
agentOS.registerAgent(new ExecutorAgent());

export default ExecutorAgent;


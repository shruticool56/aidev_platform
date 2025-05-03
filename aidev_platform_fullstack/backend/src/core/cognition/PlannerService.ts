import { llmService } from "../llm-orchestration/LLMService";
import { TaskStep } from "../../types";
import { loggerService } from "../services/LoggerService";

class PlannerService {
    private static instance: PlannerService;

    private constructor() {}

    public static getInstance(): PlannerService {
        if (!PlannerService.instance) {
            PlannerService.instance = new PlannerService();
        }
        return PlannerService.instance;
    }

    /**
     * Decomposes a high-level goal into a sequence of actionable steps using an LLM.
     * @param goal The high-level goal description.
     * @returns A promise resolving to an array of TaskSteps.
     */
    async decomposeTask(goal: string): Promise<TaskStep[]> {
        loggerService.info(`Decomposing goal: ${goal}`);
        
        // Simple prompt for planning - can be significantly improved
        const prompt = `Decompose the following high-level goal into a sequence of simple, actionable steps. Output *only* a numbered list of steps, one step per line. Do not include any preamble or explanation.

Goal: ${goal}

Steps:
1.`;

        try {
            // Use the default LLM provider/model configured
            const response = await llmService.generate(prompt);
            const rawSteps = "1." + response.content; // Prepend the initial "1." assumed by the prompt

            loggerService.debug(`Raw plan from LLM:\n${rawSteps}`);

            // Parse the numbered list output
            const steps = rawSteps
                .split("\n")
                .map(line => line.trim())
                .filter(line => /^\d+\.\s*.+/.test(line)) // Match lines starting with number and dot
                .map((line, index) => {
                    const description = line.replace(/^\d+\.\s*/, ""); // Remove numbering
                    return {
                        id: `step-${Date.now()}-${index}`,
                        description: description,
                        status: "pending" as const,
                    };
                });

            if (steps.length === 0) {
                loggerService.warn("LLM did not return any valid steps for the goal.");
                // Fallback or error handling - maybe return a single step?
                // For now, let's throw an error to indicate planning failure.
                throw new Error("Failed to parse steps from LLM response.");
            }

            loggerService.info(`Generated ${steps.length} steps for goal.`);
            return steps;

        } catch (error: any) {
            loggerService.error("Error during task decomposition:", error);
            throw new Error(`Failed to decompose task: ${error.message}`);
        }
    }
}

export const plannerService = PlannerService.getInstance();


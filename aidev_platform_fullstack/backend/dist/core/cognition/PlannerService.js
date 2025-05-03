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
exports.plannerService = void 0;
const LLMService_1 = require("../llm-orchestration/LLMService");
const LoggerService_1 = require("../services/LoggerService");
class PlannerService {
    constructor() { }
    static getInstance() {
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
    decomposeTask(goal) {
        return __awaiter(this, void 0, void 0, function* () {
            LoggerService_1.loggerService.info(`Decomposing goal: ${goal}`);
            // Simple prompt for planning - can be significantly improved
            const prompt = `Decompose the following high-level goal into a sequence of simple, actionable steps. Output *only* a numbered list of steps, one step per line. Do not include any preamble or explanation.

Goal: ${goal}

Steps:
1.`;
            try {
                // Use the default LLM provider/model configured
                const response = yield LLMService_1.llmService.generate(prompt);
                const rawSteps = "1." + response.content; // Prepend the initial "1." assumed by the prompt
                LoggerService_1.loggerService.debug(`Raw plan from LLM:\n${rawSteps}`);
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
                        status: "pending",
                    };
                });
                if (steps.length === 0) {
                    LoggerService_1.loggerService.warn("LLM did not return any valid steps for the goal.");
                    // Fallback or error handling - maybe return a single step?
                    // For now, let's throw an error to indicate planning failure.
                    throw new Error("Failed to parse steps from LLM response.");
                }
                LoggerService_1.loggerService.info(`Generated ${steps.length} steps for goal.`);
                return steps;
            }
            catch (error) {
                LoggerService_1.loggerService.error("Error during task decomposition:", error);
                throw new Error(`Failed to decompose task: ${error.message}`);
            }
        });
    }
}
exports.plannerService = PlannerService.getInstance();

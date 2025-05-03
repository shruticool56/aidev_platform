import { Agent, AgentContext, AgentResult, TaskStep } from "../../types";
import { loggerService } from "../services/LoggerService";

// In-memory registry for agents
const agentRegistry: Map<string, Agent> = new Map();

export function registerAgent(agent: Agent) {
    if (agentRegistry.has(agent.name)) {
        loggerService.warn(`Agent with name "${agent.name}" is already registered. Overwriting.`);
    }
    agentRegistry.set(agent.name, agent);
    loggerService.info(`Agent registered: ${agent.name}`);
}

export function getAgent(name: string): Agent | undefined {
    return agentRegistry.get(name);
}

export function getAllAgents(): Agent[] {
    return Array.from(agentRegistry.values());
}

// --- Agent Selector Logic ---

/**
 * Selects the most appropriate agent for a given task step.
 * Basic implementation: uses keywords in the step description.
 * Can be enhanced with LLM-based selection.
 * @param step The task step.
 * @returns The name of the selected agent.
 */
export function selectAgentForStep(step: TaskStep): string {
    const description = step.description.toLowerCase();
    
    // Simple keyword-based routing (expand significantly)
    if (description.includes("execute") || description.includes("run command") || description.includes("terminal")) {
        return "ExecutorAgent";
    }
    if (description.includes("read file") || description.includes("write file") || description.includes("list directory") || description.includes("create file")) {
        return "FileAgent";
    }
    if (description.includes("search web") || description.includes("browse") || description.includes("fetch url")) {
        return "WebAgent"; // Assuming WebAgent exists
    }
    if (description.includes("plan") || description.includes("decompose")) {
        return "PlannerAgent"; // Assuming PlannerAgent exists
    }
    // Add more rules for other agents...

    // Default / Fallback agent (e.g., a general-purpose chat/reasoning agent)
    loggerService.warn(`No specific agent matched for step: "${step.description}". Defaulting to ChatAgent.`);
    return "ChatAgent"; // Default to ChatAgent if no specific match
}

// Placeholder index file for Agent OS - can be expanded
export const agentOS = {
    registerAgent,
    getAgent,
    getAllAgents,
    selectAgentForStep
};


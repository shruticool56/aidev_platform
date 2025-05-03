"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentOS = void 0;
exports.registerAgent = registerAgent;
exports.getAgent = getAgent;
exports.getAllAgents = getAllAgents;
exports.selectAgentForStep = selectAgentForStep;
const LoggerService_1 = require("../services/LoggerService");
// In-memory registry for agents
const agentRegistry = new Map();
function registerAgent(agent) {
    if (agentRegistry.has(agent.name)) {
        LoggerService_1.loggerService.warn(`Agent with name "${agent.name}" is already registered. Overwriting.`);
    }
    agentRegistry.set(agent.name, agent);
    LoggerService_1.loggerService.info(`Agent registered: ${agent.name}`);
}
function getAgent(name) {
    return agentRegistry.get(name);
}
function getAllAgents() {
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
function selectAgentForStep(step) {
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
    LoggerService_1.loggerService.warn(`No specific agent matched for step: "${step.description}". Defaulting to ChatAgent.`);
    return "ChatAgent"; // Default to ChatAgent if no specific match
}
// Placeholder index file for Agent OS - can be expanded
exports.agentOS = {
    registerAgent,
    getAgent,
    getAllAgents,
    selectAgentForStep
};

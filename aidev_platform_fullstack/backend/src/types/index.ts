// src/types/index.ts

export interface TaskStep {
    id: string;
    description: string;
    status: 'pending' | 'running' | 'completed' | 'failed'; // Corrected status type
    assignedAgentName?: string; // Name of the agent assigned
    result?: string; // Output or result from the agent
    error?: string; // Error message if the step failed
    startTime?: number;
    endTime?: number;
}

export interface Task {
    id: string;
    goal: string;
    plan: TaskStep[];
    status: 'idle' | 'planning' | 'running' | 'completed' | 'failed' | 'paused';
    currentStepIndex: number;
    logs: string[];
    startTime?: number;
    endTime?: number;
    error?: string; // Added optional error field for the overall task
    // Add any other relevant task metadata
}

export interface AgentResult {
    output: string;
    error?: string;
    // Potentially add structured data output
}

export interface AgentContext {
    // Contextual information passed to agents during execution
    taskId: string;
    // Add other relevant context like file paths, previous step results, etc.
}

export interface Agent {
    name: string;
    description: string;
    capabilities: string[]; // List of capabilities (e.g., 'execute_shell', 'read_file', 'llm_chat')
    
    /**
     * Executes a task step.
     * @param step The task step to execute.
     * @param context Additional context for execution.
     * @returns A promise resolving to the agent's result.
     */
    execute(step: TaskStep, context: AgentContext): Promise<AgentResult>;
}

// Configuration types
export interface LLMConfig {
    provider: string;
    apiKey?: string;
    model: string;
}

// Socket.IO Event Payloads (example)
export interface TaskStartPayload {
    goal: string;
}

export interface TaskStatusPayload {
    taskId: string;
    status: Task['status'];
    currentStepIndex?: number;
    plan?: TaskStep[]; // Send updated plan
    log?: string; // Send individual log entry
    error?: string;
    goal?: string; // Added goal for initial status
}

export interface ChatMessagePayload {
    text: string;
    taskId?: string; // Optional: associate chat with a task
}

export interface ChatResponsePayload {
    text: string;
    type: 'agent' | 'system' | 'user' | 'error';
    sender?: string; // e.g., Agent name
}

export interface TerminalInputPayload {
    input: string;
    taskId?: string; // Optional: associate terminal with a task
}

export interface TerminalOutputPayload {
    output: string;
    error?: boolean;
}


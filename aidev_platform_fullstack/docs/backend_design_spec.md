# AIDev Platform Backend Enhancement Design Specification

## 1. Introduction

**Goal:** Enhance the existing skeleton `aidev_platform` backend to implement the core functionalities of a full-stack autonomous AI agent IDE, as outlined in the `Architecture (1).txt` document. The implementation will use Node.js and TypeScript.

**Approach:** Build upon the existing modular structure. Implement core logic for task processing, agent orchestration, LLM interaction, and basic execution capabilities. Communication with the enhanced frontend will primarily use Socket.IO.

**Technology Stack:**
*   Runtime: Node.js
*   Language: TypeScript
*   Web Framework: Express.js
*   Real-time Communication: Socket.IO
*   HTTP Requests: `axios` or `node-fetch`
*   Process Execution: Node.js `child_process` (with security caveats)

## 2. High-Level Architecture & Module Mapping

The backend will follow the modular structure already present in `src/core`, implementing logic within each corresponding directory.

*   **`server.ts`**: Main application entry point, Express server setup, Socket.IO initialization, basic middleware.
*   **`src/api`**: Defines REST endpoints (minimal) and Socket.IO event handlers for frontend communication.
*   **`src/core/cognition`**: Handles high-level task understanding, planning, and decomposition.
*   **`src/core/agent-os`**: Manages agent definitions, selection, and state.
*   **`src/core/execution`**: Orchestrates task step execution, synthesizes commands, executes them (e.g., via `child_process`), and processes results.
*   **`src/core/llm-orchestration`**: Interfaces with external LLM APIs (OpenAI, Gemini, etc.) and potentially local models (Ollama).
*   **`src/core/access`**: Provides agents with capabilities to interact with the file system (`fs`) and the web (HTTP requests).
*   **`src/core/automation`**: Manages the overall workflow and sequencing of task steps.
*   **`src/core/code-intelligence`**: (Initial Scope Limited) Basic file reading/writing capabilities via File Agent.
*   **`src/core/services`**: Core utilities like logging, state management (in-memory initially), configuration, API key handling.
*   **`src/types`**: Shared TypeScript interfaces and types.
*   **`src/utils`**: Common utility functions.

## 3. Detailed Design per Layer

### 3.1. Server & API (`server.ts`, `src/api`)
*   Initialize Express and Socket.IO server.
*   Define Socket.IO namespaces/rooms if needed for different functionalities (e.g., task execution, chat).
*   Implement main Socket.IO event handlers (`task:start`, `chat:message`, `terminal:input`, etc.) in `src/api/ws/handlers.ts`.
*   These handlers will delegate processing to the relevant core modules (Cognition, Agent OS, Execution).
*   Use a central `TaskManager` or similar service in `src/core/automation` to manage the state of active tasks.
*   Emit status updates (`task:status`, `agent:status`, `terminal:output`, `chat:response`) back to the frontend via Socket.IO.

### 3.2. Core Services (`src/core/services`)
*   **`ConfigService`**: Load configuration (e.g., API keys, default models) from environment variables (`.env` file).
*   **`LoggerService`**: Simple console logger, potentially expandable to file logging.
*   **`StateService`**: In-memory store for managing the state of tasks, agents, etc. (e.g., using Maps or simple objects). This simulates the Memory Store.

### 3.3. LLM Orchestration (`src/core/llm-orchestration`)
*   **`LLMService`**: 
    *   Method to get available models (based on configured API keys).
    *   Core method `generate(prompt, modelName, options)` to interact with different LLM APIs.
    *   Use `axios` or `node-fetch` to make API calls.
    *   Handle API key retrieval from `ConfigService`.
    *   Basic error handling and response parsing.
    *   (Future) Add support for Ollama API endpoint detection/interaction.

### 3.4. Cognition Core (`src/core/cognition`)
*   **`PlannerService`**: 
    *   `decomposeTask(goal: string): Promise<TaskStep[]>`: Takes a high-level goal, uses `LLMService` with a specific planning prompt to break it down into sequential steps.
    *   Define the `TaskStep` interface (description, potential agent type hint, status).

### 3.5. Agent OS (`src/core/agent-os`)
*   **`Agent` Interface/Base Class**: Define common properties (`name`, `description`, `capabilities`) and methods (`execute(step: TaskStep, context: any): Promise<AgentResult>`).
*   **`AgentRegistry`**: A map or class to hold instances of available agents.
*   **Implement Basic Agents**: 
    *   `PlannerAgent`: Wraps `PlannerService`.
    *   `ExecutorAgent`: Uses `child_process` to run shell commands.
    *   `FileAgent`: Uses Node.js `fs` module for read/write/list operations.
    *   `WebAgent`: Uses `axios`/`node-fetch` for simple GET requests or potentially a headless browser like Puppeteer (if feasible/allowed) for more complex interactions.
    *   `ChatAgent`: Interacts with `LLMService` for conversational responses.
*   **`AgentSelector`**: Logic to select the appropriate agent for a given `TaskStep` (can be simple keyword matching initially, or LLM-based). 

### 3.6. Execution Layer (`src/core/execution`)
*   **`ExecutionService`**: 
    *   Receives a `TaskStep` and context.
    *   Uses `AgentSelector` to find the right agent.
    *   Calls the agent's `execute` method.
    *   Handles agent results, errors, and updates task status via `StateService` and emits updates via Socket.IO.
    *   **Command Synthesis**: For agents like `ExecutorAgent`, this might involve taking a natural language step and converting it to a shell command (potentially using an LLM or simple templates).
    *   **Observation Synthesis**: Process agent output (e.g., command stdout/stderr, API responses) into a format usable for logging or subsequent steps.
    *   **Secure Execution**: Use `child_process.exec` or `child_process.spawn`. **Crucially, acknowledge the security risks of executing arbitrary commands generated by an LLM.** Implement basic safeguards like timeouts, input sanitization (if possible), and clearly log executed commands. True sandboxing (Docker/Firejail) is complex and likely out of scope for initial implementation.

### 3.7. Automation Core (`src/core/automation`)
*   **`TaskManager`**: 
    *   Manages the lifecycle of tasks (`start`, `pause`, `resume`, `cancel`).
    *   Stores active tasks (using `StateService`).
    *   Receives the initial goal, calls `PlannerService` to get steps.
    *   Iterates through `TaskStep`s, calling `ExecutionService` for each.
    *   Handles sequential execution, basic error handling (e.g., stop on failure), and task completion.
    *   Coordinates status updates back to the frontend via Socket.IO emitters.

### 3.8. Access Layer (`src/core/access`)
*   Logic implemented within specific agents (`FileAgent`, `WebAgent`) using Node.js built-in modules (`fs`, `http`/`https`) or external libraries (`axios`, `puppeteer`).

### 3.9. Code Intelligence (`src/core/code-intelligence`)
*   Initial scope limited to file operations handled by `FileAgent`.
*   (Future) Could involve integrating parsing libraries (like Babel or TypeScript compiler API) for analysis, but this is complex.

## 4. Data Structures (`src/types`)
*   Define core interfaces:
    *   `Task { id, goal, plan: TaskStep[], status, currentStepIndex, logs }`
    *   `TaskStep { id, description, status, assignedAgentName?, result?, error? }`
    *   `Agent { name, description, capabilities, execute(...) }`
    *   `AgentResult { output: string, error?: string }`
    *   `LLMConfig { provider, apiKey, model }`

## 5. Integration with Frontend
*   Backend listens for events from the frontend (e.g., `task:start`).
*   Backend processes the request using the core modules.
*   Backend emits events back to the frontend to update UI state:
    *   `task:status` (overall task progress, logs, step updates)
    *   `agent:status` (which agent is working)
    *   `terminal:output` (output from `ExecutorAgent`)
    *   `chat:response` (responses from `ChatAgent`)
    *   `file:data` (results from `FileAgent`)
*   The frontend's `AppContext` will need to be updated to connect to the backend Socket.IO server and handle these events, replacing the purely simulated logic.

## 6. Next Steps
*   Begin implementation starting with Core Services (Config, Logger), LLM Orchestration, and basic server setup.
*   Implement the TaskManager and basic PlannerService.
*   Implement core Agents (Executor, File, Chat).
*   Integrate agent execution flow.
*   Refine frontend to communicate with the backend instead of simulating.

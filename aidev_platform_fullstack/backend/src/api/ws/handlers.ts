import { Socket } from "socket.io";
import { loggerService } from "../../core/services/LoggerService";
import { taskManager } from "../../core/automation/TaskManager";
import { llmService } from "../../core/llm-orchestration/LLMService";
import { 
    TaskStartPayload, 
    ChatMessagePayload, 
    TerminalInputPayload, 
    // Import other payload types as needed
} from "../../types";

// Main handler function to attach listeners to a socket
export function registerSocketHandlers(socket: Socket) {
    loggerService.info(`Registering handlers for socket: ${socket.id}`);

    // --- Task Management --- 
    socket.on("task:start", async (data: TaskStartPayload) => {
        loggerService.info(`[Socket ${socket.id}] Received task:start - Goal: ${data.goal}`);
        try {
            // Pass socket.id to associate the socket with the task room
            const task = await taskManager.startTask(data.goal, socket.id);
            if (!task) {
                // Emit error back to client if task creation failed immediately
                socket.emit("task:error", { taskId: null, error: "Failed to initialize task." });
            }
            // TaskManager will emit status updates via io.to(taskId)
        } catch (error: any) {
            loggerService.error(`[Socket ${socket.id}] Error starting task:`, error);
            socket.emit("task:error", { taskId: null, error: `Failed to start task: ${error.message}` });
        }
    });

    // Add handlers for task:pause, task:resume, task:cancel if implemented in TaskManager

    // --- Chat --- 
    socket.on("chat:message", async (data: ChatMessagePayload) => {
        loggerService.info(`[Socket ${socket.id}] Received chat:message - Text: ${data.text}`);
        // Simple echo back + LLM call for now
        socket.emit("chat:response", { text: data.text, type: "user" }); // Echo user message
        try {
            // Use ChatAgent logic (which uses llmService)
            const response = await llmService.generate(data.text); // Use default model
            socket.emit("chat:response", { text: response.content, type: "agent", sender: "ChatAgent" });
        } catch (error: any) {
            loggerService.error(`[Socket ${socket.id}] Error processing chat message:`, error);
            socket.emit("chat:response", { text: `Error processing message: ${error.message}`, type: "error" });
        }
    });

    // --- Terminal --- (Basic Placeholder)
    socket.on("terminal:input", (data: TerminalInputPayload) => {
        loggerService.info(`[Socket ${socket.id}] Received terminal:input - Input: ${data.input}`);
        // TODO: Route this input to a persistent terminal process associated with the task/socket
        // For now, just echo back a message
        socket.emit("terminal:output", { output: `Backend received: "${data.input}" (Terminal interaction not fully implemented)\n` });
    });

    // --- File System --- (Basic Placeholder)
    socket.on("file:list", (data: { path: string }) => {
        loggerService.info(`[Socket ${socket.id}] Received file:list - Path: ${data.path}`);
        // TODO: Integrate with FileAgent or a dedicated FileService
        socket.emit("file:error", { path: data.path, error: "File listing via Socket.IO not implemented yet. Use FileAgent via tasks." });
    });

    // --- Disconnect --- 
    socket.on("disconnect", (reason) => {
        loggerService.info(`[Socket ${socket.id}] Disconnected - Reason: ${reason}`);
        // Add cleanup logic if needed (e.g., leave task rooms?)
    });

    // Add other event handlers as needed based on architecture
}


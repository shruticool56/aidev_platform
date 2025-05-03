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
exports.registerSocketHandlers = registerSocketHandlers;
const LoggerService_1 = require("../../core/services/LoggerService");
const TaskManager_1 = require("../../core/automation/TaskManager");
const LLMService_1 = require("../../core/llm-orchestration/LLMService");
// Main handler function to attach listeners to a socket
function registerSocketHandlers(socket) {
    LoggerService_1.loggerService.info(`Registering handlers for socket: ${socket.id}`);
    // --- Task Management --- 
    socket.on("task:start", (data) => __awaiter(this, void 0, void 0, function* () {
        LoggerService_1.loggerService.info(`[Socket ${socket.id}] Received task:start - Goal: ${data.goal}`);
        try {
            // Pass socket.id to associate the socket with the task room
            const task = yield TaskManager_1.taskManager.startTask(data.goal, socket.id);
            if (!task) {
                // Emit error back to client if task creation failed immediately
                socket.emit("task:error", { taskId: null, error: "Failed to initialize task." });
            }
            // TaskManager will emit status updates via io.to(taskId)
        }
        catch (error) {
            LoggerService_1.loggerService.error(`[Socket ${socket.id}] Error starting task:`, error);
            socket.emit("task:error", { taskId: null, error: `Failed to start task: ${error.message}` });
        }
    }));
    // Add handlers for task:pause, task:resume, task:cancel if implemented in TaskManager
    // --- Chat --- 
    socket.on("chat:message", (data) => __awaiter(this, void 0, void 0, function* () {
        LoggerService_1.loggerService.info(`[Socket ${socket.id}] Received chat:message - Text: ${data.text}`);
        // Simple echo back + LLM call for now
        socket.emit("chat:response", { text: data.text, type: "user" }); // Echo user message
        try {
            // Use ChatAgent logic (which uses llmService)
            const response = yield LLMService_1.llmService.generate(data.text); // Use default model
            socket.emit("chat:response", { text: response.content, type: "agent", sender: "ChatAgent" });
        }
        catch (error) {
            LoggerService_1.loggerService.error(`[Socket ${socket.id}] Error processing chat message:`, error);
            socket.emit("chat:response", { text: `Error processing message: ${error.message}`, type: "error" });
        }
    }));
    // --- Terminal --- (Basic Placeholder)
    socket.on("terminal:input", (data) => {
        LoggerService_1.loggerService.info(`[Socket ${socket.id}] Received terminal:input - Input: ${data.input}`);
        // TODO: Route this input to a persistent terminal process associated with the task/socket
        // For now, just echo back a message
        socket.emit("terminal:output", { output: `Backend received: "${data.input}" (Terminal interaction not fully implemented)\n` });
    });
    // --- File System --- (Basic Placeholder)
    socket.on("file:list", (data) => {
        LoggerService_1.loggerService.info(`[Socket ${socket.id}] Received file:list - Path: ${data.path}`);
        // TODO: Integrate with FileAgent or a dedicated FileService
        socket.emit("file:error", { path: data.path, error: "File listing via Socket.IO not implemented yet. Use FileAgent via tasks." });
    });
    // --- Disconnect --- 
    socket.on("disconnect", (reason) => {
        LoggerService_1.loggerService.info(`[Socket ${socket.id}] Disconnected - Reason: ${reason}`);
        // Add cleanup logic if needed (e.g., leave task rooms?)
    });
    // Add other event handlers as needed based on architecture
}

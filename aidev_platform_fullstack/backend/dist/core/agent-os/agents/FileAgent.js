"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const LoggerService_1 = require("../../services/LoggerService");
const agent_os_1 = require("../../agent-os");
// Define a base directory for file operations to prevent access outside the project (basic sandboxing)
// In a real system, this should be much more robust, potentially using a dedicated workspace per task.
const BASE_WORKSPACE_DIR = path.resolve(__dirname, "../../../../../workspace"); // Create a workspace dir at the root
function ensureWorkspaceDir() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs.mkdir(BASE_WORKSPACE_DIR, { recursive: true });
        }
        catch (error) {
            LoggerService_1.loggerService.error(`[FileAgent] Failed to create workspace directory: ${BASE_WORKSPACE_DIR}`, error);
            throw new Error(`Failed to initialize workspace: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
}
// Helper to ensure path stays within the workspace
function resolveWorkspacePath(filePath) {
    const absolutePath = path.resolve(BASE_WORKSPACE_DIR, filePath);
    if (!absolutePath.startsWith(BASE_WORKSPACE_DIR)) {
        throw new Error(`Path traversal detected. Access denied for path: ${filePath}`);
    }
    return absolutePath;
}
class FileAgent {
    constructor() {
        this.name = "FileAgent";
        this.description = "Reads, writes, and lists files within the designated workspace.";
        this.capabilities = ["read_file", "write_file", "list_directory"];
        // Ensure workspace exists when agent is initialized
        ensureWorkspaceDir();
    }
    execute(step, context) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const description = step.description.toLowerCase();
            let operation = null;
            let filePath = null;
            let content = null;
            // Basic parsing of step description (improve with LLM or structured input)
            if (description.startsWith("read file")) {
                operation = "read";
                filePath = step.description.substring("read file".length).trim();
            }
            else if (description.startsWith("write file")) {
                operation = "write";
                const parts = step.description.substring("write file".length).trim().split(" with content: ");
                filePath = (_a = parts[0]) === null || _a === void 0 ? void 0 : _a.trim();
                content = (_b = parts[1]) === null || _b === void 0 ? void 0 : _b.trim(); // Content might need better extraction
            }
            else if (description.startsWith("list directory") || description.startsWith("list files")) {
                operation = "list";
                filePath = step.description.substring(description.startsWith("list directory") ? "list directory".length : "list files".length).trim() || "."; // Default to current dir
            }
            // Add more operations like delete, create directory etc.
            if (!operation || !filePath) {
                return { output: "", error: `Invalid file operation request: ${step.description}` };
            }
            try {
                const resolvedPath = resolveWorkspacePath(filePath);
                LoggerService_1.loggerService.info(`[${this.name}] Performing ${operation} on: ${resolvedPath} (Task: ${context.taskId})`);
                switch (operation) {
                    case "read":
                        const fileContent = yield fs.readFile(resolvedPath, "utf-8");
                        return { output: `Content of ${filePath}:\n${fileContent}` };
                    case "write":
                        if (content === null) {
                            return { output: "", error: "Content for writing is missing." };
                        }
                        // Ensure directory exists before writing
                        yield fs.mkdir(path.dirname(resolvedPath), { recursive: true });
                        yield fs.writeFile(resolvedPath, content, "utf-8");
                        return { output: `Successfully wrote to ${filePath}.` };
                    case "list":
                        const items = yield fs.readdir(resolvedPath, { withFileTypes: true });
                        const itemList = items.map(item => `${item.isDirectory() ? "[DIR] " : "[FILE]"} ${item.name}`).join("\n");
                        return { output: `Contents of directory ${filePath}:\n${itemList}` };
                    default:
                        return { output: "", error: `Unsupported file operation: ${operation}` };
                }
            }
            catch (error) {
                LoggerService_1.loggerService.error(`[${this.name}] File operation failed for task ${context.taskId}: ${operation} on ${filePath}`, error);
                return { output: "", error: `File operation failed: ${error.message}` };
            }
        });
    }
}
// Register the agent instance
agent_os_1.agentOS.registerAgent(new FileAgent());
exports.default = FileAgent;

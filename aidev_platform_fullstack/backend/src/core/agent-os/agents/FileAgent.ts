import * as fs from "fs/promises";
import * as path from "path";
import { Agent, AgentContext, AgentResult, TaskStep } from "../../../types";
import { loggerService } from "../../services/LoggerService";
import { agentOS } from "../../agent-os";

// Define a base directory for file operations to prevent access outside the project (basic sandboxing)
// In a real system, this should be much more robust, potentially using a dedicated workspace per task.
const BASE_WORKSPACE_DIR = path.resolve(__dirname, "../../../../../workspace"); // Create a workspace dir at the root

async function ensureWorkspaceDir() {
    try {
        await fs.mkdir(BASE_WORKSPACE_DIR, { recursive: true });
    } catch (error) {
        loggerService.error(`[FileAgent] Failed to create workspace directory: ${BASE_WORKSPACE_DIR}`, error);
        throw new Error(`Failed to initialize workspace: ${error instanceof Error ? error.message : String(error)}`);
    }
}

// Helper to ensure path stays within the workspace
function resolveWorkspacePath(filePath: string): string {
    const absolutePath = path.resolve(BASE_WORKSPACE_DIR, filePath);
    if (!absolutePath.startsWith(BASE_WORKSPACE_DIR)) {
        throw new Error(`Path traversal detected. Access denied for path: ${filePath}`);
    }
    return absolutePath;
}

class FileAgent implements Agent {
    name = "FileAgent";
    description = "Reads, writes, and lists files within the designated workspace.";
    capabilities = ["read_file", "write_file", "list_directory"];

    constructor() {
        // Ensure workspace exists when agent is initialized
        ensureWorkspaceDir(); 
    }

    async execute(step: TaskStep, context: AgentContext): Promise<AgentResult> {
        const description = step.description.toLowerCase();
        let operation: string | null = null;
        let filePath: string | null = null;
        let content: string | null = null;

        // Basic parsing of step description (improve with LLM or structured input)
        if (description.startsWith("read file")) {
            operation = "read";
            filePath = step.description.substring("read file".length).trim();
        } else if (description.startsWith("write file")) {
            operation = "write";
            const parts = step.description.substring("write file".length).trim().split(" with content: ");
            filePath = parts[0]?.trim();
            content = parts[1]?.trim(); // Content might need better extraction
        } else if (description.startsWith("list directory") || description.startsWith("list files")) {
            operation = "list";
            filePath = step.description.substring(description.startsWith("list directory") ? "list directory".length : "list files".length).trim() || "."; // Default to current dir
        }
        // Add more operations like delete, create directory etc.

        if (!operation || !filePath) {
            return { output: "", error: `Invalid file operation request: ${step.description}` };
        }

        try {
            const resolvedPath = resolveWorkspacePath(filePath);
            loggerService.info(`[${this.name}] Performing ${operation} on: ${resolvedPath} (Task: ${context.taskId})`);

            switch (operation) {
                case "read":
                    const fileContent = await fs.readFile(resolvedPath, "utf-8");
                    return { output: `Content of ${filePath}:\n${fileContent}` };
                
                case "write":
                    if (content === null) {
                        return { output: "", error: "Content for writing is missing." };
                    }
                    // Ensure directory exists before writing
                    await fs.mkdir(path.dirname(resolvedPath), { recursive: true });
                    await fs.writeFile(resolvedPath, content, "utf-8");
                    return { output: `Successfully wrote to ${filePath}.` };

                case "list":
                    const items = await fs.readdir(resolvedPath, { withFileTypes: true });
                    const itemList = items.map(item => `${item.isDirectory() ? "[DIR] " : "[FILE]"} ${item.name}`).join("\n");
                    return { output: `Contents of directory ${filePath}:\n${itemList}` };

                default:
                    return { output: "", error: `Unsupported file operation: ${operation}` };
            }
        } catch (error: any) {
            loggerService.error(`[${this.name}] File operation failed for task ${context.taskId}: ${operation} on ${filePath}`, error);
            return { output: "", error: `File operation failed: ${error.message}` };
        }
    }
}

// Register the agent instance
agentOS.registerAgent(new FileAgent());

export default FileAgent;


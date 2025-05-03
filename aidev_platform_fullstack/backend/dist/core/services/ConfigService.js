"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configService = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') });
class ConfigService {
    constructor() { }
    static getInstance() {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }
    get(key) {
        return process.env[key];
    }
    getOrThrow(key) {
        const value = this.get(key);
        if (!value) {
            throw new Error(`Missing environment variable: ${key}`);
        }
        return value;
    }
    getOpenAIApiKey() {
        return this.get('OPENAI_API_KEY');
    }
    getGeminiApiKey() {
        return this.get('GEMINI_API_KEY');
    }
    getClaudeApiKey() {
        return this.get('CLAUDE_API_KEY');
    }
    // Add getters for other configurations as needed
    getDefaultProvider() {
        return this.get('DEFAULT_LLM_PROVIDER') || 'openai'; // Default to openai
    }
    getDefaultModel() {
        return this.get('DEFAULT_LLM_MODEL') || 'gpt-4o'; // Default to gpt-4o
    }
}
exports.configService = ConfigService.getInstance();

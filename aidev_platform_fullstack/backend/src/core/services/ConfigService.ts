import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

class ConfigService {
    private static instance: ConfigService;

    private constructor() {}

    public static getInstance(): ConfigService {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }

    get(key: string): string | undefined {
        return process.env[key];
    }

    getOrThrow(key: string): string {
        const value = this.get(key);
        if (!value) {
            throw new Error(`Missing environment variable: ${key}`);
        }
        return value;
    }

    getOpenAIApiKey(): string | undefined {
        return this.get('OPENAI_API_KEY');
    }

    getGeminiApiKey(): string | undefined {
        return this.get('GEMINI_API_KEY');
    }

    getClaudeApiKey(): string | undefined {
        return this.get('CLAUDE_API_KEY');
    }

    // Add getters for other configurations as needed
    getDefaultProvider(): string {
        return this.get('DEFAULT_LLM_PROVIDER') || 'openai'; // Default to openai
    }

    getDefaultModel(): string {
        return this.get('DEFAULT_LLM_MODEL') || 'gpt-4o'; // Default to gpt-4o
    }
}

export const configService = ConfigService.getInstance();


import axios, { AxiosError } from 'axios';
import { configService } from '../services/ConfigService';
import { loggerService } from '../services/LoggerService';

// Basic interface for LLM responses (adjust as needed)
interface LLMResponse {
    content: string;
    // Add other potential fields like usage, finish reason, etc.
}

// Interface for generation options
interface GenerateOptions {
    temperature?: number;
    max_tokens?: number;
    // Add other provider-specific options
}

class LLMService {
    private static instance: LLMService;

    private constructor() {}

    public static getInstance(): LLMService {
        if (!LLMService.instance) {
            LLMService.instance = new LLMService();
        }
        return LLMService.instance;
    }

    // Example implementation for OpenAI API
    private async generateWithOpenAI(prompt: string, model: string, options?: GenerateOptions): Promise<LLMResponse> {
        const apiKey = configService.getOpenAIApiKey();
        if (!apiKey || apiKey === 'YOUR_OPENAI_API_KEY') {
            throw new Error('OpenAI API key is not configured.');
        }

        const url = 'https://api.openai.com/v1/chat/completions'; // Use chat completions endpoint
        const headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        };
        const body = {
            model: model,
            messages: [{ role: 'user', content: prompt }], // Simple user prompt
            temperature: options?.temperature ?? 0.7,
            max_tokens: options?.max_tokens ?? 1024,
        };

        try {
            loggerService.debug(`Calling OpenAI API: ${model}`);
            const response = await axios.post(url, body, { headers });
            const content = response.data?.choices?.[0]?.message?.content;
            if (!content) {
                throw new Error('Invalid response structure from OpenAI API');
            }
            loggerService.debug(`OpenAI API response received.`);
            return { content };
        } catch (error) {
            const axiosError = error as AxiosError;
            loggerService.error('Error calling OpenAI API:', axiosError.response?.data || axiosError.message);
            throw new Error(`Failed to generate response from OpenAI: ${axiosError.message}`);
        }
    }

    // Add similar methods for Gemini, Claude, etc.
    // private async generateWithGemini(...) { ... }
    // private async generateWithClaude(...) { ... }

    /**
     * Generates text using the specified LLM provider and model.
     * @param prompt The input prompt.
     * @param provider The LLM provider (e.g., 'openai', 'gemini'). Defaults to config.
     * @param model The specific model name (e.g., 'gpt-4o'). Defaults to config.
     * @param options Additional generation options.
     * @returns The generated content.
     */
    async generate(
        prompt: string,
        provider: string = configService.getDefaultProvider(),
        model: string = configService.getDefaultModel(),
        options?: GenerateOptions
    ): Promise<LLMResponse> {
        loggerService.info(`Generating text with ${provider}/${model}`);
        switch (provider.toLowerCase()) {
            case 'openai':
                return this.generateWithOpenAI(prompt, model, options);
            // case 'gemini':
            //     return this.generateWithGemini(prompt, model, options);
            // case 'claude':
            //     return this.generateWithClaude(prompt, model, options);
            default:
                loggerService.error(`Unsupported LLM provider: ${provider}`);
                throw new Error(`Unsupported LLM provider: ${provider}`);
        }
    }
}

export const llmService = LLMService.getInstance();


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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.llmService = void 0;
const axios_1 = __importDefault(require("axios"));
const ConfigService_1 = require("../services/ConfigService");
const LoggerService_1 = require("../services/LoggerService");
class LLMService {
    constructor() { }
    static getInstance() {
        if (!LLMService.instance) {
            LLMService.instance = new LLMService();
        }
        return LLMService.instance;
    }
    // Example implementation for OpenAI API
    generateWithOpenAI(prompt, model, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const apiKey = ConfigService_1.configService.getOpenAIApiKey();
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
                temperature: (_a = options === null || options === void 0 ? void 0 : options.temperature) !== null && _a !== void 0 ? _a : 0.7,
                max_tokens: (_b = options === null || options === void 0 ? void 0 : options.max_tokens) !== null && _b !== void 0 ? _b : 1024,
            };
            try {
                LoggerService_1.loggerService.debug(`Calling OpenAI API: ${model}`);
                const response = yield axios_1.default.post(url, body, { headers });
                const content = (_f = (_e = (_d = (_c = response.data) === null || _c === void 0 ? void 0 : _c.choices) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.message) === null || _f === void 0 ? void 0 : _f.content;
                if (!content) {
                    throw new Error('Invalid response structure from OpenAI API');
                }
                LoggerService_1.loggerService.debug(`OpenAI API response received.`);
                return { content };
            }
            catch (error) {
                const axiosError = error;
                LoggerService_1.loggerService.error('Error calling OpenAI API:', ((_g = axiosError.response) === null || _g === void 0 ? void 0 : _g.data) || axiosError.message);
                throw new Error(`Failed to generate response from OpenAI: ${axiosError.message}`);
            }
        });
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
    generate(prompt_1) {
        return __awaiter(this, arguments, void 0, function* (prompt, provider = ConfigService_1.configService.getDefaultProvider(), model = ConfigService_1.configService.getDefaultModel(), options) {
            LoggerService_1.loggerService.info(`Generating text with ${provider}/${model}`);
            switch (provider.toLowerCase()) {
                case 'openai':
                    return this.generateWithOpenAI(prompt, model, options);
                // case 'gemini':
                //     return this.generateWithGemini(prompt, model, options);
                // case 'claude':
                //     return this.generateWithClaude(prompt, model, options);
                default:
                    LoggerService_1.loggerService.error(`Unsupported LLM provider: ${provider}`);
                    throw new Error(`Unsupported LLM provider: ${provider}`);
            }
        });
    }
}
exports.llmService = LLMService.getInstance();

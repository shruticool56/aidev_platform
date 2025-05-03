"use strict";
// Simple console logger service
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerService = void 0;
class LoggerService {
    constructor() { }
    static getInstance() {
        if (!LoggerService.instance) {
            LoggerService.instance = new LoggerService();
        }
        return LoggerService.instance;
    }
    log(level, message, ...optionalParams) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, ...optionalParams);
    }
    info(message, ...optionalParams) {
        this.log("info", message, ...optionalParams);
    }
    warn(message, ...optionalParams) {
        this.log("warn", message, ...optionalParams);
    }
    error(message, ...optionalParams) {
        this.log("error", message, ...optionalParams);
    }
    debug(message, ...optionalParams) {
        // Optionally make debug logs conditional based on environment
        if (process.env.NODE_ENV !== "production") {
            this.log("debug", message, ...optionalParams);
        }
    }
}
exports.loggerService = LoggerService.getInstance();

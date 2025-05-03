// Simple console logger service

class LoggerService {
    private static instance: LoggerService;

    private constructor() {}

    public static getInstance(): LoggerService {
        if (!LoggerService.instance) {
            LoggerService.instance = new LoggerService();
        }
        return LoggerService.instance;
    }

    private log(level: string, message: string, ...optionalParams: any[]) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`, ...optionalParams);
    }

    info(message: string, ...optionalParams: any[]) {
        this.log("info", message, ...optionalParams);
    }

    warn(message: string, ...optionalParams: any[]) {
        this.log("warn", message, ...optionalParams);
    }

    error(message: string, ...optionalParams: any[]) {
        this.log("error", message, ...optionalParams);
    }

    debug(message: string, ...optionalParams: any[]) {
        // Optionally make debug logs conditional based on environment
        if (process.env.NODE_ENV !== "production") {
            this.log("debug", message, ...optionalParams);
        }
    }
}

export const loggerService = LoggerService.getInstance();


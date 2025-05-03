"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const LoggerService_1 = require("./core/services/LoggerService");
const ConfigService_1 = require("./core/services/ConfigService"); // Ensure config is loaded early
const handlers_1 = require("./api/ws/handlers");
// --- Ensure Agents are registered ---
// Import agent files to ensure they register themselves via agentOS.registerAgent()
require("./core/agent-os/agents/ExecutorAgent");
require("./core/agent-os/agents/FileAgent");
require("./core/agent-os/agents/ChatAgent");
// Import other agents here as they are created
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Initialize Socket.IO server
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: "*", // Allow all origins for dev, restrict in production
        methods: ["GET", "POST"]
    }
});
const PORT = parseInt(ConfigService_1.configService.get('PORT') || '3001', 10);
// --- Middleware ---
app.use(express_1.default.json()); // For parsing application/json
// Serve static frontend files (Update path as needed)
// const frontendDistPath = path.join(__dirname, '../../frontend/dist');
// loggerService.info(`Serving static files from: ${frontendDistPath}`);
// app.use(express.static(frontendDistPath));
// --- REST API Routes ---
app.get('/api/status', (req, res) => {
    res.json({ status: 'Backend is running', timestamp: new Date().toISOString() });
});
// Placeholder for other REST routes...
// --- WebSocket Connection Handling ---
exports.io.on('connection', (socket) => {
    LoggerService_1.loggerService.info(`Client connected: ${socket.id}`);
    (0, handlers_1.registerSocketHandlers)(socket); // Attach event handlers for this socket
});
// --- Server Start ---
server.listen(PORT, '0.0.0.0', () => {
    LoggerService_1.loggerService.info(`AIDev Platform Backend listening on http://0.0.0.0:${PORT}`);
});
// --- Graceful Shutdown ---
process.on('SIGTERM', () => {
    LoggerService_1.loggerService.info('SIGTERM signal received: closing HTTP server');
    exports.io.close(() => {
        LoggerService_1.loggerService.info('Socket.IO server closed.');
    });
    server.close(() => {
        LoggerService_1.loggerService.info('HTTP server closed');
        // Add cleanup logic here (e.g., close database connections)
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    LoggerService_1.loggerService.info('SIGINT signal received: closing HTTP server');
    exports.io.close(() => {
        LoggerService_1.loggerService.info('Socket.IO server closed.');
    });
    server.close(() => {
        LoggerService_1.loggerService.info('HTTP server closed');
        process.exit(0);
    });
});

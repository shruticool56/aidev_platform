import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import { loggerService } from './core/services/LoggerService';
import { configService } from './core/services/ConfigService'; // Ensure config is loaded early
import { registerSocketHandlers } from './api/ws/handlers';

// --- Ensure Agents are registered ---
// Import agent files to ensure they register themselves via agentOS.registerAgent()
import './core/agent-os/agents/ExecutorAgent';
import './core/agent-os/agents/FileAgent';
import './core/agent-os/agents/ChatAgent';
// Import other agents here as they are created

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO server
export const io = new SocketIOServer(server, {
    cors: {
        origin: "*", // Allow all origins for dev, restrict in production
        methods: ["GET", "POST"]
    }
});

const PORT = parseInt(configService.get('PORT') || '3001', 10);

// --- Middleware ---
app.use(express.json()); // For parsing application/json

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
io.on('connection', (socket) => {
    loggerService.info(`Client connected: ${socket.id}`);
    registerSocketHandlers(socket); // Attach event handlers for this socket
});

// --- Server Start ---
server.listen(PORT, '0.0.0.0', () => {
    loggerService.info(`AIDev Platform Backend listening on http://0.0.0.0:${PORT}`);
});

// --- Graceful Shutdown ---
process.on('SIGTERM', () => {
    loggerService.info('SIGTERM signal received: closing HTTP server');
    io.close(() => {
        loggerService.info('Socket.IO server closed.');
    });
    server.close(() => {
        loggerService.info('HTTP server closed');
        // Add cleanup logic here (e.g., close database connections)
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    loggerService.info('SIGINT signal received: closing HTTP server');
     io.close(() => {
        loggerService.info('Socket.IO server closed.');
    });
    server.close(() => {
        loggerService.info('HTTP server closed');
        process.exit(0);
    });
});


import { io, Socket } from 'socket.io-client';

// Define the backend URL. Adjust if your backend runs elsewhere.
// During development, this might be localhost.
// In production, it would be the deployed backend URL.
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

class SocketService {
  private socket: Socket | null = null;

  connect(): void {
    if (!this.socket) {
      console.log(`Attempting to connect to WebSocket at ${SOCKET_URL}`);
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'], // Force WebSocket transport
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        this.socket = null; // Reset socket on disconnect
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      // --- Generic Event Listeners (Add specific ones as needed) ---
      this.socket.onAny((eventName, ...args) => {
        console.log(`Socket event received: ${eventName}`, args);
      });

      // Example listener for a specific event from the backend
      this.socket.on('chat:response', (data) => {
        console.log('Received chat response from backend:', data);
        // TODO: Update chat UI state
      });

      this.socket.on('task:status', (data) => {
        console.log('Received task status update from backend:', data);
        // TODO: Update task UI state
      });

       this.socket.on('file:data', (data) => {
        console.log('Received file data from backend:', data);
        // TODO: Update file explorer UI state
      });

       this.socket.on('terminal:output', (data) => {
        console.log('Received terminal output from backend:', data);
        // TODO: Update terminal UI state
      });

    }
  }

  disconnect(): void {
    if (this.socket) {
      console.log('Disconnecting socket...');
      this.socket.disconnect();
    }
  }

  emit(eventName: string, data: any): void {
    if (this.socket) {
      console.log(`Emitting socket event: ${eventName}`, data);
      this.socket.emit(eventName, data);
    } else {
      console.error('Socket not connected. Cannot emit event:', eventName);
    }
  }

  // Add methods to register specific event handlers if needed
  on(eventName: string, handler: (...args: any[]) => void): void {
    this.socket?.on(eventName, handler);
  }

  off(eventName: string, handler?: (...args: any[]) => void): void {
    this.socket?.off(eventName, handler);
  }
}

// Export a singleton instance
const socketService = new SocketService();
export default socketService;


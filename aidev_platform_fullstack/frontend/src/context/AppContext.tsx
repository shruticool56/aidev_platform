import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { 
    Agent, // Assuming Agent type is defined locally or imported if needed for frontend state
    Task, 
    TaskStep, 
    TaskStatusPayload, 
    ChatResponsePayload,
    // Import other relevant types
} from '../../types'; // Assuming types are shared or defined appropriately

// --- Socket.IO Connection ---
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001'; // Use env var or default
let socket: Socket | null = null;

// --- Types for Frontend State (similar to backend but managed locally) ---

interface AppState {
  isConnected: boolean;
  agents: Agent[]; // Keep simulated agent list for UI display for now
  currentTask: Task | null;
  chatMessages: ChatResponsePayload[];
  // Add other relevant state: settings, file system view, terminal output etc.
}

// --- Context Definition ---

interface AppContextProps {
  state: AppState;
  // Functions to interact with backend
  startTask: (goal: string) => void;
  sendChatMessage: (message: string) => void;
  // Add more interaction functions: sendTerminalInput, requestFileList etc.
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// --- Context Provider ---

interface AppProviderProps {
  children: ReactNode;
}

// Initial simulated agents (can be replaced by data from backend later)
const initialAgents: Agent[] = [
  // ... (keep the agent list from previous frontend implementation for UI display)
  { name: 'Dev Agent', description: '', capabilities: [], execute: async () => ({ output: '' }) }, // Dummy execute for type compliance
  { name: 'UI Agent', description: '', capabilities: [], execute: async () => ({ output: '' }) },
  { name: 'Infra Agent', description: '', capabilities: [], execute: async () => ({ output: '' }) },
  { name: 'Docs Agent', description: '', capabilities: [], execute: async () => ({ output: '' }) },
  { name: 'File Agent', description: '', capabilities: [], execute: async () => ({ output: '' }) },
  { name: 'Test Agent', description: '', capabilities: [], execute: async () => ({ output: '' }) },
  { name: 'Terminal Agent', description: '', capabilities: [], execute: async () => ({ output: '' }) },
  { name: 'Web Agent', description: '', capabilities: [], execute: async () => ({ output: '' }) },
  { name: 'Installer Agent', description: '', capabilities: [], execute: async () => ({ output: '' }) },
  { name: 'Automation Agent', description: '', capabilities: [], execute: async () => ({ output: '' }) },
  { name: 'Planner Agent', description: '', capabilities: [], execute: async () => ({ output: '' }) },
  { name: 'API Task Agent', description: '', capabilities: [], execute: async () => ({ output: '' }) },
  { name: 'WebAutomation Agent', description: '', capabilities: [], execute: async () => ({ output: '' }) },
  { name: 'Search Agent', description: '', capabilities: [], execute: async () => ({ output: '' }) },
  { name: 'Data Extraction Agent', description: '', capabilities: [], execute: async () => ({ output: '' }) },
  { name: 'Web Reasoning Agent', description: '', capabilities: [], execute: async () => ({ output: '' }) },
  { name: 'Quality Checker', description: '', capabilities: [], execute: async () => ({ output: '' }) },
  { name: 'Safety & Ethics', description: '', capabilities: [], execute: async () => ({ output: '' }) },
  { name: 'Resource Optimizer', description: '', capabilities: [], execute: async () => ({ output: '' }) },
];

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    isConnected: false,
    agents: initialAgents, // Keep for UI, status might come from backend later
    currentTask: null,
    chatMessages: [],
  });

  // --- Socket Event Handlers --- 

  const handleConnect = useCallback(() => {
    console.log('Socket connected:', socket?.id);
    setState(prev => ({ ...prev, isConnected: true }));
  }, []);

  const handleDisconnect = useCallback((reason: string) => {
    console.log('Socket disconnected:', reason);
    setState(prev => ({ ...prev, isConnected: false, currentTask: null })); // Reset task on disconnect?
  }, []);

  const handleTaskStatus = useCallback((payload: TaskStatusPayload) => {
    console.log('Received task:status', payload);
    setState(prev => {
        // If it's a new task or a full update
        if (!prev.currentTask || prev.currentTask.id !== payload.taskId || payload.plan) {
            const newTaskData: Partial<Task> = {
                id: payload.taskId,
                status: payload.status,
                plan: payload.plan || prev.currentTask?.plan || [], // Use new plan if provided
                currentStepIndex: payload.currentStepIndex ?? prev.currentTask?.currentStepIndex ?? -1,
                // Keep existing logs if only status/step changes
                logs: prev.currentTask?.id === payload.taskId ? prev.currentTask.logs : [], 
                goal: payload.goal || prev.currentTask?.goal || '', // Add goal if provided
                error: payload.error
            };
            // Merge with existing task if it's the same ID but only partial update
            const mergedTask = prev.currentTask?.id === payload.taskId 
                               ? { ...prev.currentTask, ...newTaskData } 
                               : newTaskData as Task; // Cast needed if creating new
            return { ...prev, currentTask: mergedTask };
        } else {
            // Just update status or step index if plan isn't sent
            return {
                ...prev,
                currentTask: {
                    ...prev.currentTask,
                    status: payload.status,
                    currentStepIndex: payload.currentStepIndex ?? prev.currentTask.currentStepIndex,
                    error: payload.error
                }
            };
        }
    });
  }, []);

  const handleTaskLog = useCallback((payload: { taskId: string; log: string }) => {
    console.log('Received task:log', payload);
    setState(prev => {
        if (!prev.currentTask || prev.currentTask.id !== payload.taskId) return prev;
        return {
            ...prev,
            currentTask: {
                ...prev.currentTask,
                logs: [...prev.currentTask.logs, payload.log]
            }
        };
    });
  }, []);

  const handleChatResponse = useCallback((payload: ChatResponsePayload) => {
    console.log('Received chat:response', payload);
    setState(prev => ({ ...prev, chatMessages: [...prev.chatMessages, payload] }));
  }, []);

  // Add handlers for terminal:output, file:data etc.

  // --- Socket Connection Effect --- 
  useEffect(() => {
    if (!socket) {
      console.log(`Attempting to connect to backend at ${SOCKET_URL}...`);
      socket = io(SOCKET_URL, {
        transports: ['websocket'] // Prefer WebSocket
      });

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('task:status', handleTaskStatus);
      socket.on('task:log', handleTaskLog);
      socket.on('chat:response', handleChatResponse);
      // Add listeners for other backend events

      socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
        setState(prev => ({ ...prev, isConnected: false }));
      });
    }

    // Cleanup on unmount
    return () => {
      if (socket) {
        console.log('Disconnecting socket...');
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('task:status', handleTaskStatus);
        socket.off('task:log', handleTaskLog);
        socket.off('chat:response', handleChatResponse);
        // Remove other listeners
        socket.disconnect();
        socket = null;
        setState(prev => ({ ...prev, isConnected: false }));
      }
    };
  }, [handleConnect, handleDisconnect, handleTaskStatus, handleTaskLog, handleChatResponse]);

  // --- Actions to Emit to Backend --- 

  const startTask = useCallback((goal: string) => {
    if (socket && state.isConnected) {
      console.log('Emitting task:start', { goal });
      // Reset local task state before starting new one?
      setState(prev => ({ ...prev, currentTask: null, chatMessages: [] })); 
      socket.emit('task:start', { goal });
    } else {
      console.error('Socket not connected. Cannot start task.');
      // Optionally provide user feedback
    }
  }, [state.isConnected]);

  const sendChatMessage = useCallback((text: string) => {
    if (socket && state.isConnected) {
      console.log('Emitting chat:message', { text });
      // Add user message locally immediately for better UX
      setState(prev => ({ 
          ...prev, 
          chatMessages: [...prev.chatMessages, { text, type: 'user' }] 
      }));
      socket.emit('chat:message', { text });
    } else {
      console.error('Socket not connected. Cannot send chat message.');
    }
  }, [state.isConnected]);

  // Add functions for sendTerminalInput, etc.

  // --- Context Value ---

  const value = {
    state,
    startTask,
    sendChatMessage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// --- Custom Hook for easy access ---

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};


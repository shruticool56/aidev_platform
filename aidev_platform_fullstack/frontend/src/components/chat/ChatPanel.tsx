import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext'; // Import the real context
import { TaskStep } from '../../types'; // Import shared types

const ChatPanel: React.FC = () => {
  const { state, startTask, sendChatMessage } = useAppContext();
  const [taskInput, setTaskInput] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const chatLogRef = useRef<HTMLDivElement>(null);
  const planLogRef = useRef<HTMLDivElement>(null);

  const handleTaskSubmit = () => {
    if (taskInput.trim()) {
      startTask(taskInput); // Use context function to start task via backend
      setTaskInput(''); // Clear input after submission
    }
  };

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      sendChatMessage(currentMessage); // Use context function to send message via backend
      setCurrentMessage('');
    }
  };

  // Auto-scroll chat log
  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [state.chatMessages]);

  // Auto-scroll plan/log view
  useEffect(() => {
    if (planLogRef.current) {
      planLogRef.current.scrollTop = planLogRef.current.scrollHeight;
    }
  }, [state.currentTask?.logs, state.currentTask?.plan]);

  // Helper to format plan steps with status
  const formatPlanStep = (step: TaskStep, index: number): string => {
    let prefix = '[ ]';
    if (step.status === 'running') prefix = '[>]';
    if (step.status === 'completed') prefix = '[X]';
    if (step.status === 'failed') prefix = '[!]';
    return `${prefix} ${index + 1}. ${step.description} ${step.error ? `(Error: ${step.error})` : ''}`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 text-white p-4">
      {/* Task Input Area */}
      <div className="mb-4 border-b border-gray-600 pb-4">
        <h3 className="text-lg font-semibold mb-2">Autonomous Task Input</h3>
        <textarea
          className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 resize-none mb-2 h-20"
          placeholder="Enter high-level task description here..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          disabled={!state.isConnected || (state.currentTask?.status === 'running' || state.currentTask?.status === 'planning')} // Disable if not connected or task running
        />
        <button
          className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm ${(!state.isConnected || state.currentTask?.status === 'running' || state.currentTask?.status === 'planning') ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleTaskSubmit}
          disabled={!state.isConnected || (state.currentTask?.status === 'running' || state.currentTask?.status === 'planning')}
        >
          {state.currentTask?.status === 'running' || state.currentTask?.status === 'planning' ? 'Task in Progress...' : 'Start Task'}
        </button>
      </div>

      {/* Task Plan and Log Display Area */}
      <div ref={planLogRef} className="mb-4 flex-grow overflow-y-auto border border-gray-600 rounded p-2 bg-gray-900 h-1/3">
        <h3 className="text-lg font-semibold mb-2 sticky top-0 bg-gray-900">Task Progress</h3>
        {state.currentTask ? (
          <>
            <div className="mb-2">
              <strong>Goal:</strong> {state.currentTask.goal}
            </div>
            <div className="mb-2">
              <strong>Status:</strong> {state.currentTask.status}
            </div>
            {state.currentTask.plan && state.currentTask.plan.length > 0 && (
              <div className="mb-2">
                <strong>Plan:</strong>
                <pre className="text-sm whitespace-pre-wrap">
                  {state.currentTask.plan.map((step, index) => formatPlanStep(step, index)).join('\n')}
                </pre>
              </div>
            )}
            {state.currentTask.logs && state.currentTask.logs.length > 0 && (
              <div>
                <strong>Logs:</strong>
                <pre className="text-sm whitespace-pre-wrap text-gray-400">
                  {state.currentTask.logs.join('\n')}
                </pre>
              </div>
            )}
             {state.currentTask.error && (
                <div className="mt-2 text-red-400">
                    <strong>Error:</strong> {state.currentTask.error}
                </div>
            )}
          </>
        ) : (
          <div className="text-gray-500">No active task. Enter a goal above to start.</div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex flex-col border-t border-gray-600 pt-4 h-1/3">
        <h3 className="text-lg font-semibold mb-2">Agent Chat</h3>
        <div ref={chatLogRef} className="flex-grow overflow-y-auto mb-4 border border-gray-600 rounded p-2 bg-gray-900">
          {state.chatMessages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded max-w-xs break-words ${msg.type === 'user' ? 'bg-blue-600' : msg.type === 'error' ? 'bg-red-700' : 'bg-gray-700'}`}>
                {msg.type !== 'user' && <strong>{msg.sender || msg.type.toUpperCase()}:</strong>} {msg.text}
              </span>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            className={`flex-grow p-2 rounded-l bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500 ${!state.isConnected ? 'opacity-50' : ''}`}
            placeholder={state.isConnected ? "Type your message..." : "Connecting to backend..."}
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={!state.isConnected}
          />
          <button
            className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-r ${!state.isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSendMessage}
            disabled={!state.isConnected}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;


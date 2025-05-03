import React, { useState, useEffect } from 'react';

// Simulate task execution status
const taskStatuses = [
  'Idle',
  'Planning task...', 
  'Selecting agent: Dev Agent (Simulated)',
  'Executing step 1: Analyze requirements (Simulated)',
  'Agent response: Requirements analyzed (Simulated)',
  'Selecting agent: UI Agent (Simulated)',
  'Executing step 2: Design UI mockups (Simulated)',
  'Agent response: Mockups created (Simulated)',
  'Task complete (Simulated)',
  'Error: Agent Timeout (Simulated)',
  'Retrying step... (Simulated)'
];

const StatusBar: React.FC = () => {
  const [currentStatus, setCurrentStatus] = useState('Idle');
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    // Simulate status changes
    let statusIndex = 0;
    const statusInterval = setInterval(() => {
      statusIndex = (statusIndex + 1) % taskStatuses.length;
      // Skip 'Idle' sometimes to make it look more active
      if (taskStatuses[statusIndex] === 'Idle' && Math.random() > 0.7) {
        statusIndex = (statusIndex + 1) % taskStatuses.length; 
      }
      setCurrentStatus(taskStatuses[statusIndex]);
    }, 5000); // Change status every 5 seconds

    // Update time every second
    const timeInterval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(statusInterval);
      clearInterval(timeInterval);
    };
  }, []);

  return (
    <div className="h-6 bg-blue-700 text-white flex items-center justify-between px-4 text-xs">
      <div className="flex items-center space-x-4">
        <span>AIDev Platform (Enhanced Frontend Simulation)</span>
        <span>|</span>
        <span>Status: {currentStatus}</span>
      </div>
      <div className="flex items-center space-x-4">
        <span>{dateTime.toLocaleTimeString()}</span>
        <span>{dateTime.toLocaleDateString()}</span>
        {/* Add other status icons/info here if needed */}
      </div>
    </div>
  );
};

export default StatusBar;


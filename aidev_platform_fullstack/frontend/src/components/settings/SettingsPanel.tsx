import React, { useState, useEffect } from 'react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    openaiApiKey: '',
    geminiApiKey: '',
    claudeApiKey: '',
    selectedModel: 'gpt-4o', // Default simulated model
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('aidevPlatformSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse settings from localStorage:', error);
        // Clear corrupted settings
        localStorage.removeItem('aidevPlatformSettings');
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('aidevPlatformSettings', JSON.stringify(settings));
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Settings (Simulated)</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="openaiApiKey">OpenAI API Key:</label>
            <input
              type="password" // Use password type for keys
              id="openaiApiKey"
              name="openaiApiKey"
              value={settings.openaiApiKey}
              onChange={handleChange}
              placeholder="Enter your OpenAI API Key"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Stored in browser localStorage. Use with caution.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="geminiApiKey">Gemini API Key:</label>
            <input
              type="password"
              id="geminiApiKey"
              name="geminiApiKey"
              value={settings.geminiApiKey}
              onChange={handleChange}
              placeholder="Enter your Gemini API Key"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            />
             <p className="text-xs text-gray-500 mt-1">Stored in browser localStorage.</p>
         </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="claudeApiKey">Claude API Key:</label>
            <input
              type="password"
              id="claudeApiKey"
              name="claudeApiKey"
              value={settings.claudeApiKey}
              onChange={handleChange}
              placeholder="Enter your Claude API Key"
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            />
             <p className="text-xs text-gray-500 mt-1">Stored in browser localStorage.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="selectedModel">Active Model (Simulated):</label>
            <select
              id="selectedModel"
              name="selectedModel"
              value={settings.selectedModel}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
            >
              <option value="gpt-4o">GPT-4o (Simulated)</option>
              <option value="gemini-pro">Gemini Pro (Simulated)</option>
              <option value="claude-3">Claude 3 (Simulated)</option>
              <option value="llama3-local">LLaMA3 Local (Simulated)</option>
              {/* Add other simulated models */}
            </select>
            <p className="text-xs text-gray-500 mt-1">This selection currently only affects UI labels.</p>
          </div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;


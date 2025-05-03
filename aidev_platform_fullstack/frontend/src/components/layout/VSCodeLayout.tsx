import React, { useState } from 'react';
import MenuBar from '../menubar/MenuBar';
import SideBar from '../sidebar/SideBar';
import Explorer from '../explorer/Explorer';
import Editor from '../editor/Editor';
import ChatPanel from "../chat/ChatPanel";
import StatusBar from "../statusbar/StatusBar";
import SettingsPanel from '../settings/SettingsPanel'; // Import SettingsPanel

const VSCodeLayout: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleToggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white">
      <MenuBar onSettingsClick={handleToggleSettings} /> {/* Pass handler to MenuBar */}
      <div className="flex flex-grow overflow-hidden">
        <SideBar />
        <Explorer />
        <div className="flex flex-col flex-grow">
          <Editor />
          {/* Consider making ChatPanel resizable or part of a split pane */}
          <div className="h-1/3 border-t border-gray-700">
            <ChatPanel />
          </div>
        </div>
      </div>
      <StatusBar />
      <SettingsPanel isOpen={isSettingsOpen} onClose={handleToggleSettings} /> {/* Render SettingsPanel */}
    </div>
  );
};

export default VSCodeLayout;


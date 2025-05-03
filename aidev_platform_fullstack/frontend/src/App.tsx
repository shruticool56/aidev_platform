import React, { useEffect } from 'react';
import VSCodeLayout from './components/layout/VSCodeLayout';
import { menuConfig } from './data/menuConfig';
import { sidebarItems, fileExplorer, statusBarItems } from './data/sidebarConfig';
import socketService from './services/socketService'; // Import the socket service

function App() {
  // Establish WebSocket connection on component mount
  useEffect(() => {
    socketService.connect();

    // Clean up the connection when the component unmounts
    return () => {
      socketService.disconnect();
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#1e1e1e] text-white font-sans">
      <VSCodeLayout 
        menuItems={menuConfig}
        sidebarItems={sidebarItems}
        fileExplorer={fileExplorer}
        statusBarItems={statusBarItems}
      />
    </div>
  );
}

export default App;
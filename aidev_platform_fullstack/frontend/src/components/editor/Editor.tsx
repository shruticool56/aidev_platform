import React, { useState } from 'react';
import Tabs from './Tabs';
import { Tab } from '../../types';
import EditorContent from './EditorContent';

const Editor: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'App.tsx', active: true },
    { id: '2', title: 'index.css', active: false },
    { id: '3', title: 'package.json', active: false }
  ]);

  const handleTabClick = (id: string) => {
    setTabs(tabs.map(tab => ({
      ...tab,
      active: tab.id === id
    })));
  };

  const handleTabClose = (id: string) => {
    const newTabs = tabs.filter(tab => tab.id !== id);
    
    // If we closed the active tab, activate the first remaining tab
    if (tabs.find(tab => tab.id === id)?.active && newTabs.length > 0) {
      newTabs[0].active = true;
    }
    
    setTabs(newTabs);
  };

  const activeTab = tabs.find(tab => tab.active);

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e]">
      <Tabs 
        tabs={tabs} 
        onTabClick={handleTabClick} 
        onTabClose={handleTabClose} 
      />
      <div className="flex-1 overflow-auto">
        {activeTab ? (
          <EditorContent filename={activeTab.title} />
        ) : (
          <div className="flex items-center justify-center h-full text-[#cccccc]">
            <div className="text-center">
              <p className="text-2xl mb-2">No files open</p>
              <p className="text-sm">Open a file from the explorer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
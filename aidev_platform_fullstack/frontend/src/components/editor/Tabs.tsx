import React from 'react';
import { X } from 'lucide-react';
import { Tab } from '../../types';

interface TabsProps {
  tabs: Tab[];
  onTabClick: (id: string) => void;
  onTabClose: (id: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, onTabClick, onTabClose }) => {
  return (
    <div className="flex bg-[#252526] border-b border-[#1e1e1e] h-[35px] overflow-x-auto hide-scrollbar">
      {tabs.map(tab => (
        <div 
          key={tab.id}
          className={`flex items-center px-3 h-full border-r border-[#1e1e1e] min-w-[120px] max-w-[200px] ${
            tab.active ? 'bg-[#1e1e1e]' : 'bg-[#2d2d2d] hover:bg-[#2a2a2a]'
          }`}
          onClick={() => onTabClick(tab.id)}
        >
          <span className="text-sm truncate flex-1 mr-2 text-[#cccccc]">{tab.title}</span>
          <button 
            className="text-[#8a8a8a] hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
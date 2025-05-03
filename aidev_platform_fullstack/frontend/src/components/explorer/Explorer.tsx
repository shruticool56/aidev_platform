import React, { useState } from 'react';
import { FileItem } from '../../types';
import { ChevronDown, ChevronRight, File, Folder } from 'lucide-react';

interface ExplorerProps {
  items: FileItem[];
}

const ExplorerItem: React.FC<{ item: FileItem, level: number }> = ({ item, level }) => {
  const [expanded, setExpanded] = useState(item.expanded || false);
  
  const toggleExpand = () => {
    if (item.type === 'folder') {
      setExpanded(!expanded);
    }
  };

  return (
    <div>
      <div 
        className="flex items-center px-2 py-1 hover:bg-[#2a2d2e] cursor-pointer"
        style={{ paddingLeft: `${level * 8 + 8}px` }}
        onClick={toggleExpand}
      >
        {item.type === 'folder' ? (
          <>
            <span className="mr-1 text-[#cccccc]">
              {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
            <Folder size={16} className="mr-1 text-[#c09553]" />
          </>
        ) : (
          <>
            <span className="mr-1 w-4"></span>
            <File size={16} className="mr-1 text-[#cccccc]" />
          </>
        )}
        <span className="text-sm text-[#cccccc]">{item.name}</span>
      </div>
      
      {expanded && item.children && (
        <div>
          {item.children.map(child => (
            <ExplorerItem key={child.id} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const Explorer: React.FC<ExplorerProps> = ({ items }) => {
  return (
    <div className="w-64 bg-[#252526] flex flex-col">
      <div className="px-4 py-2 uppercase text-xs font-semibold text-[#bbbbbb] flex justify-between items-center">
        <span>Explorer: RANDOM1</span>
      </div>
      <div className="overflow-auto flex-grow">
        {items.map(item => (
          <ExplorerItem key={item.id} item={item} level={0} />
        ))}
      </div>
    </div>
  );
};

export default Explorer;
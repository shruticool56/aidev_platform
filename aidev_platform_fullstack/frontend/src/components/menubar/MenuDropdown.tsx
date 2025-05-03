import React from 'react';
import { MenuItemType } from '../../types';

interface MenuDropdownProps {
  items: MenuItemType[];
}

const MenuDropdown: React.FC<MenuDropdownProps> = ({ items }) => {
  return (
    <div className="absolute top-full left-0 bg-[#252526] shadow-lg z-50 w-64 py-1 border border-[#3c3c3c]">
      {items.map((item, index) => (
        item.divider ? (
          <div key={`divider-${index}`} className="border-t border-[#3c3c3c] my-1" />
        ) : (
          <button 
            key={item.label} 
            className="w-full text-left px-3 py-1 hover:bg-[#094771] flex items-center justify-between text-sm"
          >
            <span>{item.label}</span>
            {item.shortcut && <span className="text-[#8a8a8a] text-xs">{item.shortcut}</span>}
          </button>
        )
      ))}
    </div>
  );
};

export default MenuDropdown;
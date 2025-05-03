import React from 'react';
import { menuConfig } from '../../data/menuConfig';
import MenuDropdown from './MenuDropdown';
import SearchBar from './SearchBar';

interface MenuBarProps {
  onSettingsClick: () => void; // Add prop to handle settings click
}

const MenuBar: React.FC<MenuBarProps> = ({ onSettingsClick }) => {
  return (
    <div className="h-8 bg-gray-800 text-gray-300 flex items-center justify-between px-2 text-sm">
      <div className="flex items-center space-x-1">
        {/* Logo/Icon placeholder */}
        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center mr-2">
          <span className="text-white font-bold text-xs">AI</span>
        </div>
        {menuConfig.map((menu, index) => (
          <MenuDropdown key={index} title={menu.title} items={menu.items} />
        ))}
        {/* Add Settings Button/Menu Item */}
        <button 
          onClick={onSettingsClick} 
          className="px-3 py-1 hover:bg-gray-700 rounded cursor-pointer"
        >
          Settings
        </button>
      </div>
      <div className="flex items-center">
        <SearchBar />
        {/* Window controls placeholder */}
        <div className="flex space-x-1 ml-4">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;


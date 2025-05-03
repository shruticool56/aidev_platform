import React from 'react';
import { Search } from 'lucide-react';

const SearchBar: React.FC = () => {
  return (
    <div className="relative w-[300px] h-7 flex items-center">
      <input
        type="text"
        placeholder="random1"
        className="bg-[#3c3c3c] w-full h-full rounded text-sm px-8 text-white placeholder:text-[#8a8a8a] focus:outline-none focus:ring-1 focus:ring-[#007fd4]"
      />
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#8a8a8a]">
        <Search size={14} />
      </div>
    </div>
  );
};

export default SearchBar;
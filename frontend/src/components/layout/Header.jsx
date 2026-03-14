import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10 w-full">
      <div className="flex bg-gray-100 rounded-md px-3 py-2 w-96 max-w-md items-center shadow-sm">
        <Search className="text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search global..." 
          className="bg-transparent border-none outline-none ml-2 w-full text-sm text-gray-700 placeholder-gray-400"
        />
      </div>

      <div className="flex items-center gap-5">
        <button className="relative text-gray-500 hover:text-gray-700 transition">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 cursor-pointer pl-4 border-l border-gray-200">
          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <User className="w-5 h-5" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-700 leading-none">Admin User</p>
            <p className="text-xs text-gray-500 mt-1">Superadmin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

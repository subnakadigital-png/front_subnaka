'use client';

import React, { useState } from 'react';
import { Menu as MenuIcon, Search as SearchIcon, Bell as BellIcon, User as UserIcon, LogOut as LogOutIcon, ChevronDown as ChevronDownIcon } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onSignOut: () => void;
}

export default function Header({ activeTab, isSidebarOpen, setIsSidebarOpen, onSignOut }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const capitalize = (s: string) => {
    if (typeof s !== 'string' || s.length === 0) return '';
    // Replace hyphens with spaces and capitalize each word
    return s.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  return (
    <header className="bg-white/70 backdrop-blur-lg sticky top-0 z-10 border-b border-slate-200">
      <div className="flex items-center justify-between h-20 px-8">
        {/* --- Left Side --- */}
        <div className="flex items-center space-x-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 lg:hidden">
            <MenuIcon className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-slate-800 hidden md:block">{capitalize(activeTab)}</h1>
        </div>

        {/* --- Right Side --- */}
        <div className="flex items-center space-x-5">
          {/* --- Search Bar --- */}
          <div className="relative hidden md:block">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full max-w-xs pl-11 pr-4 py-2.5 bg-slate-100 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-slate-300 transition"
            />
          </div>

          {/* --- Notification Bell --- */}
          <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 relative">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          {/* --- User Menu --- */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100"
            >
              <div className="w-9 h-9 bg-yellow-500 rounded-full flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
              <span className="hidden lg:block font-semibold text-sm text-slate-700">Admin</span>
              <ChevronDownIcon className="w-4 h-4 text-slate-500 hidden lg:block" />
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-slate-200 py-2 animate-fade-in-down"
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-200">
                  <p className="text-sm font-semibold text-slate-800">Administrator</p>
                  <p className="text-xs text-slate-500">admin@subnaka.com</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={onSignOut}
                    className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOutIcon className="mr-3 w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

import React from 'react';
import { LayoutDashboard, MessageSquare, Users, BookOpen, Settings, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { id: 'FEED', label: 'Discussions', icon: MessageSquare, view: 'FEED' as ViewState },
    { id: 'ANALYTICS', label: 'Analytics', icon: LayoutDashboard, view: 'ANALYTICS' as ViewState },
    { id: 'RESOURCES', label: 'Resources', icon: BookOpen, view: 'FEED' as ViewState }, // Placeholder
    { id: 'PROFILE', label: 'Profile', icon: Users, view: 'PROFILE' as ViewState },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          UniConnect
        </h1>
        <p className="text-slate-400 text-xs mt-1">Student Forum Platform</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.view)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === item.view && item.id !== 'RESOURCES' // Hack for demo placeholder
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors mt-2">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
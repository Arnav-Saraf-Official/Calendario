'use client';

import React from 'react';
import { Calendar, CheckSquare, Heart, Settings, GraduationCap } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
}

export default function Sidebar({ activeTab, setActiveTab, user }: SidebarProps) {
  const handleLogout = async () => {
    await signOut();
  };

  const menuItems = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'assignments', label: 'Assignments', icon: CheckSquare },
    { id: 'hobbies', label: 'Hobbies', icon: Heart },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-3 text-white">
        <div className="bg-indigo-500 p-2 rounded-lg">
          <GraduationCap size={24} />
        </div>
        <span className="font-bold text-xl tracking-tight">StudyFlow</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-4">
        <div className="flex items-center gap-3 px-2">
          <img 
            src={user?.image} 
            alt="Avatar" 
            className="w-8 h-8 rounded-full border border-slate-700"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors text-sm">
            <Settings size={18} />
            <span className="font-medium">Settings</span>
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-900/20 text-red-400 hover:text-red-300 transition-colors text-sm"
          >
            <Settings size={18} className="rotate-45" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

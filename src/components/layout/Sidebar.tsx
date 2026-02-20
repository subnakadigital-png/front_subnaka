import React, { useState } from 'react';
import {
  LayoutDashboard,
  Home,
  Users,
  Settings,
  FileCheck,
  Briefcase as BriefcaseIcon,
  MessageCircle,
  LifeBuoy,
  Megaphone,
  PenTool,
  Calendar,
  Shield,
  DollarSign,
  Heart,
  ClipboardList,
} from 'lucide-react';

interface SidebarProps {
  isSidebarOpen: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, activeTab, setActiveTab }) => {
  const [selectedLang, setSelectedLang] = useState('en');

  const languages = [
    { code: 'la', name: 'Laos', flag: '🇱🇦' },
    { code: 'cn', name: 'China', flag: '🇨🇳' },
    { code: 'th', name: 'Thailand', flag: '🇹🇭' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  return (
    <aside className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      <div className="h-20 flex items-center px-6 border-b border-slate-100">
        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3 shrink-0">
          <Home className="text-white w-5 h-5" />
        </div>
        {isSidebarOpen && <span className="text-xl font-bold tracking-tight">Sabnaka<span className="text-yellow-500">.</span>la</span>}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {[
          { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
          { id: 'properties', icon: Home, label: 'Properties' },
          { id: 'saved-properties', icon: Heart, label: 'Saved Properties' },
          { id: 'agreements', icon: FileCheck, label: 'Sale Agreements' },
          { id: 'crm', icon: BriefcaseIcon, label: 'CRM & Pipeline' },
          { id: 'messages', icon: MessageCircle, label: 'Messages' },
          { id: 'support', icon: LifeBuoy, label: 'Customer Service' },
          { id: 'marketing', icon: Megaphone, label: 'Marketing' },
          { id: 'content', icon: PenTool, label: 'Content / CMS' },
          { id: 'calendar', icon: Calendar, label: 'Calendar' },
          { id: 'tasks', icon: ClipboardList, label: 'Tasks' },
          { id: 'invoices', icon: DollarSign, label: 'Invoices' },
          { id: 'staff', icon: Shield, label: 'Staff & Roles' },
          { id: 'users', icon: Users, label: 'User Directory' },
          { id: 'settings', icon: Settings, label: 'Settings' },
          { id: 'finance', icon: DollarSign, label: 'Commission' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-yellow-400' : ''}`} />
            {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Language Selector */}
      <div className="p-4 mt-auto border-t border-slate-100">
        {isSidebarOpen ? (
            <div className="flex justify-around items-center">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl transition-transform transform hover:scale-110 ${
                    selectedLang === lang.code ? 'ring-2 ring-yellow-500 ring-offset-2' : 'opacity-70'
                  }`}
                  title={lang.name}
                >
                  {lang.flag}
                </button>
              ))}
            </div>
        ) : (
          <div className="flex flex-col space-y-4 items-center">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl transition-transform transform hover:scale-110 ${
                  selectedLang === lang.code ? 'ring-2 ring-yellow-500' : 'opacity-70'
                }`}
                title={lang.name}
              >
                {lang.flag}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

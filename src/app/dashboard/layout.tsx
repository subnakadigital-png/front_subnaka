'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Home, 
  LogOut, 
  User, 
  Settings, 
  Loader2, 
  Briefcase, 
  Heart,
  MessageSquare,
  Calendar,
  CheckSquare,
  FileText,
  FileSignature,
  Users,
} from 'lucide-react';

// --- Re-usable Components --- 

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-yellow-500 text-white shadow-md' : 'text-slate-200 hover:bg-slate-700 hover:text-white'}`}>
      {children}
    </Link>
  );
};

const DashboardNav = ({ userEmail, onLogout }: { userEmail: string | null; onLogout: () => void }) => {
  const [selectedLang, setSelectedLang] = useState('en');

  const languages = [
    { code: 'la', name: 'Laos', flag: '🇱🇦' },
    { code: 'cn', name: 'China', flag: '🇨🇳' },
    { code: 'th', name: 'Thailand', flag: '🇹🇭' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  return (
    <div className="flex flex-col h-full w-64 bg-slate-800 text-white shadow-lg shrink-0 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600">
      <div className="sticky top-0 z-10 bg-slate-800 flex items-center justify-center py-6 px-4 border-b border-slate-700">
          <div className="bg-yellow-500 p-2.5 rounded-xl mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h6m-6 4h6m-6 4h6"></path></svg>
        </div>
        <h1 className="text-xl font-bold tracking-wider">Subnaka</h1>
      </div>
      <nav className="flex-grow px-4 py-6 space-y-1">
        <p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Main</p>
        <NavLink href="/dashboard"><LayoutDashboard className="w-5 h-5 mr-3" />Overview</NavLink>
        <NavLink href="/dashboard/properties"><Home className="w-5 h-5 mr-3" />Properties</NavLink>
        <NavLink href="/dashboard/saved-properties"><Heart className="w-5 h-5 mr-3" />Saved</NavLink>
        
        {/* Language Selector */}
        <div className="px-4 pt-5 pb-2">
          <div className="flex justify-around items-center">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl transition-transform transform hover:scale-110 ${
                  selectedLang === lang.code ? 'ring-2 ring-yellow-500 ring-offset-slate-800 ring-offset-2' : 'opacity-70'
                }`}
                title={lang.name}
              >
                {lang.flag}
              </button>
            ))}
          </div>
        </div>

        <p className="px-4 pt-6 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">CRM & Operations</p>
        <NavLink href="/dashboard/enquiries"><MessageSquare className="w-5 h-5 mr-3" />Enquiries</NavLink>
        <NavLink href="/dashboard/customers"><Users className="w-5 h-5 mr-3" />Customers</NavLink>
        <NavLink href="/dashboard/calendar"><Calendar className="w-5 h-5 mr-3" />Calendar</NavLink>
        <NavLink href="/dashboard/tasks"><CheckSquare className="w-5 h-5 mr-3" />Tasks</NavLink>
        
        <p className="px-4 pt-6 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Business</p>
        <NavLink href="/dashboard/invoices"><FileText className="w-5 h-5 mr-3" />Invoices</NavLink>
        <NavLink href="/dashboard/agreements"><FileSignature className="w-5 h-5 mr-3" />Agreements</NavLink>
        <NavLink href="/dashboard/staff"><Users className="w-5 h-5 mr-3" />Staff & HRM</NavLink>
        
        <p className="px-4 pt-6 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">System</p>
        <NavLink href="/dashboard/settings"><Settings className="w-5 h-5 mr-3" />Settings</NavLink>
      </nav>
      <div className="sticky bottom-0 bg-slate-800 px-4 py-6 border-t border-slate-700 space-y-4 mt-auto">
        {userEmail && (
          <div className='flex items-center px-2'>
              <User className="w-5 h-5 mr-3 text-slate-400"/>
              <span className='text-sm font-medium text-slate-300 truncate'>{userEmail}</span>
          </div>
        )}
        <button onClick={onLogout} className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-md transition-colors">
            <LogOut className="w-5 h-5 mr-3" />Logout
        </button>
      </div>
    </div>
  );
}

const FullScreenLoader = ({ message }: { message: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <Loader2 className="h-8 w-8 text-yellow-500 animate-spin" />
    <p className="ml-4 text-lg text-slate-700">{message}</p>
  </div>
);

// --- Main Layout Component --- 

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  console.log("Forcing a refresh"); // This is a temporary line to force a refresh
  const { user, loading, logOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== '/dashboard/login') {
        router.push('/dashboard/login');
      } else if (user && pathname === '/dashboard/login') {
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Failed to log out: ", error);
    }
  };

  if (loading) {
    return <FullScreenLoader message="Authenticating..." />;
  }

  if (!user && pathname !== '/dashboard/login') {
    return <FullScreenLoader message="Redirecting..." />;
  }
  
  if (!user && pathname === '/dashboard/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <DashboardNav userEmail={user?.email || null} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

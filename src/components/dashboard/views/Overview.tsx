"use client";

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  DollarSign,
  LifeBuoy,
  Briefcase as BriefcaseIcon,
  Users,
} from 'lucide-react';

import StatCard from '@/components/dashboard/shared/StatCard';
import Badge from '@/components/dashboard/shared/Badge';

import { RevenueData, Ticket, Deal, User, Event } from '@/lib/types';
import { revenueData } from '@/lib/data';


interface OverviewViewProps {
  setActiveTab: (tab: string) => void;
  events: Event[];
  tickets: Ticket[];
  deals: Deal[];
  users: User[];
  revenueData: RevenueData[];
}

const OverviewView: React.FC<OverviewViewProps> = ({ setActiveTab, events, tickets, deals, users, revenueData }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    {/* KPI Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Earnings" value="$384,500" subtext="Commission + Platform Fees" icon={DollarSign} trend={12.5} />
      <StatCard title="Open Tickets" value={tickets.filter(t => t.status === "Open").length} subtext="Support requests pending" icon={LifeBuoy} trend={-5.0} />
      <StatCard title="Active Deals" value={deals.length} subtext="In the sales pipeline" icon={BriefcaseIcon} trend={8.4} />
      <StatCard title="Total Users" value={users.length} subtext="Registered accounts" icon={Users} trend={2.1} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">Revenue Breakdown</h3>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Commission
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-3 h-3 rounded-full bg-slate-900"></span> Fees
            </div>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="commission" fill="#eab308" radius={[4, 4, 0, 0]} barSize={32} />
              <Bar dataKey="platformFees" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">Upcoming Events</h3>
          <button onClick={() => setActiveTab('calendar')} className="text-yellow-600 text-sm font-bold hover:underline">View All</button>
        </div>
        <div className="space-y-4">
           {events.map((evt) => (
               <div key={evt.id} className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl">
                   <div className="bg-white p-2 rounded-lg border border-slate-100 text-center min-w-[50px]">
                       <span className="block text-xs font-bold text-slate-400">{evt.date === 'Today' ? 'TOD' : 'TOM'}</span>
                       <span className="block text-sm font-bold text-slate-900">{evt.time.split(':')[0]}</span>
                   </div>
                   <div>
                       <h4 className="text-sm font-bold text-slate-900">{evt.title}</h4>
                       <p className="text-xs text-slate-500">{evt.with}</p>
                       <div className="mt-1"><Badge status={evt.type} /></div>
                   </div>
               </div>
           ))}
        </div>
      </div>
    </div>
  </div>
);

export default OverviewView;
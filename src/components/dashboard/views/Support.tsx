"use client";
import React from 'react';
import { PlusCircle, Filter, MessageSquare } from 'lucide-react';
import Badge from '@/components/dashboard/shared/Badge'; // Assuming Badge is in ../../shared/Badge.tsx

interface Ticket {
  id: number;
  user: string;
  subject: string;
  priority: string;
  status: string;
  date: string;
}

interface SupportViewProps {
  tickets: Ticket[];
}

const SupportView: React.FC<SupportViewProps> = ({ tickets }) => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Support Center</h2>
        <p className="text-slate-500 text-sm">Manage tickets and customer service inquiries.</p>
      </div>
      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-bold hover:bg-yellow-600">
          <PlusCircle className="w-4 h-4" /> Create Ticket
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-700">Recent Tickets</h3>
            <Filter className="w-4 h-4 text-slate-400 cursor-pointer" />
          </div>
          <div className="divide-y divide-slate-100">
            {tickets.map(ticket => (
              <div key={ticket.id} className="p-4 hover:bg-slate-50 transition cursor-pointer flex justify-between items-center group">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 w-2 h-2 rounded-full ${ticket.status === 'Open' ? 'bg-red-500' : ticket.status === 'In Progress' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{ticket.subject}</h4>
                    <p className="text-xs text-slate-500">From: {ticket.user} • {ticket.date}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <Badge status={ticket.priority} />
                  <Badge status={ticket.status} />
                  <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-200 rounded-full transition">
                    <MessageSquare className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-4">Support Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Open Tickets</span>
              <span className="font-bold text-slate-900">1</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '33%' }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Avg Response Time</span>
              <span className="font-bold text-slate-900">2h 15m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SupportView;
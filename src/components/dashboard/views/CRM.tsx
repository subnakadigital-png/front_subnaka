"use client";
import React from 'react';
import { Users, PlusCircle, MoreHorizontal, MessageCircle, MessageSquare } from 'lucide-react';
import Badge from '@/components/dashboard/shared/Badge'; // Adjust path as necessary

interface Lead {
  id: number;
  name: string;
  type: string;
  property: string;
  date: string;
  status: string;
  contact: string;
}

interface Deal {
  id: number;
  title: string;
  value: string;
  stage: string;
  probability: string;
  owner: string;
}

interface CRMViewProps {
  leads: Lead[];
  deals: Deal[];
  setActiveTab: (tab: string) => void;
}

const CRMView: React.FC<CRMViewProps> = ({ leads, deals, setActiveTab }) => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">CRM & Pipeline</h2>
        <p className="text-slate-500 text-sm">Manage leads, deals, and sales pipeline.</p>
      </div>
      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
          <PlusCircle className="w-4 h-4" /> New Deal
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <Users className="w-4 h-4" /> Incoming Leads
          </h3>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-bold">{leads.length} New</span>
        </div>
        <div className="divide-y divide-slate-100">
          {leads.map((lead) => (
            <div key={lead.id} className="p-4 flex items-start gap-3 hover:bg-slate-50 transition cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0">
                {lead.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{lead.name}</h4>
                  <span className="text-xs text-slate-400">{lead.date}</span>
                </div>
                <p className="text-xs text-slate-500 mb-1">{lead.type}</p>
                <div className="flex gap-2 mt-2">
                  <button className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-bold border border-green-100 hover:bg-green-100" onClick={() => setActiveTab('messages')}>
                    <MessageCircle className="w-3 h-3" /> WhatsApp
                  </button>
                  <button className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold border border-blue-100 hover:bg-blue-100">
                    <MessageSquare className="w-3 h-3" /> Email
                  </button>
                </div>
              </div>
              <div><Badge status={lead.status} /></div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Active Pipeline</h3>
          <span className="text-xs font-bold text-slate-500">Total: $536k</span>
        </div>
        {deals.map((deal) => (
          <div key={deal.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition cursor-pointer relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
            <div className="pl-3">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-slate-900 text-sm">{deal.title}</h4>
                <MoreHorizontal className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100" />
              </div>
              <p className="text-lg font-bold text-green-600 mb-2">{deal.value}</p>
              <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                <span className="bg-slate-100 px-2 py-0.5 rounded">{deal.stage}</span>
                <span>{deal.owner}</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: deal.probability }}></div>
              </div>
              <p className="text-[10px] text-right text-slate-400 mt-1">{deal.probability} probability</p>
            </div>
          </div>
        ))}
        <button className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:bg-slate-50 hover:text-slate-700 transition">
          + Add Deal Stage
        </button>
      </div>
    </div>
  </div>
);

export default CRMView;
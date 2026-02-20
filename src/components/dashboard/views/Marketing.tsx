"use client";
import React from 'react';
import { Megaphone, Globe, Activity, MoreHorizontal } from 'lucide-react';
import Badge from '@/components/dashboard/shared/Badge'; // Updated import path

interface Campaign {
  id: number;
  name: string;
  type: string;
  status: string;
  reach: string;
  clicks: string;
}

interface MarketingViewProps {
  campaigns: Campaign[];
}

const MarketingView: React.FC<MarketingViewProps> = ({ campaigns }) => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Marketing Campaigns</h2>
        <p className="text-slate-500 text-sm">Manage email blasts, social media, and promotions.</p>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
        <Megaphone className="w-4 h-4" /> Create Campaign
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-indigo-500 text-white p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-indigo-100 text-sm">Total Reach</p>
            <h3 className="text-3xl font-bold">45.2k</h3>
          </div>
          <Globe className="w-6 h-6 text-indigo-200" />
        </div>
        <div className="mt-4 bg-white/20 h-1.5 rounded-full"><div className="bg-white h-1.5 rounded-full" style={{ width: '70%' }}></div></div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-slate-500 text-sm">Avg. Click Rate</p>
            <h3 className="text-3xl font-bold text-slate-900">9.4%</h3>
          </div>
          <Activity className="w-6 h-6 text-green-500" />
        </div>
        <p className="text-xs text-green-600 mt-2 font-bold">+1.2% this month</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-slate-500 text-sm">Active Campaigns</p>
            <h3 className="text-3xl font-bold text-slate-900">2</h3>
          </div>
          <Megaphone className="w-6 h-6 text-yellow-500" />
        </div>
        <p className="text-xs text-slate-400 mt-2">1 scheduled for next week</p>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
          <tr>
            <th className="p-4">Campaign Name</th>
            <th className="p-4">Type</th>
            <th className="p-4">Status</th>
            <th className="p-4">Reach</th>
            <th className="p-4">Engagement</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {campaigns.map(camp => (
            <tr key={camp.id} className="hover:bg-slate-50 transition">
              <td className="p-4 font-bold text-slate-900">{camp.name}</td>
              <td className="p-4 text-sm text-slate-600">{camp.type}</td>
              <td className="p-4"><Badge status={camp.status} /></td>
              <td className="p-4 text-sm text-slate-600">{camp.reach}</td>
              <td className="p-4 text-sm text-slate-600">{camp.clicks}</td>
              <td className="p-4 text-right">
                <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-500"><MoreHorizontal className="w-4 h-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default MarketingView;
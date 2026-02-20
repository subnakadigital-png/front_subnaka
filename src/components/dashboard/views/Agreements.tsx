"use client";
import React from 'react';
import { FileCheck, Clock, FileText, DollarSign, Search, Printer, Download, Eye, PlusCircle } from 'lucide-react';
import Badge from '@/components/dashboard/shared/Badge'; // Updated import path

interface Agreement {
  id: string;
  property: string;
  buyer: string;
  seller: string;
  date: string;
  status: string;
  amount: string;
}

interface AgreementsViewProps {
  agreements: Agreement[];
}

const AgreementsView: React.FC<AgreementsViewProps> = ({ agreements }) => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Sale Agreements</h2>
        <p className="text-slate-500 text-sm">Manage legal contracts and sale documents.</p>
      </div>
      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
          <PlusCircle className="w-4 h-4" /> New Agreement
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Stats */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-green-50 rounded-xl"><FileCheck className="w-6 h-6 text-green-600" /></div>
        </div>
        <div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">Signed Contracts</h3>
          <div className="text-2xl font-bold text-slate-900">124</div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-yellow-50 rounded-xl"><Clock className="w-6 h-6 text-yellow-600" /></div>
        </div>
        <div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">Pending Signature</h3>
          <div className="text-2xl font-bold text-slate-900">15</div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-slate-100 rounded-xl"><FileText className="w-6 h-6 text-slate-600" /></div>
        </div>
        <div>
          <h3 className="text-slate-500 text-sm font-medium mb-1">Drafts</h3>
          <div className="text-2xl font-bold text-slate-900">8</div>
        </div>
      </div>
      <div className="bg-indigo-600 p-6 rounded-2xl shadow-sm flex flex-col justify-between text-white">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-white/20 rounded-xl"><DollarSign className="w-6 h-6 text-white" /></div>
        </div>
        <div>
          <h3 className="text-indigo-100 text-sm font-medium mb-1">Total Contract Value</h3>
          <div className="text-2xl font-bold">$2.4M</div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex gap-4">
          <button className="text-sm font-bold text-slate-900 border-b-2 border-slate-900 pb-4 -mb-4.5">All</button>
          <button className="text-sm font-medium text-slate-500 hover:text-slate-900 pb-4">Signed</button>
          <button className="text-sm font-medium text-slate-500 hover:text-slate-900 pb-4">Pending</button>
        </div>
        <div className="relative">
          <input type="text" placeholder="Search agreement..." className="pl-8 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none" />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
        </div>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
          <tr>
            <th className="p-4">Agreement ID</th>
            <th className="p-4">Property</th>
            <th className="p-4">Buyer</th>
            <th className="p-4">Seller</th>
            <th className="p-4">Value</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {agreements.map(ag => (
            <tr key={ag.id} className="hover:bg-slate-50 transition">
              <td className="p-4 font-bold text-slate-900 font-mono text-xs">{ag.id}</td>
              <td className="p-4 text-sm text-slate-900 font-medium">{ag.property}</td>
              <td className="p-4 text-sm text-slate-600">{ag.buyer}</td>
              <td className="p-4 text-sm text-slate-600">{ag.seller}</td>
              <td className="p-4 text-sm font-bold text-slate-900">{ag.amount}</td>
              <td className="p-4"><Badge status={ag.status} /></td>
              <td className="p-4 text-right flex justify-end gap-2">
                <button className="p-2 hover:bg-slate-100 text-slate-500 rounded-lg" title="Print"><Printer className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-slate-100 text-slate-500 rounded-lg" title="Download"><Download className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Eye className="w-4 h-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AgreementsView;
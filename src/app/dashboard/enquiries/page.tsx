'use client';

import React from 'react';
import { MessageSquare, Mail, Phone, Clock, Search, Filter, Facebook, Instagram, Globe } from 'lucide-react';

const enquiries = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+856 20 1234567', message: 'Interested in the luxury villa in Vientiane.', source: 'Website', date: '2023-10-27', status: 'New' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+856 20 7654321', message: 'Looking for a 2-bedroom apartment.', source: 'Facebook', date: '2023-10-26', status: 'In Progress' },
  { id: 3, name: 'Somsack', email: 'somsack@mail.com', phone: '+856 20 1112223', message: 'Price inquiry for the commercial space.', source: 'Instagram', date: '2023-10-25', status: 'Closed' },
];

const SourceIcon = ({ source }: { source: string }) => {
  switch (source) {
    case 'Facebook': return <Facebook className="w-4 h-4 text-blue-600" />;
    case 'Instagram': return <Instagram className="w-4 h-4 text-pink-600" />;
    default: return <Globe className="w-4 h-4 text-slate-600" />;
  }
};

export default function EnquiriesPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Enquiries</h1>
          <p className="text-slate-500">Manage leads from all sources</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search enquiries..." className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-slate-50">
            <Filter className="w-5 h-5" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Client</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Message</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Source</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {enquiries.map((enquiry) => (
              <tr key={enquiry.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-800">{enquiry.name}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <Mail className="w-3 h-3" /> {enquiry.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Phone className="w-3 h-3" /> {enquiry.phone}
                  </div>
                </td>
                <td className="px-6 py-4 max-w-xs truncate text-sm text-slate-600">
                  {enquiry.message}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                    <SourceIcon source={enquiry.source} />
                    {enquiry.source}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {enquiry.date}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    enquiry.status === 'New' ? 'bg-green-100 text-green-700' : 
                    enquiry.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {enquiry.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-yellow-600 font-semibold text-sm hover:text-yellow-700">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

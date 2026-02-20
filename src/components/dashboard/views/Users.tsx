"use client";

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import Badge from '@/components/dashboard/shared/Badge'; // Corrected import path
import { User } from '@/lib/types'; // Import User interface

interface UsersViewProps {
  users: User[];
}

const UsersView: React.FC<UsersViewProps> = ({ users }) => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">User Directory</h2>
        <p className="text-slate-500 text-sm">Registered customers, buyers, and sellers.</p>
      </div>
      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
          Export Users
        </button>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User Details</th>
            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role & Status</th>
            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Activity</th>
            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50 transition">
              <td className="p-4">
                <div className="font-bold text-slate-900">{user.name}</div>
                <div className="text-xs text-slate-500">Joined: {user.joined}</div>
              </td>
              <td className="p-4">
                <div className="text-sm text-slate-900">{user.email}</div>
                <div className="text-xs text-slate-500 font-mono">{user.phone}</div>
              </td>
              <td className="p-4">
                <div className="flex flex-col gap-1 items-start">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    user.type === 'Seller' ? 'bg-orange-100 text-orange-700' :
                    user.type === 'Agent' ? 'bg-purple-100 text-purple-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {user.type}
                  </span>
                  <span className={`flex items-center gap-1 text-xs font-medium ${user.status === 'Active' ? 'text-green-600' : 'text-slate-400'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    {user.status}
                  </span>
                </div>
              </td>
              <td className="p-4">
                <div className="text-sm text-slate-900 font-medium">{user.listings} Active Listings</div>
                <div className="text-xs text-slate-500">Last login: {user.lastLogin}</div>
              </td>
              <td className="p-4 text-right flex justify-end gap-2">
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit className="w-4 h-4" /></button>
                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default UsersView;
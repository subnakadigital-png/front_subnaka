'use client';

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  DollarSign, 
  Calendar, 
  ShieldCheck, 
  MoreVertical, 
  Mail, 
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Award
} from 'lucide-react';

const staffMembers = [
  { id: 1, name: 'Alice Somphet', role: 'Sales Agent', email: 'alice@subnaka.com', phone: '+856 20 5551111', salary: '$1,200', bonus: '$300', attendance: '98%', status: 'Active', permissions: 'Sales' },
  { id: 2, name: 'Bob Inthavong', role: 'Property Manager', email: 'bob@subnaka.com', phone: '+856 20 5552222', salary: '$1,500', bonus: '$150', attendance: '95%', status: 'Active', permissions: 'Full' },
  { id: 3, name: 'Charlie Souk', role: 'Marketing', email: 'charlie@subnaka.com', phone: '+856 20 5553333', salary: '$1,000', bonus: '$100', attendance: '92%', status: 'On Leave', permissions: 'Marketing' },
];

export default function HRMPage() {
  const [activeTab, setActiveTab] = useState('Staff List');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">HRM & Staff Management</h1>
          <p className="text-slate-500">Manage employees, payroll, and attendance</p>
        </div>
        <button className="flex items-center gap-2 bg-yellow-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-yellow-600 transition-colors">
          <UserPlus className="w-5 h-5" /> Add Staff
        </button>
      </div>

      <div className="flex gap-8 mb-8 border-b border-slate-200">
        {['Staff List', 'Payroll & Salaries', 'Attendance', 'Permissions'].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold transition-all px-2 ${activeTab === tab ? 'text-yellow-600 border-b-2 border-yellow-500' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Staff" value="12" icon={<Users className="w-5 h-5" />} color="blue" />
        <StatCard title="Active Now" value="9" icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
        <StatCard title="Monthly Payroll" value="$14,500" icon={<DollarSign className="w-5 h-5" />} color="yellow" />
        <StatCard title="Avg Attendance" value="94%" icon={<TrendingUp className="w-5 h-5" />} color="indigo" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {activeTab === 'Staff List' && (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Attendance</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Permissions</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffMembers.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200 uppercase tracking-tighter">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm leading-none mb-1">{staff.name}</p>
                        <p className="text-xs text-slate-400">{staff.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{staff.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                      staff.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{staff.attendance}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded w-fit">
                      <ShieldCheck className="w-3 h-3 text-blue-500" /> {staff.permissions}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 transition-colors"><MoreVertical className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'Payroll & Salaries' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl text-slate-800 mb-2">Payroll Management</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">Review and approve monthly salaries, bonuses, and deductions for all staff members.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
              {staffMembers.map(staff => (
                <div key={staff.id} className="p-6 border border-slate-100 rounded-2xl bg-slate-50">
                  <h4 className="font-bold text-slate-800 mb-4">{staff.name}</h4>
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Base Salary</span>
                      <span className="font-bold text-slate-800">{staff.salary}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Bonus</span>
                      <span className="font-bold text-green-600">+{staff.bonus}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-slate-200 mt-2">
                      <span className="font-bold text-slate-800 text-lg">Total</span>
                      <span className="font-black text-slate-800 text-lg">$1,500</span>
                    </div>
                  </div>
                  <button className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors">Edit Salary</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Attendance' && (
           <div className="p-12 text-center text-slate-400">
             <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
             <p className="font-bold text-lg">Daily Attendance tracking system</p>
             <p className="text-sm">Employees can clock in/out from their own dashboard.</p>
           </div>
        )}

        {activeTab === 'Permissions' && (
           <div className="p-12 text-center text-slate-400">
             <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-20" />
             <p className="font-bold text-lg">Role Based Access Control (RBAC)</p>
             <p className="text-sm">Manage who can see and edit different modules of the dashboard.</p>
           </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    indigo: 'bg-indigo-50 text-indigo-600'
  };
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colors[color as keyof typeof colors]}`}>{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{title}</p>
        <p className="text-2xl font-black text-slate-800">{value}</p>
      </div>
    </div>
  );
}

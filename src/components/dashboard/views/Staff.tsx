"use client";
import React from 'react';
import { Shield, Activity, Lock, UserPlus, History, Trash2 } from 'lucide-react';
import Badge from '@/components/dashboard/shared/Badge';
import { StaffMember } from '@/lib/types';

const initialActivityLogs = [
  { id: 1, user: "Sarah Connor", action: "Updated Property #102", details: "Changed price from $1,100 to $1,200", date: "Oct 24, 2024", time: "10:45 AM" },
  { id: 2, user: "Admin User", action: "Created Staff Account", details: "Added new agent: John Doe", date: "Oct 24, 2024", time: "09:30 AM" },
];

interface NewStaffState {
  name: string;
  email: string;
  password: string;
  role: string;
  permissions: { [key: string]: boolean };
}

interface StaffViewProps {
  staff: StaffMember[];
  newStaff: NewStaffState;
  setNewStaff: React.Dispatch<React.SetStateAction<NewStaffState>>;
  handleAddStaff: (e: React.FormEvent) => void;
  handleDeleteStaff: (id: number) => void;
  togglePermission: (key: string) => void;
}

const StaffView: React.FC<StaffViewProps> = ({ staff, newStaff, setNewStaff, handleAddStaff, handleDeleteStaff, togglePermission }) => (
  <div className="space-y-6 animate-in fade-in duration-300">
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-xl"><Shield className="w-6 h-6 text-yellow-400" /></div>
          <div>
            <h3 className="text-sm text-slate-400 font-medium">Total Staff</h3>
            <p className="text-2xl font-bold">{staff.length}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-xl"><Activity className="w-6 h-6 text-green-600" /></div>
          <div>
            <h3 className="text-sm text-slate-500 font-medium">Online Now</h3>
            <p className="text-2xl font-bold text-slate-900">2</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl"><Lock className="w-6 h-6 text-blue-600" /></div>
          <div>
            <h3 className="text-sm text-slate-500 font-medium">2FA Enabled</h3>
            <p className="text-2xl font-bold text-slate-900">100%</p>
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Staff Accounts</h3>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">Manage Access</span>
            </div>
            <div className="divide-y divide-slate-100">
                {staff.map(member => (
                    <div key={member.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">{member.name.charAt(0)}</div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">{member.name}</p>
                                <p className="text-xs text-slate-500">{member.role} • {member.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge status={member.status} />
                            <button onClick={() => handleDeleteStaff(member.id)} className="text-red-500 hover:text-red-700 p-1">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

       <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 bg-yellow-50/30">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-yellow-600" /> Staff Account Maker
          </h3>
        </div>
        <form onSubmit={handleAddStaff} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
              <input required type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-yellow-500" placeholder="e.g. Alex Smith" value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
              <input required type="email" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-yellow-500" placeholder="alex@sabnaka.la" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Role</label>
              <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-yellow-500" value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}>
                <option>Super Admin</option>
                <option>Property Manager</option>
                <option>Sales Agent</option>
                <option>Content Editor</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
              <input required type="password" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-yellow-500" placeholder="••••••••" value={newStaff.password} onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })} />
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mt-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2"><Lock className="w-3 h-3" /> Access Permissions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.keys(newStaff.permissions).map(key => (
                     <label key={key} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-100 cursor-pointer hover:border-yellow-400 transition">
                        <input type="checkbox" checked={newStaff.permissions[key]} onChange={() => togglePermission(key)} className="accent-yellow-500 w-4 h-4" />
                        <span className="text-sm font-medium text-slate-700">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </label>
                ))}
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg mt-4">Create Account</button>
        </form>
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100"><h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><History className="w-5 h-5 text-slate-400" /> Recent Staff Loggings & Activity</h3></div>
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-bold"><tr><th className="p-4">Staff Member</th><th className="p-4">Action</th><th className="p-4">Details</th><th className="p-4">Date</th><th className="p-4 text-right">Time</th></tr></thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {initialActivityLogs.map(log => (
            <tr key={log.id} className="hover:bg-slate-50 transition"><td className="p-4 font-bold text-slate-900">{log.user}</td><td className="p-4"><span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold border border-slate-200">{log.action}</span></td><td className="p-4 text-slate-500">{log.details}</td><td className="p-4 text-slate-500">{log.date}</td><td className="p-4 text-right text-slate-400">{log.time}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default StaffView;

"use client";
import React, { useState } from 'react';
import { Settings, Database, UploadCloud, RefreshCw, Download, Save, Clock } from 'lucide-react';

interface SettingsViewProps {
  settingsTab: string;
  setSettingsTab: (tab: string) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settingsTab, setSettingsTab }) => {
  return (
    <div className="max-w-4xl animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Settings</h2>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4">
          <div className="bg-slate-50 p-6 border-r border-slate-100 space-y-1">
            {['General', 'Notifications', 'Security', 'Billing', 'Backup & Data'].map(tab => {
              const id = tab.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
              return (
                <button 
                  key={id}
                  onClick={() => setSettingsTab(id)}
                  className={`w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition ${settingsTab === id ? 'bg-white shadow-sm text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                >
                  {tab}
                </button>
              )
            })}
          </div>
          
          <div className="col-span-3 p-8 space-y-8">
            {settingsTab === 'general' && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Site Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Site Name</label>
                      <input type="text" defaultValue="Sabnaka.la" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Support Email</label>
                      <input type="email" defaultValue="support@sabnaka.la" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Site Description (SEO)</label>
                      <textarea defaultValue="The best real estate platform in Laos." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm h-20"></textarea>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Preferences</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-slate-900">Maintenance Mode</p>
                      <p className="text-xs text-slate-500">Disable public access to the site</p>
                    </div>
                    <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-slate-900">Allow User Registration</p>
                      <p className="text-xs text-slate-500">Anyone can create an account</p>
                    </div>
                    <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div></div>
                  </div>
                </div>
              </>
            )}

            {settingsTab === 'backup-data' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                
                {/* 1. Database Backup */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Database className="w-5 h-5 text-slate-400" /> Database Backup
                    </h3>
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">System Healthy</span>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-slate-900">Manual Backup</h4>
                      <p className="text-sm text-slate-500 mt-1">Create an immediate snapshot of all properties, users, and transactions.</p>
                      <p className="text-xs text-slate-400 mt-2 flex items-center gap-1"><Clock className="w-3 h-3" /> Last backup: 2 hours ago</p>
                    </div>
                    <button className="px-5 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition flex items-center gap-2 shadow-lg">
                      <UploadCloud className="w-4 h-4" /> Backup Now
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg"><RefreshCw className="w-5 h-5 text-blue-600" /></div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">Auto-Backup Schedule</p>
                        <p className="text-xs text-slate-500">Currently set to: <span className="font-bold">Daily (Midnight)</span></p>
                      </div>
                    </div>
                    <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div></div>
                  </div>
                </div>

                {/* 2. Data Export */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Export Data</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Properties', 'Users', 'Leads'].map(type => (
                      <button key={type} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-left group">
                        <span className="block text-sm font-bold text-slate-700 group-hover:text-slate-900">{type} CSV</span>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-slate-400">All records</span>
                          <Download className="w-4 h-4 text-slate-400 group-hover:text-yellow-600" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Restore */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 text-red-600">Danger Zone: Restore</h3>
                  <div className="border-2 border-dashed border-red-200 bg-red-50/50 rounded-xl p-6 text-center">
                    <p className="text-sm text-slate-700 font-medium">Upload a backup file (.json / .sql) to restore the system.</p>
                    <p className="text-xs text-red-500 mt-1">Warning: This will overwrite current data.</p>
                    <button className="mt-4 px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-bold rounded-lg hover:bg-red-50">
                      Select Backup File
                    </button>
                  </div>
                </div>

              </div>
            )}

            {settingsTab !== 'general' && settingsTab !== 'backup-data' && (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <Settings className="w-12 h-12 mb-4 opacity-20" />
                <p>Settings for {settingsTab.replace('-', ' ')} are coming soon.</p>
              </div>
            )}

            {settingsTab === 'general' && (
              <div className="pt-4 flex justify-end">
                <button className="px-6 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db, auth } from '@/lib/firebase-client';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Loader2, Save, User, Mail, Globe, Lock } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function SettingsPage() {
  const { user } = useAuth();
  const [siteTitle, setSiteTitle] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      if (user) {
        setDisplayName(user.displayName || '');
      }
      try {
        const docRef = doc(db, 'settings', 'site_config');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSiteTitle(data.siteTitle || 'Subnaka');
          setContactEmail(data.contactEmail || '');
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Failed to load settings.');
      }
      setLoading(false);
    };
    fetchSettings();
  }, [user]);

  // Handle saving all settings
  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const docRef = doc(db, 'settings', 'site_config');
      await setDoc(docRef, { 
        siteTitle,
        contactEmail,
      }, { merge: true });
      
      // Note: Updating user displayName in Firebase Auth requires a backend function or re-authentication.
      // For now, we'll just show a success message.
      setSuccess('Settings saved successfully!');
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
    }
    setSaving(false);
  };
  
    const handlePasswordReset = () => {
    if (user && user.email) {
      sendPasswordResetEmail(auth, user.email)
        .then(() => {
          setSuccess('A password reset email has been sent to your address.');
        })
        .catch((error) => {
          console.error('Error sending password reset email:', error);
          setError('Failed to send password reset email.');
        });
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-10 h-10 text-yellow-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-slate-800 mb-10">Admin Settings</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6" role="alert">{success}</div>}

      {/* User Profile Settings */}
      <div className="bg-white p-8 rounded-2xl shadow-lg mb-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center"><User className="mr-3 text-yellow-500"/>User Profile</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-bold text-slate-700 mb-2">Display Name</label>
            <input type="text" id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full px-4 py-3 rounded-lg border-slate-300 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm" placeholder="Your Name"/>
            <p className='text-xs text-slate-500 mt-1'>This name is displayed on the dashboard. Updating Auth profile requires backend logic.</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Manage Password</label>
            <button onClick={handlePasswordReset} className="flex items-center justify-center px-5 py-3 text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm">
                <Lock className="w-4 h-4 mr-2"/>
                Send Password Reset Email
            </button>
          </div>
        </div>
      </div>

      {/* General Site Settings */}
      <div className="bg-white p-8 rounded-2xl shadow-lg">
         <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center"><Globe className="mr-3 text-yellow-500"/>General Site Settings</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="siteTitle" className="block text-sm font-bold text-slate-700 mb-2">Website Title</label>
            <input type="text" id="siteTitle" value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} className="w-full px-4 py-3 rounded-lg border-slate-300 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm" placeholder="e.g., Subnaka Real Estate"/>
          </div>
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-bold text-slate-700 mb-2">Public Contact Email</label>
            <input type="email" id="contactEmail" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border-slate-300 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm" placeholder="e.g., contact@subnaka.com"/>
          </div>
        </div>
      </div>
      
      {/* Save Button */}
      <div className="mt-10 flex justify-end">
        <button onClick={handleSave} disabled={saving} className="flex justify-center items-center py-3 px-8 border border-transparent rounded-lg shadow-lg text-white font-bold bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-slate-400">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { auth } from '@/lib/firebase-client';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  OAuthProvider, // For Apple
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";

export default function LoginModal({ setShowLogin }: { setShowLogin: (show: boolean) => void }) {
  const [authTab, setAuthTab] = useState('login'); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSocialLogin = async (providerName: string) => {
    setError('');
    setIsSigningIn(true);
    console.log(`Attempting to sign in with ${providerName}`);
    let provider;
    if (providerName === 'Google') {
      provider = new GoogleAuthProvider();
    } else if (providerName === 'Facebook') {
      provider = new FacebookAuthProvider();
    } else if (providerName === 'Apple') {
      provider = new OAuthProvider('apple.com');
    }

    if (provider) {
      try {
        const result = await signInWithPopup(auth, provider);
        console.log("Sign-in successful, user:", result.user);
        setShowLogin(false);
      } catch (error: any) {
        console.error("Sign-in error:", error);
        setError(error.message);
      } finally {
        console.log("Sign-in process finished.");
        setIsSigningIn(false);
      }
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
        if (authTab === 'login') {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
        }
        setShowLogin(false);
    } catch (error: any) {
        setError(error.message);
    }
  }

  if (isSigningIn) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm">
            <div className="text-center">
                <h3 className="text-xl font-bold">Signing in...</h3>
                <p>Please follow the instructions in the pop-up window.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowLogin(false)}></div>
      <div className="relative w-full max-w-lg bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl transform animate-in zoom-in-95 duration-300">
        <button 
          onClick={() => setShowLogin(false)}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-gray-200/50 hover:bg-gray-300/70 rounded-full transition-colors duration-200 z-20">
          <X className="w-5 h-5 text-gray-700" />
        </button>
        <div className="p-8 md:p-12">
        <div className="text-center mb-8">
            <div className="bg-yellow-500 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-white"/>
            </div>
            <h3 id="login-title" className="text-2xl font-bold text-gray-900">{authTab === 'login' ? 'Welcome Back' : 'Create an Account'}</h3>
            <p id="login-sub" className="text-sm text-gray-500"> {authTab === 'login' ? 'Sign in to access your account' : 'Join us to find your dream property'}</p>
        </div>

          <div className="space-y-3 mb-6">
              <button onClick={() => handleSocialLogin('Google')} className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium text-sm text-gray-700">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  <span>Continue with Google</span>
              </button>
              <button onClick={() => handleSocialLogin('Facebook')} className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  <span>Continue with Facebook</span>
              </button>
              <button onClick={() => handleSocialLogin('Apple')} className="w-full flex items-center justify-center gap-3 bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition font-medium text-sm">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z"/></svg>
                  <span>Continue with Apple</span>
              </button>
          </div>

          <div className="flex items-center my-6">
            <hr className="w-full border-gray-200" />
            <span className="px-4 text-xs font-medium text-gray-400">OR</span>
            <hr className="w-full border-gray-200" />
          </div>

          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {authTab === 'signup' && (
               <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition" 
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition" 
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-yellow-500/30 transition-transform transform hover:scale-105 duration-300 ease-in-out">
              {authTab === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            {authTab === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button 
              onClick={() => { setAuthTab(authTab === 'login' ? 'signup' : 'login'); setError(''); }}
              className="font-semibold text-yellow-600 hover:text-yellow-700 ml-1.5 focus:outline-none">
              {authTab === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

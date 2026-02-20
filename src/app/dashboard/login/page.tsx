'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase-client';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@subnaka.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (auth.currentUser) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError('Email and password are required.');
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Login Error Details:", error);
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Invalid email or password. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection and Firebase setup.');
          break;
        default:
          setError('An unexpected error occurred. Please try again.');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-yellow-600">Admin Login</h1>
          <p className="text-slate-500 mt-2">Dashboard access is restricted</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
              <p className="font-bold">Login Error</p>
              <p>{error}</p>
            </div>
          )}
          <div className="relative">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-slate-300 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm bg-slate-50"
              placeholder="Enter your email"
            />
          </div>
          <div className="relative">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-slate-300 focus:ring-yellow-500 focus:border-yellow-500 shadow-sm bg-slate-50"
              placeholder="Enter your password"
            />
          </div>
          <div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-white font-bold bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-slate-400 transition-transform transform hover:scale-105">
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

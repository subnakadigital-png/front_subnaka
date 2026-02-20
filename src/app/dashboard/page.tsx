'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Home, DollarSign, PlusCircle } from 'lucide-react';

const StatCard = ({ title, value, icon, link, linkText }: { title: string; value: string; icon: React.ReactNode; link: string; linkText: string; }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between">
        <div>
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <div className="text-yellow-500">{icon}</div>
            </div>
            <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
        <Link href={link} className="mt-4 text-sm font-semibold text-yellow-600 hover:text-yellow-700">{linkText} &rarr;</Link>
    </div>
);

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Welcome, Admin!</h1>
        <p className="text-slate-500 mb-10">Here is a snapshot of your property management.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <StatCard 
                title="Total Properties"
                value="12"
                icon={<Home className="w-6 h-6"/>}
                link="/dashboard/properties"
                linkText="View all properties"
            />
            <StatCard 
                title="Total Portfolio Value"
                value="$5.4M"
                icon={<DollarSign className="w-6 h-6"/>}
                link="/dashboard/properties"
                linkText="See property details"
            />
            <div className="bg-yellow-500 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center text-white hover:bg-yellow-600 transition-colors">
                 <PlusCircle className="w-10 h-10 mb-4"/>
                 <h3 className="text-xl font-bold mb-2">Add New Property</h3>
                 <p className="text-sm text-yellow-100 mb-4">Quickly add a new listing to your portfolio.</p>
                 <Link href="/dashboard/add-property" className="bg-white text-yellow-600 font-bold py-2 px-6 rounded-lg shadow-md hover:scale-105 transform transition-transform">Add Property</Link>
            </div>
        </div>

        {/* You can add more dashboard widgets here later */}
    </div>
  );
}

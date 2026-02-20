'use client';

import React from 'react';
import Image from 'next/image';
import { initialPosts } from '@/lib/data';

export default function NewsPage() {
    return (
        <div className="animate-in fade-in duration-300">
            <div className="bg-white py-12 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-2">Real Estate News</h1>
                    <p className="text-gray-500">Latest updates on market trends in Laos.</p>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {initialPosts.map(n => (
                        <div key={n.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition">
                            <div className="h-48 relative"><Image src={n.image} alt={n.title_en} fill className="object-cover" /></div>
                            <div className="p-6">
                                <span className="text-[10px] uppercase font-bold text-[#CA8A04] tracking-wider mb-2 block">{n.category}</span>
                                <h3 className="font-bold text-lg mb-2">{n.title_en}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{n.desc_en}</p>
                                <span className="text-xs text-gray-400">{n.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

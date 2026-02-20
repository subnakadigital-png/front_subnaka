'use client';

import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="animate-in fade-in duration-300">
             <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <span className="text-[#CA8A04] font-bold uppercase tracking-widest text-xs mb-2 block">Get in Touch</span>
                        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Subnaka</h1>
                        <p className="text-gray-600 mb-8 text-lg">We are here to help you finding your dream home.</p>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-[#CA8A04]/10 p-3 rounded-lg"><MapPin className="w-6 h-6 text-[#CA8A04]" /></div>
                                <div><h4 className="font-bold text-gray-900">Visit Us</h4><p className="text-gray-600">Vientiane Capital, Laos</p></div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-[#CA8A04]/10 p-3 rounded-lg"><Phone className="w-6 h-6 text-[#CA8A04]" /></div>
                                <div><h4 className="font-bold text-gray-900">Call Us</h4><p className="text-gray-600">+856 20 9999 8888</p></div>
                            </div>
                             <div className="flex items-start gap-4">
                                <div className="bg-[#CA8A04]/10 p-3 rounded-lg"><Mail className="w-6 h-6 text-[#CA8A04]" /></div>
                                <div><h4 className="font-bold text-gray-900">Email</h4><p className="text-gray-600">info@subnaka.la</p></div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message Sent!'); }}>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="First Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#CA8A04] focus:ring-0 outline-none" />
                                <input type="text" placeholder="Last Name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#CA8A04] focus:ring-0 outline-none" />
                            </div>
                            <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#CA8A04] focus:ring-0 outline-none" />
                            <textarea rows={4} placeholder="Message" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#CA8A04] focus:ring-0 outline-none resize-none"></textarea>
                            <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition">Send Message</button>
                        </form>
                    </div>
                </div>
             </div>
        </div>
    )
}

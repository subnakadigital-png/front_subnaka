'use client';

import React from 'react';
import Image from 'next/image';
import { HardHat, FileText, Landmark, Calculator } from 'lucide-react';

export default function ServicesPage({ onContact }: any) {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="bg-gray-50 py-12 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 text-center">
              <span className="text-[#CA8A04] font-bold uppercase tracking-widest text-xs mb-2 block">Our Expertise</span>
              <h1 className="text-4xl font-bold text-gray-900">Professional Services</h1>
          </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
              <div className="w-full md:w-1/2">
                  <div className="bg-[#CA8A04] w-12 h-12 rounded-lg flex items-center justify-center mb-6 text-white shadow-lg">
                      <HardHat className="w-6 h-6" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Construction & Development</h2>
                  <p className="text-gray-600 leading-relaxed mb-6">From residential homes to large-scale commercial developments, Subnaka brings your vision to life with precision and quality.</p>
                  <button onClick={onContact} className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition">Get a Quote</button>
              </div>
              <div className="w-full md:w-1/2 relative h-[400px]">
                  <Image src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Construction site" layout="fill" objectFit="cover" className="rounded-2xl shadow-2xl" />
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                 <FileText className="w-10 h-10 text-[#CA8A04] mb-4" />
                 <h3 className="text-xl font-bold mb-2">Agreement Services</h3>
                 <p className="text-gray-600 text-sm mb-4">Legal assistance for property buying, selling, and rental agreements.</p>
                 <button onClick={onContact} className="text-[#CA8A04] font-bold text-sm hover:underline">Learn More &rarr;</button>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                 <Landmark className="w-10 h-10 text-[#CA8A04] mb-4" />
                 <h3 className="text-xl font-bold mb-2">Loan Consultation</h3>
                 <p className="text-gray-600 text-sm mb-4">Expert advice on securing home loans with the best interest rates.</p>
                 <button onClick={onContact} className="text-[#CA8A04] font-bold text-sm hover:underline">Contact Us &rarr;</button>
              </div>
              <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                 <Calculator className="w-10 h-10 text-[#CA8A04] mb-4" />
                 <h3 className="text-xl font-bold mb-2">EMI Calculator</h3>
                 <p className="text-gray-600 text-sm mb-4">Calculate your monthly mortgage payments easily.</p>
                 <button onClick={onContact} className="text-[#CA8A04] font-bold text-sm hover:underline">Calculate &rarr;</button>
              </div>
          </div>
      </div>
    </div>
  );
}

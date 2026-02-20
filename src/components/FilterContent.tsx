'use client';

import React from 'react';
import { Search, Building, MapPin, BedDouble, Tag, Home, X } from 'lucide-react';

export default function FilterContent({ filters, handleFilterChange, resetFilters, locations, propertyTypes }: any) {
  return (
    <div className="bg-white p-6">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Filter & Search</h3>
        
        <div className="mb-6 relative">
            <input 
            type="text" 
            placeholder="Search by keyword..." 
            value={filters.keyword}
            onChange={e => handleFilterChange('keyword', e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-yellow-500 outline-none transition"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
        </div>

        <div className="mb-6">
            <h4 className="text-sm font-bold text-gray-600 mb-3">Looking for:</h4>
            <div className="flex flex-wrap gap-2">
                {['All', 'Sale', 'Rent'].map(type => (
                    <button 
                        key={type} 
                        onClick={() => handleFilterChange('saleType', type)} 
                        className={`px-3 py-1.5 text-sm font-bold rounded-full transition-all duration-200 text-center grow ${filters.saleType === type ? 'bg-yellow-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        {type}
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-6 pt-6 border-t">
            <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600 flex items-center gap-2"><Building size={16}/> Property Type</label>
            <select value={filters.type} onChange={e => handleFilterChange('type', e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-yellow-500 outline-none transition">
                {propertyTypes.map((type:string, index:number) => <option key={`${type}-${index}`} value={type}>{type}</option>)}
            </select>
            </div>
            <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600 flex items-center gap-2"><MapPin size={16}/> Location</label>
            <select value={filters.location} onChange={e => handleFilterChange('location', e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-yellow-500 outline-none transition">
                {locations.map((loc:string) => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            </div>
            <div className="space-y-2">
            <label className="text-sm font-bold text-gray-600 flex items-center gap-2"><BedDouble size={16}/> Bedrooms</label>
            <select value={filters.beds} onChange={e => handleFilterChange('beds', e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:ring-2 focus:ring-yellow-500 outline-none transition">
                <option key="any">Any</option>{[1,2,3,4,5].map(b => <option key={b}>{b}+</option>)}
            </select>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 flex items-center gap-2"><Tag size={16}/> Price Range (₭)</label>
                <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={filters.priceRange[0]} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition" onChange={e => handleFilterChange('priceRange', [Number(e.target.value), filters.priceRange[1]])} />
                    <input type="number" placeholder="Max" value={filters.priceRange[1] === 10000000000 ? '' : filters.priceRange[1]} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition" onChange={e => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value) || 10000000000])} />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 flex items-center gap-2"><Home size={16}/> Area (m²)</label>
                <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={filters.areaRange[0]} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition" onChange={e => handleFilterChange('areaRange', [Number(e.target.value), filters.areaRange[1]])} />
                    <input type="number" placeholder="Max" value={filters.areaRange[1] === 10000 ? '' : filters.areaRange[1]} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition" onChange={e => handleFilterChange('areaRange', [filters.areaRange[0], Number(e.target.value) || 10000])} />
                </div>
            </div>
            
            <button onClick={resetFilters} className="w-full bg-gray-800 text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-black transition flex items-center justify-center gap-2 mt-4">
            <X size={16}/> Reset All Filters
            </button>
        </div>
    </div>
  );
}

'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Search,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Home as HomeIcon,
  Clock,
  HardHat,
  Hammer,
  CheckCircle,
  ArrowRight,
  Percent,
  PaintBucket,
  LineChart,
  Scale,
  Megaphone,
  PlusCircle,
  Heart,
  LocateFixed
} from 'lucide-react';
import { Property } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';
import ClientOnly from '@/components/ClientOnly'; // Import ClientOnly

export default function HomePage({ 
  navigateTo = () => {},
  onViewProperty = () => {},
  wishlist = [],
  toggleWishlist = () => {},
  properties = []
}: {
  navigateTo?: (page: string, props?: any) => void;
  onViewProperty?: (property: Property) => void;
  wishlist?: string[];
  toggleWishlist?: (e: React.MouseEvent, propertyId: string) => void;
  properties: Property[];
}) {
  const [searchTab, setSearchTab] = useState('buy');
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handleNearbySearch = () => {
    navigateTo('nearby');
  };

  return (
    <div className="animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="relative h-[650px] md:h-[650px] w-full flex flex-col items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Hero background image" fill className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 to-black/60"></div>
        </div>

        <div className="w-full max-w-6xl px-4 flex flex-col items-center relative z-10">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-3 drop-shadow-md">Find Your Place in Laos</h1>
            <p className="text-base md:text-xl text-white/90 mb-6 md:mb-10 font-light tracking-wide">Vientiane • Luang Prabang • Pakse • Savannakhet</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto p-1 md:p-2 text-gray-800">
            {/* Search Box Tabs */}
            <div className="flex items-center gap-4 md:gap-8 px-4 md:px-6 py-1.5 md:py-2 border-b border-gray-100 mb-2">
              {['buy', 'rent', 'commercial', 'Land' ].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setSearchTab(tab)}
                  className={`text-xs md:text-sm font-bold pb-1.5 md:pb-2 transition-all capitalize ${searchTab === tab ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-500 hover:text-gray-800 border-b-2 border-transparent'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {/* Search Box Inputs */}
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-2 p-1">
              <div className="flex-1 w-full relative">
                 <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-yellow-500"><MapPin className="w-4 h-5" /></div>
                 <select className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3.5 bg-white hover:bg-gray-50 rounded-xl border-none outline-none text-gray-700 font-medium cursor-pointer appearance-none focus:ring-0 text-sm md:text-base">
                    <option>Select Location</option>
                    <option>Vientiane Capital</option>
                 </select>
              </div>
              <div className="hidden md:block w-px h-8 bg-gray-200"></div>
              <div className="flex-1 w-full relative">
                 <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-yellow-500"><HomeIcon className="w-4 h-5" /></div>
                 <select className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3.5 bg-white hover:bg-gray-50 rounded-xl border-none outline-none text-gray-700 font-medium cursor-pointer appearance-none focus:ring-0 text-sm md:text-base">
                    <option>Property Type</option>
                    <option>House</option>
                 </select>
              </div>
               <button 
                  onClick={handleNearbySearch}
                  className="w-full md:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 md:px-4 py-2.5 md:py-3.5 rounded-xl font-medium text-xs md:text-sm transition flex items-center justify-center gap-2"
                >
                  <LocateFixed className="w-3.5 h-3.5" />
                  <span className="md:hidden">Nearby</span>
                  <span className="hidden md:inline">My Location</span>
                </button>
              <button onClick={() => navigateTo('listings')} className="w-full md:w-auto bg-yellow-500 hover:bg-[#b47a03] text-white px-6 md:px-8 py-2.5 md:py-3.5 rounded-xl font-bold text-sm md:text-base shadow-md transition flex items-center justify-center gap-2 min-w-[120px] md:min-w-[140px]">
                 Search <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
            
          {/* Popular Cities */}
          <div className="w-full max-w-5xl mt-6 md:mt-8 flex items-center justify-center gap-2 md:gap-4">
             <div className="hidden md:flex items-center gap-2 text-white/90 font-medium text-sm whitespace-nowrap">
                <TrendingUp className="w-4 h-4" /> Popular:
             </div>
             <div className="relative flex items-center max-w-[90vw] md:max-w-3xl group">
                 <button onClick={() => scroll('left')} className="absolute left-0 z-10 w-6 h-6 md:w-8 md:h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur-md md:flex"><ChevronLeft className="w-3 h-3 md:w-4 md:h-4" /></button>
                 <div ref={scrollRef} className="flex overflow-x-auto gap-2 md:gap-2.5 px-8 py-1 no-scrollbar scroll-smooth">
                    {['Vientiane', 'Luang Prabang', 'Pakse', 'Vang Vieng', 'Savannakhet', 'Thakhek'].map(city => (
                        <button key={city} onClick={() => navigateTo('listings', { selectedCity: city })} className="bg-black/40 hover:bg-black/60 border border-white/10 text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-medium whitespace-nowrap backdrop-blur-md transition">{city}</button>
                    ))}
                 </div>
                 <button onClick={() => scroll('right')} className="absolute right-0 z-10 w-6 h-6 md:w-8 md:h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur-md md:flex"><ChevronRight className="w-3 h-3 md:w-4 md:h-4" /></button>
             </div>
          </div>
          
           <div className="mt-6 md:mt-8">
              <button onClick={() => navigateTo('sell')} className="flex items-center gap-2 md:gap-3 bg-[#1a1a1a]/90 hover:bg-black backdrop-blur-md border border-white/10 rounded-full px-4 py-2 md:px-6 md:py-2.5 shadow-xl transition transform hover:scale-105">
                 <div className="bg-yellow-500 rounded-full p-0.5 md:p-1"><Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-white fill-current" /></div>
                 <span className="text-gray-200 text-xs md:text-sm font-medium">Are you a Property Owner?</span>
                 <span className="text-white text-xs md:text-sm font-bold underline decoration-yellow-500 decoration-2 underline-offset-4">Sell / Rent for FREE &rarr;</span>
              </button>
           </div>
        </div>
      </section>

      {/* Featured Listings */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="flex justify-between items-end mb-6 md:mb-8">
             <h2 className="text-xl md:text-2xl font-bold text-gray-900">Featured Listings</h2>
             <button onClick={() => navigateTo('listings')} className="text-yellow-500 font-bold text-xs md:text-sm hover:underline">View All &rarr;</button>
        </div>
        <div id="home-grid" className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
           {properties.slice(0, 3).map(p => {
              const isInWishlist = wishlist.includes(p.id.toString());
              return (
               <div key={p.id} onClick={() => onViewProperty(p)} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition border border-gray-100 cursor-pointer group">
                  <div className="relative h-48 md:h-56 overflow-hidden">
                     <Image src={p.image || ''} alt={p.title} fill className="object-cover group-hover:scale-105 transition duration-500" />
                     <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-white/90 px-1.5 py-0.5 md:px-2 md:py-1 rounded text-[10px] md:text-xs font-bold uppercase text-gray-800">{p.type}</span>
                     <button 
                        onClick={(e) => toggleWishlist(e, p.id.toString())} 
                        className="absolute top-2 right-2 md:top-3 md:right-3 bg-white/80 p-1.5 md:p-2 rounded-full hover:bg-white transition"
                     >
                       <Heart 
                         size={16} 
                         className={`transition-all ${isInWishlist ? 'text-red-500' : 'text-gray-600'}`} 
                         fill={isInWishlist ? 'currentColor' : 'none'} 
                       />
                     </button>
                     <span className="absolute bottom-2 left-2 md:bottom-3 md:left-3 text-white font-bold drop-shadow-md text-base md:text-lg">{p.price}</span>
                  </div>
                  <div className="p-3 md:p-4">
                     <h3 className="font-bold text-base md:text-lg text-gray-900 mb-1">{p.title}</h3>
                     <p className="text-gray-500 text-xs md:text-sm flex items-center gap-1 mb-2 md:mb-3"><MapPin className="w-3 h-3" /> {p.location}</p>
                     <div className="flex justify-between text-[10px] md:text-xs text-gray-500 border-t pt-2 md:pt-3">
                        <span>{p.status}</span>
                        <span className="flex items-center gap-1 font-medium text-gray-600">
                          <Clock className="w-2.5 h-2.5" /> 
                          <ClientOnly>Just Now</ClientOnly>
                        </span>
                     </div>
                  </div>
               </div>
           )})}
        </div>
      </div>

      {/* Recent Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8">
        {properties.slice(3, 6).map((p) => {
          const isInWishlist = wishlist.includes(p.id.toString());
          const imageSrc = p.image || '/placeholder.png';
          const isPlaceholder = imageSrc === '/placeholder.png';

          return (
            <div
              key={p.id}
              onClick={() => onViewProperty(p)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition border border-gray-100 cursor-pointer group flex flex-col"
            >
              {/* Image */}
              <div className="relative h-52 md:h-56 overflow-hidden">
                <Image
                  src={imageSrc}
                  alt={p.title}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                  unoptimized={isPlaceholder}
                />

                <span className="absolute top-3 left-3 bg-gray-900/80 text-white px-2 py-1 rounded text-xs font-bold uppercase">
                  {p.category === 'rent' ? 'For Rent' : 'For Sale'}
                </span>

                <button
                  onClick={(e) => toggleWishlist(e, p.id.toString())}
                  className="absolute top-3 right-3 bg-white/80 p-2 rounded-full hover:bg-white transition"
                >
                  <Heart
                    size={16}
                    className={isInWishlist ? 'text-red-500' : 'text-gray-600'}
                    fill={isInWishlist ? 'currentColor' : 'none'}
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                {/* Title + Price */}
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                    {p.title}
                  </h3>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-500">Price (Kip)</p>
                    <p className="text-lg font-extrabold text-yellow-600">
                      ₭{p.price?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <MapPin size={14} /> {p.location}
                </p>

                {/* Spacer to align footer */}
                <div className="flex-1" />

                {/* Footer */}
                <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t mt-4">
                  <span className="flex items-center gap-2">
                    <HomeIcon size={14} />
                    {p.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {formatRelativeTime(p.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sell Property Banner */}
      <section className="py-8 px-4 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden h-48 md:h-64 flex items-center shadow-lg md:shadow-xl group cursor-pointer" onClick={() => navigateTo('sell')}>
             <Image src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Modern living room" fill className="object-cover group-hover:scale-105 transition duration-700" />
             <div className="absolute inset-0 bg-linear-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
             <div className="relative z-10 px-6 md:px-12 max-w-xl text-white">
                <h2 className="text-xl md:text-4xl font-bold mb-2 md:mb-3">List your property for <span className="text-yellow-500">FREE</span></h2>
                <p className="text-gray-300 text-sm md:text-base mb-4 md:mb-6">Reach thousands of potential buyers and renters daily.</p>
                <button className="bg-yellow-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold text-xs md:text-base hover:bg-[#b47a03] transition shadow-md flex items-center gap-2">
                    <PlusCircle className="w-3.5 h-3.5" /> Post Property
                </button>
             </div>
          </div>
        </div>
      </section>
      
      {/* Construction Highlight Section */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
           <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 border border-gray-100 shadow-sm">
               <div className="w-full md:w-1/2 space-y-4 md:space-y-6">
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded-full uppercase tracking-wider">
                       <HardHat className="w-4 h-4" /> Construction
                   </div>
                   <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Build Your Dream Project</h2>
                   <p className="text-gray-600 leading-relaxed text-sm md:text-lg">We don&apos;t just sell properties; we build them. From residential villas to commercial complexes, we offer end-to-end construction services.</p>
                   <ul className="space-y-2 md:space-y-3">
                       <li className="flex items-center gap-3 text-gray-700 font-medium text-sm md:text-base"><CheckCircle className="w-5 h-5 text-green-500" /> Architectural Design</li>
                       <li className="flex items-center gap-3 text-gray-700 font-medium text-sm md:text-base"><CheckCircle className="w-5 h-5 text-green-500" /> Construction Management</li>
                       <li className="flex items-center gap-3 text-gray-700 font-medium text-sm md:text-base"><CheckCircle className="w-5 h-5 text-green-500" /> Interior Finishing</li>
                   </ul>
                   <button onClick={() => navigateTo('services', { service: 'construction' })} className="mt-4 bg-gray-900 text-white px-6 py-3 md:px-8 md:py-3.5 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg inline-flex items-center gap-2 text-sm md:text-base">
                       Start Your Project <ArrowRight className="w-4 h-4" />
                   </button>
               </div>
               <div className="w-full md:w-1/2">
                   <div className="relative h-[250px] md:h-[400px] w-full">
                       <Image src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Construction site" fill className="object-cover rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl" />
                       <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-white p-4 md:p-6 rounded-lg md:rounded-xl shadow-xl border border-gray-100 hidden md:block">
                           <div className="flex items-center gap-3 md:gap-4">
                               <div className="bg-yellow-500 p-2 md:p-3 rounded-full text-white"><Hammer className="w-5 h-5 md:w-6 md:h-6" /></div>
                               <div>
                                   <p className="text-xs md:text-sm text-gray-500">Completed Projects</p>
                                   <p className="text-xl md:text-2xl font-bold text-gray-900">50+</p>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
        </div>
      </section>

      {/* --- Sponsored / Ads Section --- */}
      <section className="bg-gray-50 py-12 md:py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-6 md:mb-8">
                <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><Megaphone className="w-3 h-3" /> Sponsored</span>
                <div className="h-px bg-gray-200 flex-1"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {/* Ad Card 1: Home Loans */}
                <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-linear-to-br from-blue-900 to-blue-700 p-4 md:p-6 text-white shadow-lg group cursor-pointer hover:-translate-y-1 transition">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="bg-white/20 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg mb-3 md:mb-4 backdrop-blur-sm">
                                <Percent className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </div>
                            <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2">Home Loans</h3>
                            <p className="text-blue-100 text-[10px] md:text-xs leading-relaxed">Low rates @ 6.5%.</p>
                        </div>
                        <button className="mt-3 md:mt-4 bg-white/20 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-[10px] md:text-xs hover:bg-white hover:text-blue-900 transition flex items-center gap-2 w-fit">
                            Check
                        </button>
                    </div>
                </div>

                {/* Ad Card 2: Interiors */}
                <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-linear-to-br from-yellow-500 to-yellow-600 p-4 md:p-6 text-white shadow-lg group cursor-pointer hover:-translate-y-1 transition">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="bg-white/20 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg mb-3 md:mb-4 backdrop-blur-sm">
                                <PaintBucket className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </div>
                            <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2">Interiors</h3>
                            <p className="text-yellow-100 text-[10px] md:text-xs leading-relaxed">Turnkey solutions.</p>
                        </div>
                        <button className="mt-3 md:mt-4 bg-white/20 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-[10px] md:text-xs hover:bg-white hover:text-yellow-700 transition flex items-center gap-2 w-fit">
                            Book
                        </button>
                    </div>
                </div>

                {/* Ad Card 3: Valuation */}
                <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-linear-to-br from-purple-900 to-indigo-700 p-4 md:p-6 text-white shadow-lg group cursor-pointer hover:-translate-y-1 transition">
                     <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="bg-white/20 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg mb-3 md:mb-4 backdrop-blur-sm">
                                <LineChart className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </div>
                            <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2">Valuation</h3>
                            <p className="text-purple-100 text-[10px] md:text-xs leading-relaxed">Know your property&apos;s worth.</p>
                        </div>
                        <button className="mt-3 md:mt-4 bg-white/20 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-[10px] md:text-xs hover:bg-white hover:text-purple-900 transition flex items-center gap-2 w-fit">
                            Get Report
                        </button>
                    </div>
                </div>

                {/* Ad Card 4: Legal */}
                <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-linear-to-br from-green-800 to-emerald-600 p-4 md:p-6 text-white shadow-lg group cursor-pointer hover:-translate-y-1 transition">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="bg-white/20 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg mb-3 md:mb-4 backdrop-blur-sm">
                                <Scale className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </div>
                            <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2">Legal Help</h3>
                            <p className="text-green-100 text-[10px] md:text-xs leading-relaxed">Expert property law advice.</p>
                        </div>
                        <button className="mt-3 md:mt-4 bg-white/20 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-[10px] md:text-xs hover:bg-white hover:text-green-900 transition flex items-center gap-2 w-fit">
                            Consult
                        </button>
                    </div>
                </div>

            </div>
        </div>
      </section>
    </div>
  );
}

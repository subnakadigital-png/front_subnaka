'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  MapPin,
  Search,
  HardHat,
  CheckCircle,
  ArrowRight,
  PlusCircle,
  Loader,
  Home,
  Building2,
  Store,
  Trees,
  LocateFixed,
  Sparkles,
  Percent,
  Palette,
  TrendingUp,
  Scale
} from 'lucide-react';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { Property } from '@/lib/types';
import PublicPropertyCard from '@/components/shared/PublicPropertyCard';
import ClientOnly from '@/components/ClientOnly';
import MapPopup from '@/components/MapPopup';
import { ViewState } from 'react-map-gl/maplibre';
import { FlyToInterpolator } from '@deck.gl/core';

const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full flex items-center justify-center bg-gray-100 text-gray-500 rounded-3xl">
      <div className="flex flex-col items-center gap-2">
        <Loader className="animate-spin text-navy-900" />
        <p>Loading Map...</p>
      </div>
    </div>
  )
});

export default function HomePage() {
  const router = useRouter();
  const [searchTab, setSearchTab] = useState('sale');
  const [featured, setFeatured] = useState<Property[]>([]);
  const [recent, setRecent] = useState<Property[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Initial ViewState (Laos - Centered)
  const [viewState, setViewState] = useState<ViewState>({
    longitude: 103.5, // Centered better (shifted East)
    latitude: 18.5,   // Centered better (shifted North)
    zoom: 5.8,        // Slightly zoomed out to fit the elongated shape
    bearing: 0,
    pitch: 0,
    padding: { top: 20, bottom: 20, left: 20, right: 20 }
  });
  const [userLocation, setUserLocation] = useState<{longitude: number; latitude: number} | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        // Fetch all active properties for the map
        const allPropsQuery = query(
          collection(db, 'properties'),
          where('status', '==', 'Active')
        );
        const allSnapshot = await getDocs(allPropsQuery);
        const allProps: Property[] = allSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
        setProperties(allProps);

        // Fetch featured properties
        const featuredQuery = query(
          collection(db, 'properties'),
          where('status', '==', 'Active'),
          where('featured', '==', true),
          limit(3)
        );
        const featuredSnapshot = await getDocs(featuredQuery);
        const featuredProps: Property[] = featuredSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
        setFeatured(featuredProps);

        // Fetch recent properties
        const recentQuery = query(
          collection(db, 'properties'),
          where('status', '==', 'Active'),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const recentSnapshot = await getDocs(recentQuery);
        const recentProps: Property[] = recentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
        setRecent(recentProps);

      } catch (err) {
        console.error(err);
        setError('Failed to fetch properties.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const handlePropertySelect = (id: string | null) => {
    setSelectedId(id);
    if (id) {
      const prop = properties.find(p => p.id === id);
      if (prop && prop.longitude && prop.latitude) {
        setViewState(prev => ({
          ...prev,
          longitude: prop.longitude!,
          latitude: prop.latitude!,
          zoom: 12,
          transitionDuration: 1500,
          transitionInterpolator: new FlyToInterpolator()
        }));

        // Scroll map into view comfortably
        const mapElement = document.getElementById('map-section');
        if (mapElement) {
          mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  const handleViewStateChange = ({ viewState }: { viewState: ViewState }) => {
    setViewState(viewState);
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Store user location for blue dot marker
        setUserLocation({ longitude, latitude });
        
        // Update map view to user's location
        setViewState(prev => ({
          ...prev,
          longitude,
          latitude,
          zoom: 14,
          transitionDuration: 1500,
          transitionInterpolator: new FlyToInterpolator()
        }));

        // Scroll to map section
        const mapElement = document.getElementById('map-section');
        if (mapElement) {
          mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Please check your browser permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const selectedProperty = selectedId ? properties.find(p => p.id === selectedId) : null;

  return (
    <div className="animate-in fade-in duration-300">
      <section className="relative h-[650px] w-full flex flex-col items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <Image src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Hero background" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 to-black/60"></div>
        </div>

        <div className="w-full max-w-6xl px-4 flex flex-col items-center relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-3 drop-shadow-md">Find Your Place in Laos</h1>
            <p className="text-lg md:text-xl text-white/90 font-light">Vientiane • Luang Prabang • Pakse • Savannakhet</p>
          </div>

          {/* Enhanced Search Box */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto overflow-hidden">
            {/* Tabs */}
            <div className="flex gap-8 px-6 pt-4 pb-2">
              {[
                { id: 'buy', label: 'BUY' },
                { id: 'rent', label: 'RENT' },
                { id: 'commercial', label: 'COMMERCIAL' },
                { id: 'land', label: 'LAND' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSearchTab(tab.id)}
                  className={`text-sm font-bold transition-all pb-2 border-b-2 ${
                    searchTab === tab.id
                      ? 'text-yellow-500 border-yellow-500'
                      : 'text-gray-400 border-transparent hover:text-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Fields */}
            <div className="p-4">
              <div className="flex flex-col md:flex-row items-stretch gap-3">
                {/* Location Selector */}
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <select className="w-full pl-12 pr-4 py-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-yellow-500 text-gray-700 font-medium appearance-none cursor-pointer">
                    <option>Select Location</option>
                    <option>Vientiane</option>
                    <option>Luang Prabang</option>
                    <option>Pakse</option>
                    <option>Vang Vieng</option>
                    <option>Savannakhet</option>
                    <option>Thakhek</option>
                  </select>
                </div>

                {/* Property Type */}
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500">
                    <Home className="w-5 h-5" />
                  </div>
                  <select className="w-full pl-12 pr-4 py-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-yellow-500 text-gray-700 font-medium appearance-none cursor-pointer">
                    <option>Property Type</option>
                    <option>House</option>
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Condo</option>
                    <option>Land</option>
                    <option>Office</option>
                  </select>
                </div>

                {/* My Location Button */}
                <button 
                  onClick={handleMyLocation}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 font-medium transition whitespace-nowrap"
                >
                  <LocateFixed className="w-5 h-5" />
                  <span className="hidden sm:inline">My Location</span>
                </button>

                {/* Search Button */}
                <button 
                  onClick={() => navigateTo(`/listings?type=${searchTab}`)}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold shadow-md transition whitespace-nowrap"
                >
                  Search <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Popular Cities */}
          <div className="flex items-center gap-3 mt-6 flex-wrap justify-center">
            <span className="text-white/80 text-sm flex items-center gap-1">
              <ArrowRight className="w-4 h-4" /> Popular:
            </span>
            {['Vientiane', 'Luang Prabang', 'Pakse', 'Vang Vieng', 'Savannakhet', 'Thakhek'].map((city) => (
              <button
                key={city}
                onClick={() => navigateTo(`/listings?location=${city}`)}
                className="px-4 py-1.5 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white text-sm rounded-full transition border border-white/20"
              >
                {city}
              </button>
            ))}
          </div>

          {/* Post Property CTA */}
          <div className="mt-6">
            <button 
              onClick={() => navigateTo('/dashboard/properties/add')}
              className="flex items-center gap-2 px-5 py-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full transition border border-white/20 text-sm"
            >
              <PlusCircle className="w-4 h-4 text-yellow-400" />
              Are you a Property Owner? <span className="text-yellow-400 font-semibold underline">Sell / Rent for FREE →</span>
            </button>
          </div>
        </div>
      </section>

      

      <section id="map-section" className="py-12 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Properties Across Laos</h2>
            <p className="text-gray-500">Discover your perfect home and land with our interactive smart map.</p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white p-1 bg-white h-[600px] relative group">
            <ClientOnly>
              <MapComponent
                properties={properties}
                viewState={viewState}
                onViewStateChange={handleViewStateChange}
                selectedId={selectedId}
                onSelect={handlePropertySelect}
                userLocation={userLocation}
              />
              {selectedProperty && (
                <MapPopup
                  property={selectedProperty}
                  onClose={() => setSelectedId(null)}
                />
              )}
            </ClientOnly>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Listings</h2>
          <button onClick={() => navigateTo('/listings?featured=true')} className="text-yellow-500 font-bold text-sm hover:underline">View All &rarr;</button>
        </div>
        {loading ? (
          <div className="flex justify-center py-10"><Loader className="animate-spin text-yellow-500" size={32} /></div>
        ) : error ? (
          <div className="text-center py-10 text-red-500"><p>{error}</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map(p => (
              <div key={p.id} className="cursor-pointer transition-transform hover:scale-[1.02]" onClick={() => handlePropertySelect(p.id || null)}>
                <PublicPropertyCard prop={p} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-50 py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-yellow-500 font-bold uppercase tracking-widest text-xs mb-1 block">Fresh on Market</span>
              <h2 className="text-2xl font-bold text-gray-900">Recent Listings</h2>
            </div>
            <button onClick={() => navigateTo('/listings')} className="text-yellow-500 font-bold text-sm hover:underline">View All &rarr;</button>
          </div>
          {loading ? (
            <div className="flex justify-center py-10"><Loader className="animate-spin text-yellow-500" size={32} /></div>
          ) : error ? (
            <div className="text-center py-10 text-red-500"><p>{error}</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recent.map(p => (
                <div key={p.id} className="cursor-pointer transition-transform hover:scale-[1.02]" onClick={() => handlePropertySelect(p.id || null)}>
                  <PublicPropertyCard prop={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden h-64 flex items-center shadow-xl group cursor-pointer" onClick={() => navigateTo('/dashboard/properties/add')}>
            <Image src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80" alt="Living room" fill className="object-cover group-hover:scale-105 transition duration-700" />
            <div className="absolute inset-0 bg-linear-to-r from-gray-900/80 to-transparent"></div>
            <div className="relative z-10 px-12 max-w-xl text-white">
              <h2 className="text-4xl font-bold mb-3">List your property for <span className="text-yellow-500">FREE</span></h2>
              <p className="text-gray-200 text-lg mb-6">Reach thousands of potential buyers and renters daily.</p>
              <button className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 transition shadow-md flex items-center gap-2">
                <PlusCircle className="w-5 h-5" /> Post Property
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12 bg-white rounded-3xl p-12 border border-gray-100 shadow-lg">
            <div className="w-full md:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-600 text-sm font-bold rounded-full uppercase">
                <HardHat /> Construction
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Build Your Dream Project</h2>
              <p className="text-gray-600 leading-relaxed text-lg">We offer end-to-end construction services, from design to completion.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700 font-medium"><CheckCircle className="w-5 h-5 text-green-500" /> Architectural Design</li>
                <li className="flex items-center gap-3 text-gray-700 font-medium"><CheckCircle className="w-5 h-5 text-green-500" /> Construction Management</li>
                <li className="flex items-center gap-3 text-gray-700 font-medium"><CheckCircle className="w-5 h-5 text-green-500" /> Interior Finishing</li>
              </ul>
              <button onClick={() => navigateTo('/services')} className="mt-4 bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg inline-flex items-center gap-2">
                Learn More <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full md:w-1/2">
              <div className="relative h-[400px] w-full">
                <Image src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1000&q=80" alt="Construction" fill className="object-cover rounded-2xl shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
    {/* Sponsored Services Section */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs text-gray-400 font-medium mb-4 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> SPONSORED
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Home Loans */}
            <div className="bg-blue-600 rounded-xl p-5 text-white hover:shadow-lg transition cursor-pointer">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <Percent className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-1">Home Loans</h3>
              <p className="text-sm text-white/80 mb-4">Low rates @ 6.5%.</p>
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition">
                Check
              </button>
            </div>

            {/* Interiors */}
            <div className="bg-yellow-500 rounded-xl p-5 text-white hover:shadow-lg transition cursor-pointer">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-1">Interiors</h3>
              <p className="text-sm text-white/80 mb-4">Turnkey solutions.</p>
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition">
                Book
              </button>
            </div>

            {/* Valuation */}
            <div className="bg-purple-600 rounded-xl p-5 text-white hover:shadow-lg transition cursor-pointer">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-1">Valuation</h3>
              <p className="text-sm text-white/80 mb-4">Know your property&apos;s worth.</p>
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition">
                Get Report
              </button>
            </div>

            {/* Legal Help */}
            <div className="bg-emerald-600 rounded-xl p-5 text-white hover:shadow-lg transition cursor-pointer">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-1">Legal Help</h3>
              <p className="text-sm text-white/80 mb-4">Expert property law advice.</p>
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition">
                Consult
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
    
  );
}

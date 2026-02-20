'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  ListFilter, X, SlidersHorizontal, Search, MapPin, ArrowRight,
  Bed, Bath, Maximize, ChevronDown, Map, LayoutGrid
} from 'lucide-react';
import { Property } from '@/lib/types';
import FilterContent from '@/components/FilterContent';
import ClientOnly from '@/components/ClientOnly';
import MapPopup from '@/components/MapPopup';
import { useRouter } from 'next/navigation';
import { ViewState } from 'react-map-gl/maplibre';
import { FlyToInterpolator } from '@deck.gl/core';
import Image from 'next/image';

const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-400 animate-pulse">Loading Map...</p>
    </div>
  )
});

function PropertyCard({ prop, isSelected, onClick }: { prop: Property; isSelected: boolean; onClick: () => void }) {
  const router = useRouter();
  const formatPrice = (price: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'THB', minimumFractionDigits: 0,
  }).format(price);

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl overflow-hidden shadow-md cursor-pointer transition-all duration-200 border-2 bg-white hover:shadow-xl hover:-translate-y-0.5 ${isSelected ? 'border-yellow-500 ring-2 ring-yellow-200' : 'border-transparent'
        }`}
    >
      <div className="relative h-44">
        <Image
          src={prop.imageUrls?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'}
          alt={prop.title}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute top-3 left-3 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          {prop.type}
        </div>
        {isSelected && (
          <div className="absolute inset-0 bg-yellow-500/10 border-2 border-yellow-400 rounded-2xl" />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">{prop.title}</h3>
        <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
          <MapPin size={11} />
          <span className="truncate">{prop.location}</span>
        </div>
        <p className="text-yellow-500 font-bold text-lg mb-3">{formatPrice(prop.price)}</p>
        <div className="flex items-center gap-4 text-gray-500 text-xs border-t pt-3">
          {prop.bedrooms !== undefined && (
            <span className="flex items-center gap-1"><Bed size={12} /> {prop.bedrooms}</span>
          )}
          {prop.bathrooms !== undefined && (
            <span className="flex items-center gap-1"><Bath size={12} /> {prop.bathrooms}</span>
          )}
          {prop.area !== undefined && (
            <span className="flex items-center gap-1"><Maximize size={12} /> {prop.area} m²</span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); router.push(`/listings/${prop.id}`); }}
            className="ml-auto text-yellow-500 hover:text-yellow-600 font-bold flex items-center gap-1"
          >
            Details <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ListingsClient({ properties }: { properties: Property[] }) {
  const [filters, setFilters] = useState({
    keyword: '',
    type: 'All',
    propertyType: 'All',
    location: 'All',
    bedrooms: 'Any',
    priceRange: [0, 10000000000],
    areaRange: [0, 10000],
  });
  const [sortBy, setSortBy] = useState('Newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewState, setViewState] = useState<ViewState>({
    longitude: 103.5,
    latitude: 18.5,
    zoom: 5.8,
    bearing: 0,
    pitch: 0,
    padding: { top: 20, bottom: 20, left: 20, right: 20 }
  });

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const propertiesToDisplay = useMemo(() => {
    let filtered = properties.filter((p: Property) => {
      const price = p.price || 0;
      const area = p.area || 0;
      const bedrooms = p.bedrooms || 0;

      const keywordMatch = filters.keyword.trim() === '' ||
        p.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        p.location.toLowerCase().includes(filters.keyword.toLowerCase());

      const typeMatch = filters.type === 'All' || p.type === filters.type;
      const propertyTypeMatch = filters.propertyType === 'All' || (p as any).propertyType === filters.propertyType;
      const locationMatch = filters.location === 'All' || p.location === filters.location;
      const bedroomsMatch = filters.bedrooms === 'Any' || bedrooms >= parseInt(filters.bedrooms);
      const priceMatch = price >= filters.priceRange[0] && price <= filters.priceRange[1];
      const areaMatch = area >= filters.areaRange[0] && area <= filters.areaRange[1];

      return keywordMatch && typeMatch && propertyTypeMatch && locationMatch && bedroomsMatch && priceMatch && areaMatch;
    });

    return filtered.sort((a: Property, b: Property) => {
      const priceA = a.price || 0;
      const priceB = b.price || 0;
      const dateA = (a.createdAt as any)?.seconds ? new Date((a.createdAt as any).seconds * 1000) : new Date(a.createdAt as any);
      const dateB = (b.createdAt as any)?.seconds ? new Date((b.createdAt as any).seconds * 1000) : new Date(b.createdAt as any);

      switch (sortBy) {
        case 'Price: Low to High': return priceA - priceB;
        case 'Price: High to Low': return priceB - priceA;
        case 'Oldest': return dateA.getTime() - dateB.getTime();
        case 'Newest':
        default: return dateB.getTime() - dateA.getTime();
      }
    });
  }, [properties, filters, sortBy]);

  const locations = ['All', ...Array.from(new Set(properties.map(p => p.location)))];
  const propertyTypes = ['All', ...Array.from(new Set(properties.map(p => (p as any).propertyType).filter(Boolean)))];

  const resetFilters = () => {
    setFilters({ keyword: '', type: 'All', propertyType: 'All', location: 'All', bedrooms: 'Any', priceRange: [0, 10000000000], areaRange: [0, 10000] });
    setSortBy('Newest');
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
          zoom: 13,
          transitionDuration: 1500,
          transitionInterpolator: new FlyToInterpolator()
        }));
      }
    }
  };

  const handleViewStateChange = ({ viewState }: { viewState: ViewState }) => {
    setViewState(viewState);
  };

  const selectedProperty = selectedId ? properties.find(p => p.id === selectedId) : null;

  return (
    <div className="flex flex-col h-screen pt-16 bg-gray-50">
      {/* ── Top Filter & Search Bar ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm px-4 py-3 flex flex-wrap gap-3 items-center z-20">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title or location..."
            value={filters.keyword}
            onChange={e => handleFilterChange('keyword', e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-yellow-400 outline-none"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {['All', 'house', 'apartment', 'villa', 'office', 'land'].map(t => (
            <button
              key={t}
              onClick={() => handleFilterChange('type', t)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition ${filters.type === t ? 'bg-yellow-500 text-white shadow' : 'text-gray-500 hover:text-gray-800'
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="appearance-none text-sm font-bold bg-gray-100 border-none rounded-lg pl-3 pr-8 py-2 text-gray-700 focus:ring-2 focus:ring-yellow-400 outline-none cursor-pointer"
          >
            <option>Newest</option>
            <option>Oldest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
          <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* View Toggle (mobile only) */}
        <button
          onClick={() => setShowMobileMap(!showMobileMap)}
          className="md:hidden flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-xs font-bold hover:bg-gray-200 transition"
        >
          {showMobileMap ? <LayoutGrid size={14} /> : <Map size={14} />}
          {showMobileMap ? 'List' : 'Map'}
        </button>

        {/* More Filters */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-1.5 bg-navy-900 text-white bg-[#1e3a5f] px-3 py-2 rounded-lg text-xs font-bold hover:bg-[#16304f] transition"
        >
          <SlidersHorizontal size={14} /> Filters
        </button>

        <span className="text-xs text-gray-400 ml-auto hidden md:block">
          {propertiesToDisplay.length} properties found
        </span>
      </div>

      {/* ── Split View: Sidebar + Map ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Property List Sidebar */}
        <div className={`${showMobileMap ? 'hidden md:block' : 'block'} w-full md:w-[420px] shrink-0 overflow-y-auto bg-gray-50 p-4 space-y-4 border-r border-gray-200`}>
          <p className="text-xs text-gray-400 font-medium md:hidden">{propertiesToDisplay.length} properties found</p>
          {propertiesToDisplay.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-bold text-gray-400">No Properties Found</h3>
              <p className="text-gray-300 mt-2 text-sm">Try adjusting your filters.</p>
            </div>
          ) : (
            propertiesToDisplay.map((p: Property) => (
              <PropertyCard
                key={p.id}
                prop={p}
                isSelected={selectedId === p.id}
                onClick={() => handlePropertySelect(selectedId === p.id ? null : (p.id || null))}
              />
            ))
          )}
        </div>

        {/* Map Panel */}
        <div className={`${showMobileMap ? 'block' : 'hidden md:block'} flex-1 relative`}>
          <ClientOnly>
            <MapComponent
              properties={propertiesToDisplay}
              viewState={viewState}
              onViewStateChange={handleViewStateChange}
              selectedId={selectedId}
              onSelect={handlePropertySelect}
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

      {/* ── Mobile Filter Drawer ── */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsFilterOpen(false)} />
      )}
      <div className={`fixed top-0 right-0 h-full w-5/6 max-w-sm bg-white z-50 transform transition-transform duration-300 ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Filters</h3>
            <button onClick={() => setIsFilterOpen(false)}><X size={24} /></button>
          </div>
          <FilterContent
            filters={filters}
            handleFilterChange={handleFilterChange}
            resetFilters={resetFilters}
            locations={locations}
            propertyTypes={propertyTypes}
          />
        </div>
      </div>
    </div>
  );
}

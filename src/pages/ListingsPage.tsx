'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { ListFilter, X, SlidersHorizontal, ExternalLink, ArrowRight } from 'lucide-react';
import { Property } from '@/lib/types';
import FilterContent from '@/components/FilterContent';
import { useRouter } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';

const PostPropertyBanner = () => {
    const router = useRouter();
    return (
    <div className="bg-yellow-500 rounded-2xl p-6 text-center">
        <h3 className="text-lg font-bold text-white">Are you a property owner?</h3>
        <p className="text-white/90 text-sm mt-2 mb-4">Post your property for FREE and reach thousands of potential clients.</p>
        <button onClick={() => router.push('/dashboard/properties/add')} className="bg-white text-yellow-600 font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition text-sm flex items-center justify-center w-full gap-2">
            Post Your Property <ArrowRight size={16} />
        </button>
    </div>
)};

const AdSidebar = () => {
    const router = useRouter();
    return (
    <aside className="w-full lg:w-1/4 h-fit sticky top-24 space-y-6">
        <PostPropertyBanner />
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Sponsored</h3>
            <div className="relative h-40 rounded-lg overflow-hidden mb-4">
                <Image src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80" layout="fill" objectFit="cover" alt="Sponsored Property"/>
            </div>
            <h4 className="font-bold text-md text-gray-900">Lakefront Luxury Villa</h4>
            <p className="text-sm text-gray-500 mb-3">Vientiane</p>
            <button onClick={() => router.push('#')} className="w-full bg-yellow-500 text-white py-2 rounded-lg font-bold text-sm hover:bg-yellow-600 transition flex items-center justify-center gap-2">
                View Details <ExternalLink size={14}/>
            </button>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Advertise With Us</h3>
            <p className="text-sm text-gray-600 mb-4">Reach thousands of potential buyers and renters across Laos.</p>
            <button onClick={() => router.push('/contact')} className="w-full bg-gray-800 text-white py-2 rounded-lg font-bold text-sm hover:bg-black transition">
                Contact Sales
            </button>
        </div>
    </aside>
)};

export default function ListingsPage({ properties }: { properties: Property[] }) {
  const [filters, setFilters] = useState({
    keyword: '',
    saleType: 'All',
    type: 'All',
    location: 'All',
    beds: 'Any',
    priceRange: [0, 10000000000],
    areaRange: [0, 10000],
  });
  const [sortBy, setSortBy] = useState('Newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const propertiesToDisplay = useMemo(() => {
    let filtered = properties.filter((p: Property) => {
        const price = parseInt(p.price.toString());
        const area = p.area || 0;

        const keywordMatch = filters.keyword.trim() === '' || p.title.toLowerCase().includes(filters.keyword.toLowerCase()) || p.location.toLowerCase().includes(filters.keyword.toLowerCase());
        const saleTypeMatch = filters.saleType === 'All' || p.type === filters.saleType;
        const typeMatch = filters.type === 'All' || p.category === filters.type;
        const locationMatch = filters.location === 'All' || p.location === filters.location;
        const bedsMatch = filters.beds === 'Any' || (p.bedrooms && parseInt(p.bedrooms.toString()) >= parseInt(filters.beds));
        const priceMatch = price >= filters.priceRange[0] && price <= filters.priceRange[1];
        const areaMatch = area >= filters.areaRange[0] && area <= filters.areaRange[1];

        return keywordMatch && saleTypeMatch && typeMatch && locationMatch && bedsMatch && priceMatch && areaMatch;
    });

    return filtered.sort((a: Property, b: Property) => {
        const priceA = parseInt(a.price.toString());
        const priceB = parseInt(b.price.toString());
        switch (sortBy) {
            case 'Price: Low to High': return priceA - priceB;
            case 'Price: High to Low': return priceB - priceA;
            case 'Oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'Newest':
            default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
    });

  }, [properties, filters, sortBy]);

  const locations = ['All', ...Array.from(new Set(properties.map(p => p.location)))];
  const propertyTypes = ['All', ...Array.from(new Set(properties.map(p => p.category)))];

  const resetFilters = () => {
    setFilters({
      keyword: '',
      saleType: 'All',
      type: 'All',
      location: 'All',
      beds: 'Any',
      priceRange: [0, 10000000000],
      areaRange: [0, 10000],
    });
    setSortBy('Newest');
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8 bg-gray-50 relative z-10">
      <div className="flex flex-col lg:flex-row gap-8 pt-4">
          
          <aside className="hidden lg:block w-full lg:w-1/4 h-fit sticky top-24">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <FilterContent 
                    filters={filters} 
                    handleFilterChange={handleFilterChange} 
                    resetFilters={resetFilters} 
                    locations={locations} 
                    propertyTypes={propertyTypes} 
                  />
              </div>
          </aside>

          <main className="w-full lg:w-3/5">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Showing {propertiesToDisplay.length} Properties</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <ListFilter size={16}/>
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="font-bold bg-transparent pr-8 rounded-md text-gray-800 focus:ring-2 focus:ring-yellow-500 outline-none">
                            <option>Newest</option>
                            <option>Oldest</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>
                </div>
                <div className="lg:hidden">
                    <button onClick={() => setIsFilterOpen(true)} className="bg-yellow-500 text-white font-bold py-2 px-3 text-sm rounded-lg shadow-md hover:bg-yellow-600 transition flex items-center justify-center gap-2">
                        <SlidersHorizontal size={16} />
                        Filter
                    </button>
                </div>
            </div>
            
            {isFilterOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsFilterOpen(false)}></div>
            )}
            <div className={`fixed top-0 right-0 h-full w-5/6 max-w-sm bg-white z-50 transform transition-transform duration-300 ease-in-out ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}>
                <div className="p-6 h-full overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Filters</h3>
                        <button onClick={() => setIsFilterOpen(false)}><X size={24}/></button>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {propertiesToDisplay.map((p: Property) => (
                <PropertyCard key={p.id} prop={p} variant="public" />
              ))}
              {propertiesToDisplay.length === 0 && (
                  <div className="md:col-span-2 text-center py-20">
                      <h3 className="text-2xl font-bold text-gray-500">No Properties Found</h3>
                      <p className="text-gray-400 mt-2">Try adjusting your filters to find what you&apos;re looking for.</p>
                  </div>
              )}
            </div>
          </main>

          <AdSidebar />
        </div>
      </div>
    </div>
  );
}

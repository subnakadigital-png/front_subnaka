'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/lib/types';
import { getSavedPropertyIds } from '@/lib/localStorage';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';

export default function SavedPropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        setLoading(true);
        const savedPropertyIds = getSavedPropertyIds();
        
        if (savedPropertyIds.length === 0) {
          setProperties([]);
          setLoading(false);
          return;
        }

        // Fetch properties from Firestore based on saved IDs
        const propertiesCollection = collection(db, 'properties');
        const q = query(propertiesCollection, where('__name__', 'in', savedPropertyIds.slice(0, 10)));
        const snapshot = await getDocs(q);
        
        const fetchedProperties: Property[] = [];
        snapshot.forEach(doc => {
          fetchedProperties.push({ id: doc.id, ...doc.data() } as Property);
        });
        
        setProperties(fetchedProperties);
      } catch (err) {
        setError('Failed to fetch saved properties.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, []);

  const handleViewProperty = (property: Property) => {
    if (property.id) {
      router.push(`/listings/${property.id}`);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-4 mb-8">
            <Heart className="w-8 h-8 text-slate-500" />
            <h1 className="text-3xl font-bold text-slate-900">Saved Properties</h1>
        </div>

        {loading && (
            <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                <p className="mt-4 text-slate-500">Loading your saved properties...</p>
            </div>
        )}

        {error && (
            <div className="text-center py-20 bg-white rounded-2xl border border-red-200">
                <p className="text-red-500">{error}</p>
            </div>
        )}
        
        {!loading && !error && properties.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
                <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800">No Saved Properties</h3>
                <p className="text-slate-500 mt-2">You haven&apos;t saved any properties yet. Start browsing and save your favorites!</p>
            </div>
        )}

        {!loading && !error && properties.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} onViewProperty={handleViewProperty} />
                ))}
            </div>
        )}
      </div>
    </div>
  );
}

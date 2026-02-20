'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { Property } from '@/lib/types';

interface PropertiesContextType {
  properties: Property[];
  loading: boolean;
  error: string | null;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

export const useProperties = () => {
  const context = useContext(PropertiesContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertiesProvider');
  }
  return context;
};

export const PropertiesProvider = ({ children }: { children: React.ReactNode }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'properties'), where('status', '==', 'Active'));
        const querySnapshot = await getDocs(q);
        const props: Property[] = [];
        querySnapshot.forEach(doc => {
          const data = doc.data();
          const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt;
          props.push({ id: doc.id, ...data, createdAt } as Property);
        });
        setProperties(props);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to load properties.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const value = {
    properties,
    loading,
    error,
  };

  return (
    <PropertiesContext.Provider value={value}>
      {children}
    </PropertiesContext.Provider>
  );
};

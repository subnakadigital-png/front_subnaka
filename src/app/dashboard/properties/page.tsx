'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase-client';
import { collection, query, orderBy, limit, startAfter, getDocs, QueryDocumentSnapshot } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { deleteProperty as deletePropertyAction, approveProperty as approvePropertyAction } from '@/app/actions';
import { Property } from '@/lib/types';
import Toast from '@/components/dashboard/shared/Toast';
import AddPropertyView from '@/components/dashboard/views/AddProperty';
import { Plus, ArrowLeft, X } from 'lucide-react';
import ConfirmationModal from '@/components/dashboard/shared/ConfirmationModal';
import EditPropertyForm from '@/components/dashboard/forms/EditPropertyForm';
import DashboardPropertyCard from '@/components/shared/DashboardPropertyCard';

const PROPERTIES_PER_PAGE = 8;

export default function PropertyListingsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const { user, loading: authLoading } = useAuth();
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('properties');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const [filter, setFilter] = useState('All');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  const filteredProperties = properties.filter(p => filter === 'All' || p.status === filter);

  const refreshProperties = useCallback(async () => {
    if (!user) return;

    setDataLoading(true);
    try {
      const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'), limit(PROPERTIES_PER_PAGE));
      const snapshot = await getDocs(q);

      const props: Property[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt;
        props.push({ id: doc.id, ...data, createdAt } as Property);
      });

      setProperties(props);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PROPERTIES_PER_PAGE);
    } catch (error) {
      console.error("Error fetching initial properties: ", error);
      setToast({ message: 'Failed to load properties.', type: 'error' });
    } finally {
      setDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        refreshProperties();
      } else {
        setProperties([]);
        setDataLoading(false);
      }
    }
  }, [user, authLoading, refreshProperties]);

  const fetchMoreProperties = async () => {
    if (!user || !lastDoc || !hasMore || loadingMore) return;

    setLoadingMore(true);

    const q = query(
      collection(db, 'properties'),
      orderBy('createdAt', 'desc'),
      startAfter(lastDoc),
      limit(PROPERTIES_PER_PAGE)
    );

    try {
        const snapshot = await getDocs(q);
        const newProps: Property[] = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt;
            newProps.push({ id: doc.id, ...data, createdAt } as Property);
        });

        setProperties(prev => [...prev, ...newProps]);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === PROPERTIES_PER_PAGE);
    } catch (error) {
        console.error("Error fetching more properties: ", error);
        setToast({ message: 'Failed to load more properties', type: 'error' });
    } finally {
        setLoadingMore(false);
    }
  };

  const handleUpdateProperty = (updatedProperty: Property) => {
    setProperties(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
    setEditModalOpen(false);
    setToast({ message: 'Property updated successfully!', type: 'success' });
  };

  const handleDeleteProperty = async () => {
    if (propertyToDelete) {
      const result = await deletePropertyAction(propertyToDelete);
      if (result.success) {
          setToast({ message: 'Property deleted successfully!', type: 'success' });
          setProperties(prev => prev.filter(p => p.id !== propertyToDelete));
      } else {
          setToast({ message: `Error: ${result.message}` || 'Failed to delete property', type: 'error' });
      }
      setDeleteModalOpen(false);
      setPropertyToDelete(null);
    }
  };
  
  const handleApprove = async (propertyId: string) => {
    const result = await approvePropertyAction(propertyId);
    if (result.success) {
      setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, status: 'Active' } : p));
      setToast({ message: 'Property approved successfully!', type: 'success' });
    } else {
      setToast({ message: result.message || 'Failed to approve property', type: 'error' });
    }
  }

  const openDeleteModal = (property: Property) => {
    if (property.id) {
      setPropertyToDelete(property.id);
      setDeleteModalOpen(true);
    }
  };

  const openEditModal = (property: Property) => {
    setSelectedProperty(property);
    setEditModalOpen(true);
  };

  const handleAddProperty = (property: Property) => {
    setActiveTab('properties');
    setToast({ message: 'Property added successfully!', type: 'success' });
    refreshProperties();
  }

  if (authLoading || dataLoading) {
    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-10">Loading Properties...</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-lg animate-pulse">
                        <div className="h-48 bg-slate-200 rounded-t-2xl"></div>
                        <div className="p-6">
                            <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  }

  return (
    <div className="p-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {activeTab === 'properties' ?
        <div>
          <div className="flex justify-between items-center mb-10">
              <div>
                  <button onClick={() => setActiveTab('dashboard')} className="flex items-center text-slate-500 hover:text-slate-700 mb-4">
                      <ArrowLeft size={20} className="mr-2" />
                      Back to Dashboard
                  </button>
                  <h1 className="text-4xl font-bold text-slate-800">Property Listings</h1>
                  <p className="text-slate-500 mt-2">Manage all your property listings in one place.</p>
              </div>
              <button onClick={() => setActiveTab('add-property')} className="bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:byellow-600 transition flex items-center gap-2">
                  <Plus size={18}/>
                  Add Property
              </button>
          </div>

          <div className="mb-6 flex gap-2">
            <button onClick={() => setFilter('All')} className={`px-4 py-2 rounded-lg font-semibold ${filter === 'All' ? 'bg-yellow-500 text-white' : 'bg-white text-slate-600'}`}>All ({properties.length})</button>
            <button onClick={() => setFilter('Active')} className={`px-4 py-2 rounded-lg font-semibold ${filter === 'Active' ? 'bg-green-500 text-white' : 'bg-white text-slate-600'}`}>Active ({properties.filter(p=>p.status === 'Active').length})</button>
            <button onClick={() => setFilter('Pending')} className={`px-4 py-2 rounded-lg font-semibold ${filter === 'Pending' ? 'bg-orange-500 text-white' : 'bg-white text-slate-600'}`}>Pending ({properties.filter(p=>p.status === 'Pending').length})</button>
            <button onClick={() => setFilter('Inactive')} className={`px-4 py-2 rounded-lg font-semibold ${filter === 'Inactive' ? 'bg-red-500 text-white' : 'bg-white text-slate-600'}`}>Inactive ({properties.filter(p=>p.status === 'Inactive').length})</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties.map((p) => (
                  <DashboardPropertyCard 
                      key={p.id} 
                      prop={p} 
                      onEdit={() => openEditModal(p)} 
                      onDelete={() => openDeleteModal(p)} 
                      onApprove={handleApprove}
                  />
              ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-20 col-span-full">
                <h3 className="text-2xl font-bold text-gray-500">No Properties Found</h3>
                <p className="text-gray-400 mt-2">No properties match the current filter.</p>
            </div>
          )}

          {hasMore && (
              <div className="mt-8 text-center">
                  <button 
                      onClick={fetchMoreProperties} 
                      disabled={loadingMore}
                      className="bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-yellow-600 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
                  >
                      {loadingMore ? 'Loading...' : 'Load More'}
                  </button>
              </div>
          )}

          {isDeleteModalOpen && (
              <ConfirmationModal
                  isOpen={isDeleteModalOpen}
                  title="Delete Property"
                  message="Are you sure you want to delete this property? This action cannot be undone."
                  onConfirm={handleDeleteProperty}
                  onCancel={() => setDeleteModalOpen(false)}
              />
          )}

          {isEditModalOpen && selectedProperty && (
             <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] flex flex-col relative">
                   <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-3xl font-bold text-slate-800">Edit Property</h2>
                        <button onClick={() => setEditModalOpen(false)} className="bg-slate-100 rounded-full p-2 hover:bg-slate-200 z-10">
                            <X size={20} className="text-slate-600" />
                        </button>
                   </div>
                   <div className="overflow-y-auto flex-grow p-8">
                      <EditPropertyForm 
                          property={selectedProperty} 
                          onUpdate={handleUpdateProperty} 
                          onCancel={() => setEditModalOpen(false)} 
                      />
                    </div>
                </div>
            </div>
          )}
        </div>
      :
        <AddPropertyView onPropertyAdded={handleAddProperty} setActiveTab={setActiveTab} />
      }
    </div>
  );
}

import { firestore } from '@/lib/firebase-admin';
import { Property } from '@/lib/types';
import ListingsClient from '@/components/ListingsClient';

async function getProperties(): Promise<Property[]> {
  if (!firestore) {
    console.warn('Firestore not initialized, returning empty properties');
    return [];
  }
  const propertiesCollection = firestore.collection('properties');
  const snapshot = await propertiesCollection.where('status', '==', 'Active').get();

  if (snapshot.empty) {
    return [];
  }

  const properties: Property[] = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    const createdAt = data.createdAt.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString();
    properties.push({
      id: doc.id,
      title: data.title || '',
      description: data.description || '',
      price: data.price || 0,
      location: data.location || '',
      imageUrls: data.imageUrls || [],
      image: data.image || '',
      status: data.status || 'Inactive',
      createdAt: createdAt,
      bedrooms: data.bedrooms || 0,
      bathrooms: data.bathrooms || 0,
      area: data.area || 0,
      type: data.type || '',
      category: data.category || '',
      features: data.features || [],
      agent: data.agent,
      latitude: data.latitude,
      longitude: data.longitude,
    } as Property);
  });

  return properties;
}

export default async function ListingsPage() {
  const properties = await getProperties();

  return <ListingsClient properties={properties} />;
}

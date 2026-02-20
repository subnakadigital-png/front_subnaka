import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { Property } from '@/types/firestore';

const propertiesCollection = collection(db, 'properties');

const sampleProperties: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Modern Apartment in the City Center',
    description: 'A stunning apartment with breathtaking views of the city skyline. Perfect for young professionals.',
    type: 'rent',
    propertyType: 'apartment',
    price: 2500,
    location: 'Vientiane',
    address: '123 Main Street, Vientiane',
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    ],
    amenities: ['Swimming Pool', 'Gym', '24/7 Security'],
    agentId: 'agent123',
    status: 'available',
    featured: true,
  },
  {
    title: 'Spacious Family Home with a Garden',
    description: 'A beautiful family home with a large garden, perfect for families with children and pets.',
    type: 'sale',
    propertyType: 'house',
    price: 500000,
    location: 'Vientiane',
    address: '456 Oak Avenue, Vientiane',
    bedrooms: 4,
    bathrooms: 3,
    area: 300,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    ],
    amenities: ['Garden', 'Garage', 'Pet Friendly'],
    agentId: 'agent456',
    status: 'available',
    featured: false,
  },
];

export const seedDatabase = async () => {
  for (const property of sampleProperties) {
    await addDoc(propertiesCollection, {
      ...property,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  console.log('Database seeded successfully!');
};

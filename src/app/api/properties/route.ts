
import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { Property } from '@/lib/types';

export async function GET() {
  try {
    const propertiesCollection = collection(db, 'properties');
    const propertySnapshot = await getDocs(propertiesCollection);
    const properties: Property[] = propertySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Property[];
    
    const simplifiedProperties = properties.map(p => ({
      id: p.id,
      name: p.name,
      latitude: p.latitude,
      longitude: p.longitude,
    }));

    return NextResponse.json(simplifiedProperties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

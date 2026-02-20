import { db } from './firebase-client';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import type { Property } from '@/types/firestore';
import type { StaffMember } from '@/lib/types';

// Firestore data converter for Properties
const propertyConverter = {
  toFirestore: (property: Property) => {
    return {
      ...property,
      createdAt: property.createdAt ? Timestamp.fromDate(new Date(property.createdAt)) : serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
      createdAt: data.createdAt?.toDate().toISOString(),
      updatedAt: data.updatedAt?.toDate().toISOString(),
    } as Property;
  },
};

// Firestore data converter for Staff
const staffConverter = {
    toFirestore: (staff: StaffMember) => {
        return {
            ...staff,
        };
    },
    fromFirestore: (snapshot: any, options: any) => {
        const data = snapshot.data(options);
        return {
            ...data,
            id: snapshot.id,
        } as StaffMember;
    },
};


// Collection references with converters
const propertiesCollection = collection(db, 'properties').withConverter(propertyConverter);
const staffCollection = collection(db, 'staff').withConverter(staffConverter);

// Property functions
export const addProperty = async (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await addDoc(propertiesCollection, propertyData as Property);
  return docRef.id;
};

export const getProperties = async (): Promise<Property[]> => {
  const snapshot = await getDocs(propertiesCollection);
  return snapshot.docs.map(doc => doc.data());
};

export const getProperty = async (id: string): Promise<Property | null> => {
    const docRef = doc(db, 'properties', id).withConverter(propertyConverter);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
}

export const updateProperty = async (propertyId: string, updates: Partial<Omit<Property, 'id' | 'createdAt'>>): Promise<void> => {
  const propertyDoc = doc(db, 'properties', propertyId);
  await updateDoc(propertyDoc, { ...updates, updatedAt: serverTimestamp() });
};

export const deleteProperty = async (propertyId: string): Promise<void> => {
  const propertyDoc = doc(db, 'properties', propertyId);
  await deleteDoc(propertyDoc);
};

// Staff functions
export const getStaff = async (): Promise<StaffMember[]> => {
    const snapshot = await getDocs(staffCollection);
    return snapshot.docs.map(doc => doc.data());
};

export const deleteStaff = async (staffId: string): Promise<void> => {
    const staffDoc = doc(db, 'staff', staffId);
    await deleteDoc(staffDoc);
};

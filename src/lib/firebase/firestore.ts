import { doc, addDoc, deleteDoc, collection, query, where, getDocs, documentId } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { Property } from '@/lib/types';

export const saveProperty = async (userId: string, propertyId: string) => {
  try {
    await addDoc(collection(db, 'savedProperties'), {
      userId,
      propertyId,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error saving property: ', error);
    throw new Error('Failed to save property');
  }
};

export const unsaveProperty = async (userId: string, propertyId: string) => {
  try {
    const q = query(
      collection(db, 'savedProperties'),
      where('userId', '==', userId),
      where('propertyId', '==', propertyId)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const deletePromises = querySnapshot.docs.map((document) => 
            deleteDoc(doc(db, 'savedProperties', document.id))
        );
        await Promise.all(deletePromises);
    }
  } catch (error) {
    console.error('Error unsaving property: ', error);
    throw new Error('Failed to unsave property');
  }
};

export const getSavedProperties = async (userId: string) => {
  try {
    const q = query(collection(db, 'savedProperties'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const savedProperties = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return savedProperties;
  } catch (error) {
    console.error('Error getting saved properties: ', error);
    throw new Error('Failed to get saved properties');
  }
};

export const getPropertiesByIds = async (propertyIds: string[]): Promise<Property[]> => {
    if (!propertyIds || propertyIds.length === 0) {
        return [];
    }
  try {
    const properties: Property[] = [];
    const q = query(collection(db, 'properties'), where(documentId(), 'in', propertyIds));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      properties.push({ id: doc.id, ...doc.data() } as Property);
    });
    return properties;
  } catch (error) {
    console.error('Error getting properties by ids: ', error);
    throw new Error('Failed to get properties by ids');
  }
};

export const isPropertySaved = async (userId: string, propertyId: string): Promise<boolean> => {
    try {
        const q = query(
            collection(db, 'savedProperties'),
            where('userId', '==', userId),
            where('propertyId', '==', propertyId)
        );
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    } catch (error) {
        console.error('Error checking if property is saved: ', error);
        return false;
    }
};

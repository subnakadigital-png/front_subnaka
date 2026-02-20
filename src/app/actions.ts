'use server';

import { revalidatePath } from 'next/cache';
import { firestore } from '@/lib/firebase-server';
import { Property, propertySchema } from '@/lib/types';
import { FieldValue } from 'firebase-admin/firestore';

export async function addProperty(formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries());
        
        delete (data as any).image;

        const validatedFields = propertySchema.safeParse({
            ...data,
            price: parseFloat(data.price as string),
            bedrooms: data.bedrooms ? parseInt(data.bedrooms as string, 10) : undefined,
            bathrooms: data.bathrooms ? parseInt(data.bathrooms as string, 10) : undefined,
            area: data.area ? parseFloat(data.area as string) : undefined,
            latitude: data.latitude ? parseFloat(data.latitude as string) : undefined,
            longitude: data.longitude ? parseFloat(data.longitude as string) : undefined,
            imageUrls: formData.getAll('imageUrls[]') as string[],
            userId: data.userId as string,
        });

        if (!validatedFields.success) {
            console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
            return {
                success: false,
                message: 'Invalid data format.',
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const { ...propertyData } = validatedFields.data;
        
        const docRef = firestore.collection('properties').doc();

        const newPropertyData = {
            ...propertyData,
            status: 'Pending',
            createdAt: FieldValue.serverTimestamp(),
        };
        
        await docRef.set(newPropertyData);

        revalidatePath('/dashboard');
        revalidatePath('/listings');

        const createdProperty: Property = {
             id: docRef.id, 
             ...validatedFields.data,
             status: 'Pending',
             createdAt: new Date()
        };

        return {
            success: true,
            property: createdProperty,
        };
    } catch (error) {
        console.error("Error adding property:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An unexpected error occurred.',
        };
    }
}

export async function updateProperty(propertyId: string, formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries());
        
        const imageUrls = formData.getAll('imageUrls[]').filter(url => typeof url === 'string') as string[];

        const validatedFields = propertySchema.partial().safeParse({
            ...data,
            price: data.price ? parseFloat(data.price as string) : undefined,
            bedrooms: data.bedrooms ? parseInt(data.bedrooms as string, 10) : undefined,
            bathrooms: data.bathrooms ? parseInt(data.bathrooms as string, 10) : undefined,
            area: data.area ? parseFloat(data.area as string) : undefined,
            latitude: data.latitude ? parseFloat(data.latitude as string) : undefined,
            longitude: data.longitude ? parseFloat(data.longitude as string) : undefined,
            imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
        });

        if (!validatedFields.success) {
            console.error('Validation errors:', validatedFields.error.flatten().fieldErrors);
            return {
                success: false,
                message: 'Invalid data format.',
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        const propertyRef = firestore.collection('properties').doc(propertyId);
        await propertyRef.update(validatedFields.data);

        revalidatePath('/dashboard');
        revalidatePath(`/listings/${propertyId}`);
        revalidatePath(`/listings`);

        return {
            success: true,
        };

    } catch (error) {
        console.error('Error updating property:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An unexpected error occurred.',
        };
    }
}

export async function deleteProperty(propertyId: string) {
    try {
        const propertyRef = firestore.collection('properties').doc(propertyId);
        await propertyRef.delete();

        revalidatePath('/dashboard');
        revalidatePath('/listings');

        return { success: true };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An unexpected error occurred.',
        };
    }
}

export async function approveProperty(propertyId: string) {
  try {
    const propertyRef = firestore.collection('properties').doc(propertyId);
    await propertyRef.update({ status: 'Active' });

    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred.',
    };
  }
}

import { z } from 'zod';

export const statusSchema = z.enum(['Pending', 'Active', 'Sold', 'Rented', 'Inactive']);

export const propertySchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  location: z.string().min(1, 'Location is required'),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  area: z.number().min(0).optional(),
  type: z.enum(['house', 'apartment', 'villa', 'office', 'land']),
  category: z.enum(['sale', 'rent']),
  status: statusSchema.optional(),
  imageUrls: z.array(z.string().url()).optional(),
  image: z.any().optional(),
  floor: z.string().optional(),
  propertyAge: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  createdAt: z.any().optional(),
});

export type Property = z.infer<typeof propertySchema>;
export type PropertyStatus = z.infer<typeof statusSchema>;

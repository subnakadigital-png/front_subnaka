export interface Property {
    id: string;
    title: string;
    description: string;
    type: 'sale' | 'rent';
    propertyType: 'house' | 'apartment' | 'land' | 'business';
    price: number;
    location: string;
    lat: number;
    lng: number;
    bedrooms: number;
    bathrooms: number;
    area: number;
    images: string[];
    amenities: string[];
    status: 'available' | 'sold' | 'rented';
    createdAt: any; // Firestore Timestamp
    updatedAt: any; // Firestore Timestamp
  }
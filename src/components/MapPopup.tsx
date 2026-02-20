import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, MapPin, Bed, Bath, Maximize, Calendar } from 'lucide-react';
import { Property } from '@/lib/types';

interface MapPopupProps {
    property: Property;
    onClose: () => void;
}

const MapPopup: React.FC<MapPopupProps> = ({ property, onClose }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (date: any) => {
        if (!date) return 'Recently';
        // Handle Firestore Timestamp or Date object
        const d = date.toDate ? date.toDate() : new Date(date);
        return new Intl.DateTimeFormat('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(d);
    };

    return (
        <div className="absolute top-4 right-4 z-50 w-[300px] bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="relative h-44 w-full">
                <Image
                    src={property.imageUrls?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'}
                    alt={property.title}
                    layout="fill"
                    objectFit="cover"
                />
                <div className="absolute top-3 left-3 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {property.type}
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="absolute top-3 right-3 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full transition shadow-sm backdrop-blur-sm"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{property.title}</h3>
                <div className="flex items-center text-gray-500 text-xs mb-3">
                    <MapPin size={12} className="mr-1" />
                    <span className="truncate">{property.location}</span>
                </div>

                <div className="text-2xl font-bold text-yellow-500 mb-4">
                    {formatPrice(property.price)}
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-b border-gray-100 py-3 mb-3">
                    <div className="flex flex-col items-center text-center">
                        <Bed size={16} className="text-gray-400 mb-0.5" />
                        <span className="text-xs font-bold text-gray-800">{property.bedrooms || '-'}</span>
                    </div>
                    <div className="flex flex-col items-center text-center border-l border-gray-100">
                        <Bath size={16} className="text-gray-400 mb-0.5" />
                        <span className="text-xs font-bold text-gray-800">{property.bathrooms || '-'}</span>
                    </div>
                    <div className="flex flex-col items-center text-center border-l border-gray-100">
                        <Maximize size={16} className="text-gray-400 mb-0.5" />
                        <span className="text-xs font-bold text-gray-800">{property.area ? `${property.area} m²` : '-'}</span>
                    </div>
                </div>

                <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                    {property.description}
                </p>

                <div className="text-[10px] text-gray-400 mb-3 flex items-center gap-1">
                    <Calendar size={10} />
                    Posted on {formatDate(property.createdAt)}
                </div>

                <Link
                    href={`/listings/${property.id}`}
                    className="block w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2.5 rounded-lg text-sm transition shadow-md text-center"
                >
                    see details
                </Link>
            </div>
        </div>
    );
};

export default MapPopup;

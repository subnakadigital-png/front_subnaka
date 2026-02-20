'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Share2, Bed, Bath, Car, Ruler, MapPin, Clock, Heart } from 'lucide-react';
import { Property } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';
import { togglePropertyId, isPropertySaved } from '@/lib/localStorage';
import ShareModal from '@/components/ShareModal';

interface PropertyCardProps {
  property: Property;
  onViewProperty?: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onViewProperty }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (property.id) {
      setIsSaved(isPropertySaved(property.id));
    }
  }, [property.id]);

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShareModalOpen(true);
  };

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!property.id) return;
    
    const saved = togglePropertyId(property.id);
    setIsSaved(saved);
  };
  
  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewProperty) {
        onViewProperty(property);
    }
  };

  const getImageUrl = () => {
    const images = property.imageUrls || [];
    if (images.length > 0) return images[0];
    if (property.image) return property.image;
    return '/placeholder.png';
  };
  const displayImage = getImageUrl();
  const isPlaceholder = displayImage === '/placeholder.png' || displayImage.includes('placeholder');
    
  const propertyName = property.title || 'Unnamed Property';
  const propertyLocation = property.location || 'Location not specified';
  const formattedDate = formatRelativeTime(property.createdAt);
  const price = typeof property.price === 'number' ? property.price : parseInt(String(property.price).replace(/[^0-9]/g, ''), 10);

  return (
    <>
      <div onClick={handleViewClick} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group font-sans cursor-pointer">
        <div className="relative h-56">
          <Image 
            src={displayImage} 
            alt={`Image of ${propertyName}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized={isPlaceholder}
            onError={(e) => {
              e.currentTarget.src = '/placeholder.png';
            }}
          />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${property.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-xs font-bold text-gray-800">{property.status || 'Unknown'}</span>
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-2">
              <button onClick={handleShareClick} className="bg-white/80 backdrop-blur-sm p-2.5 rounded-full hover:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
                  <Share2 size={18} className="text-gray-700" />
              </button>
              <button onClick={handleSaveClick} className="bg-white/80 backdrop-blur-sm p-2.5 rounded-full hover:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
                  <Heart size={18} className={`transition-colors ${isSaved ? 'text-red-500 fill-current' : 'text-gray-700'}`} />
              </button>
          </div>
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start">
              <div className="flex-auto min-w-0 pr-2">
                  <h3 className="text-xl font-bold text-gray-800 truncate" title={propertyName}>{propertyName}</h3>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                    <MapPin size={14} className="text-gray-400" /> 
                    {propertyLocation}
                  </p>
              </div>
              <div className="text-right shrink-0 ml-4">
                  <p className="text-xs text-gray-400">Price (Kip)</p>
                  <p className="text-xl font-bold text-yellow-600 mt-1">₭{price.toLocaleString()}</p>
              </div>
          </div>
          
          {(property.bedrooms || property.bathrooms || property.area || (property as any).parking) &&
            <div className="flex items-center space-x-5 text-sm text-gray-600 mt-4 pt-4 border-t border-gray-100">
              {property.bedrooms && (
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-gray-400"/>
                  <span className="font-medium">{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms && (
                 <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-gray-400"/>
                  <span className="font-medium">{property.bathrooms}</span>
                </div>
              )}
              {property.area && (
                 <div className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-gray-400"/>
                  <span className="font-medium">{property.area} m²</span>
                </div>
              )}
              {(property as any).parking && (
                 <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-gray-400"/>
                  <span className="font-medium">{(property as any).parking}</span>
                </div>
              )}
            </div>
          }

          <div className="flex justify-between items-center text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100">
             <span className="font-bold text-gray-700 capitalize">{property.type || 'For Sale'}</span>
             <span className="flex items-center gap-1.5 font-medium text-gray-600">
               <Clock size={14} /> 
               {formattedDate}
             </span>
          </div>
        </div>
      </div>
      {isShareModalOpen && (
        <ShareModal 
          property={property} 
          onClose={() => setIsShareModalOpen(false)} 
        />
      )}
    </>
  );
};

export default PropertyCard;

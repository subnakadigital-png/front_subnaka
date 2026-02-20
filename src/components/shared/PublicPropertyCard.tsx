'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Bed, Bath, MapPin, Clock, Share2, Heart, Building, Home } from 'lucide-react';
import { FaRulerCombined } from 'react-icons/fa';
import { Property } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

interface PublicPropertyCardProps {
  prop: Property;
}

const PublicPropertyCard: React.FC<PublicPropertyCardProps> = ({ prop }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/listings/${prop.id}`);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/property/${prop.id}`);
    alert('Property link copied to clipboard!');
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert('Property saved to wishlist!');
  };

  const getImageUrl = () => {
    const images = prop.images || prop.imageUrls || [];
    if (images.length > 0) return images[0];
    if (prop.image) return prop.image;
    return '/placeholder.png';
  };
  const displayImage = getImageUrl();
  const isPlaceholder = displayImage === '/placeholder.png';

  const saleType = prop.category; // 'sale' or 'rent'
  const propertyCategory = prop.type; // 'House', 'Apartment', etc.

  const timeAgo = (date: any) => {
    if (!date) return 'a while ago';
    const dateObj = date.seconds ? new Date(date.seconds * 1000) : new Date(date);
    if (isNaN(dateObj.getTime())) return 'a while ago';

    const seconds = Math.floor((new Date().getTime() - dateObj.getTime()) / 1000);
    if (seconds < 5) return 'Just now';
    let interval = seconds / 31536000; if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000; if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400; if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600; if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60; if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const CategoryIcon = propertyCategory === 'Apartment' ? Building : Home;

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-lg overflow-hidden w-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 cursor-pointer group"
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={displayImage}
          alt={prop.title || 'Property Image'}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          unoptimized={isPlaceholder}
          onError={(e) => {
            e.currentTarget.src = '/placeholder.png';
          }}
        />

        {/* Sale / Rent Badge */}
        <span
          className={`absolute top-6 left-6 font-bold capitalize px-3 py-1 rounded-md text-xs ${
            saleType === 'sale'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          For {saleType}
        </span>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleShare}
            className="bg-white/80 p-2.5 rounded-full backdrop-blur-sm hover:bg-white focus:outline-none shadow-md"
          >
            <Share2 size={16} className="text-gray-800" />
          </button>
          <button
            onClick={handleSave}
            className="bg-white/80 p-2.5 rounded-full backdrop-blur-sm hover:bg-white focus:outline-none shadow-md"
          >
            <Heart size={16} className="text-gray-800" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start gap-4">
          {/* Left Column */}
          <div className="flex-auto min-w-0">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
  {prop.title}
</h3>



            <p className="text-sm text-gray-500 flex items-center mt-1">
              <MapPin size={14} className="mr-1.5 shrink-0" />
              <span className="truncate">{prop.location}</span>
            </p>
          </div>

          {/* Right Column */}
          <div className="ml-4 shrink-0">
            <p className="text-sm text-gray-500">Price (Kip)</p>
            <p className="text-xl font-extrabold text-yellow-600">
              ₭{prop.price ? formatPrice(prop.price) : 'N/A'}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="flex justify-start items-center text-gray-700 my-5 pt-4 border-t border-gray-100 gap-x-5 gap-y-2 flex-wrap">
          <span className="flex items-center text-sm gap-2">
            <Bed size={16} /> {prop.bedrooms || 0}
          </span>
          <span className="flex items-center text-sm gap-2">
            <Bath size={16} /> {prop.bathrooms || 0}
          </span>
          <span className="flex items-center text-sm gap-2">
            <FaRulerCombined /> {prop.area ? `${prop.area} m²` : '0 m²'}
          </span>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
          <span className="flex items-center gap-2 font-medium">
            <CategoryIcon size={16} />
            {propertyCategory
  ? propertyCategory.charAt(0).toUpperCase() +
    propertyCategory.slice(1).toLowerCase()
  : ''}

            </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {timeAgo(prop.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
  
};

export default PublicPropertyCard;
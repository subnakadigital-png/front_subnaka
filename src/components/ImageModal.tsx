import React, { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Share2, Heart } from 'lucide-react';

interface ImageModalProps {
  imageUrls: string[];
  onClose: () => void;
  propertyTitle: string;
  handleShareClick: () => void;
  handleSaveClick: () => void;
  isSaved: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({ 
  imageUrls, 
  onClose,
  propertyTitle,
  handleShareClick,
  handleSaveClick,
  isSaved
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const totalImages = imageUrls.length;

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? totalImages - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === totalImages - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-5xl h-5/6 bg-black rounded-lg shadow-xl flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal content
      >
        {/* Modal Header */}
        <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent">
          {/* Top Left Controls: Title */}
          <h2 className="text-white text-xl font-bold">{propertyTitle}</h2>

          {/* Top Right Controls: "Show all photos" button and Close Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={onClose} // This button will act as "Show all photos" and also close the modal to show the property page with all photos.
              className="px-4 py-2 bg-gray-800/70 text-white rounded-full hover:bg-gray-700/70 transition flex items-center gap-2"
              aria-label="Show all photos"
            >
              <span className="text-sm font-semibold">{currentImageIndex + 1} / {totalImages}</span>
              {/* You might consider adding a different icon here if "Show all photos" implies a grid view */}
              <X className="w-5 h-5" /> 
            </button>
            {/* The previous close button is now part of the "Show all photos" button functionality as per interpretation */}
          </div>
        </div>

        {/* Share and Save buttons above the image */}
        <div className="absolute top-20 right-4 z-10 flex gap-2">
            <button 
              onClick={handleShareClick} 
              className="bg-white/90 text-gray-800 px-3 py-2 rounded-lg font-semibold flex items-center gap-1 hover:bg-gray-200 transition"
              aria-label="Share property"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button 
              onClick={handleSaveClick} 
              className="bg-white/90 text-gray-800 px-3 py-2 rounded-lg font-semibold flex items-center gap-1 hover:bg-gray-200 transition"
              aria-label={isSaved ? "Unsave property" : "Save property"}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'text-red-500' : 'text-gray-800'}`} fill={isSaved ? 'currentColor' : 'none'} />
              <span>Save</span>
            </button>
        </div>


        {/* Navigation Buttons */}
        {totalImages > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-gray-800/70 text-white rounded-full hover:bg-gray-700/70 transition"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-gray-800/70 text-white rounded-full hover:bg-gray-700/70 transition"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Current Image Display */}
        <div className="relative w-full h-full flex items-center justify-center">
          {imageUrls.length > 0 ? (
            <>
              <Image
                src={imageUrls[currentImageIndex]}
                alt={`Property image ${currentImageIndex + 1}`}
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
              {/* Watermark Overlay */}
              <Image
                src="/watermark.png"
                alt="Watermark"
                width={150}
                height={50}
                className="absolute opacity-70 bottom-4 right-4 z-10 pointer-events-none"
              />
            </>
          ) : (
            <p className="text-white text-lg">No images available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
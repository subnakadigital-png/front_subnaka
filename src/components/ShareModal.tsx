'use client';

import React from 'react';
import { Property } from '@/lib/types';
import { X, Copy, MessageCircle, Send } from 'lucide-react'; // Assuming you have these icons

interface ShareModalProps {
  property: Property;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ property, onClose }) => {
  const propertyUrl = `${window.location.origin}/listings/${property.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(propertyUrl);
    // Add some feedback to the user, like a toast message
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Share Property</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-2">Share this link via</p>
          <div className="flex justify-around items-center my-4">
            <a href={`https://wa.me/?text=${encodeURIComponent(propertyUrl)}`} target="_blank" rel="noopener noreferrer" className="text-center">
              <MessageCircle size={32} />
              <span className="block text-xs mt-1">WhatsApp</span>
            </a>
            <a href={`https://t.me/share/url?url=${encodeURIComponent(propertyUrl)}`} target="_blank" rel="noopener noreferrer" className="text-center">
              <Send size={32} />
              <span className="block text-xs mt-1">Telegram</span>
            </a>
            <a href={`https://line.me/R/msg/text/?${encodeURIComponent(propertyUrl)}`} target="_blank" rel="noopener noreferrer" className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M22.33 0H1.67C.75 0 0 .75 0 1.67v20.66C0 23.25.75 24 1.67 24h20.66c.92 0 1.67-.75 1.67-1.67V1.67C24 .75 23.25 0 22.33 0zM8.33 18.33h-2.5V9.17h2.5v9.16zm-1.25-10c-.97 0-1.75-.78-1.75-1.75s.78-1.75 1.75-1.75s1.75.78 1.75 1.75s-.78 1.75-1.75 1.75zm12.5 10h-2.5v-4.58c0-.75-.03-1.5-.97-1.5s-1.12.75-1.12 1.5v4.58h-2.5V9.17h2.5v1.25h.03c.38-.72 1.3-1.47 2.6-1.47c2.78 0 3.29 1.83 3.29 4.21v5.42z"/></svg>
              <span className="block text-xs mt-1">LINE</span>
            </a>
          </div>
          <div className="flex items-center border rounded-md p-2">
            <input type="text" readOnly value={propertyUrl} className="text-sm grow bg-transparent focus:outline-none"/>
            <button onClick={copyLink} className="ml-2 text-sm font-semibold text-blue-600 hover:text-blue-800">
              <Copy size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

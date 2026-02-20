'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getSavedPropertyIds,
  togglePropertyId,
  isPropertySaved as checkIsPropertySaved,
} from '@/lib/localStorage';

export function useWishlist() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = getSavedPropertyIds();
    setSavedIds(saved);
    setIsHydrated(true);
  }, []);

  // Toggle a property in the wishlist
  const toggleWishlist = useCallback((propertyId: string) => {
    const isNowSaved = togglePropertyId(propertyId);
    setSavedIds(prev => {
      if (isNowSaved) {
        return [...prev, propertyId];
      } else {
        return prev.filter(id => id !== propertyId);
      }
    });
    return isNowSaved;
  }, []);

  // Check if a property is saved
  const isSaved = useCallback((propertyId: string) => {
    return savedIds.includes(propertyId);
  }, [savedIds]);

  // Remove a property from wishlist
  const removeFromWishlist = useCallback((propertyId: string) => {
    const saved = getSavedPropertyIds();
    const filtered = saved.filter(id => id !== propertyId);
    localStorage.setItem('subnaka_saved_properties', JSON.stringify(filtered));
    setSavedIds(filtered);
  }, []);

  return {
    savedIds,
    toggleWishlist,
    isSaved,
    removeFromWishlist,
    isHydrated,
  };
}

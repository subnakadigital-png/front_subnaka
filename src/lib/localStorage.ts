const SAVED_PROPERTIES_KEY = 'subnaka_saved_properties';

function dispatchWishlistUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  }
}

export function getSavedPropertyIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(SAVED_PROPERTIES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error reading saved properties from localStorage:', error);
    return [];
  }
}

export function savePropertyId(propertyId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const saved = getSavedPropertyIds();
    if (!saved.includes(propertyId)) {
      saved.push(propertyId);
      localStorage.setItem(SAVED_PROPERTIES_KEY, JSON.stringify(saved));
      dispatchWishlistUpdate();
    }
  } catch (error) {
    console.error('Error saving property to localStorage:', error);
  }
}

export function removePropertyId(propertyId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const saved = getSavedPropertyIds();
    const filtered = saved.filter(id => id !== propertyId);
    localStorage.setItem(SAVED_PROPERTIES_KEY, JSON.stringify(filtered));
    dispatchWishlistUpdate();
  } catch (error) {
    console.error('Error removing property from localStorage:', error);
  }
}

export function togglePropertyId(propertyId: string): boolean {
  if (typeof window === 'undefined') return false;
  const saved = getSavedPropertyIds();
  if (saved.includes(propertyId)) {
    removePropertyId(propertyId);
    return false;
  } else {
    savePropertyId(propertyId);
    return true;
  }
}

export function isPropertySaved(propertyId: string): boolean {
  const saved = getSavedPropertyIds();
  return saved.includes(propertyId);
}

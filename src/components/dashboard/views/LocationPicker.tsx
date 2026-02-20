'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1rem',
};

const defaultCenter = {
  lat: 17.974855, // Default to Laos
  lng: 102.630867,
};

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  locked?: boolean; // Add a 'locked' prop to disable interactions
}

export default function LocationPicker({ 
  onLocationSelect, 
  center = defaultCenter, 
  zoom = 6, 
  locked = false 
}: LocationPickerProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [markerPosition, setMarkerPosition] = useState(center);

  useEffect(() => {
    setMarkerPosition(center);
  }, [center]);

  const onMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (locked || !event.latLng) return;

    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setMarkerPosition(newPosition);
    onLocationSelect(newPosition);
  }, [onLocationSelect, locked]);

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: true,
    fullscreenControl: true,
    gestureHandling: 'auto',
    draggable: true,
    clickableIcons: true
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onClick={onMapClick}
      options={mapOptions}
    >
      <Marker position={markerPosition} />
    </GoogleMap>
  ) : <div style={containerStyle} className="flex items-center justify-center bg-slate-200 rounded-2xl"><p>Loading Map...</p></div>;
}

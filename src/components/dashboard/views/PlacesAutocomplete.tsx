'use client';

import React, { useEffect } from 'react';
import usePlacesAutocomplete, {
  getGeocode, 
  getLatLng,
} from 'use-places-autocomplete';
import { MapPin } from 'lucide-react';

interface PlacesAutocompleteProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialValue?: string;
}

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({ onLocationSelect, initialValue }) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'la' }, // Restrict to Laos
    },
    debounce: 300,
  });

  useEffect(() => {
    if (ready && initialValue) {
      setValue(initialValue, false);
    }
  }, [ready, initialValue, setValue]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSelect = ({ description }: { description: string }) => () => {
    setValue(description, false);
    clearSuggestions();

    getGeocode({ address: description })
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        onLocationSelect({ lat, lng, address: description });
      })
      .catch((error) => {
        console.log('😱 Error: ', error);
      });
  };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={handleSelect(suggestion)}
          className="p-3 hover:bg-yellow-500/10 cursor-pointer rounded-lg text-sm flex items-center gap-3"
        >
          <MapPin className="w-4 h-4 text-slate-400" />
          <span>
            <strong>{main_text}</strong> <small className="text-slate-500">{secondary_text}</small>
          </span>
        </li>
      );
    });

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search for a location in Laos"
          className="w-full p-3 pl-12 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-yellow-500/50 outline-none transition"
        />
      </div>
      {status === 'OK' && <ul className="absolute z-10 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-lg p-2 space-y-1">{renderSuggestions()}</ul>}
    </div>
  );
};

export default PlacesAutocomplete;

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload as UploadIcon, XCircle, MapPin, Loader2 } from 'lucide-react';
import { updateProperty as updatePropertyAction } from '@/app/actions';
import { Property } from '@/lib/types';
import { storage } from '@/lib/firebase-client';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import LocationPicker from '../views/LocationPicker';
import { laosLocations } from '@/lib/laos-locations';
import imageCompression from 'browser-image-compression';
import { useAuth } from '@/context/AuthContext';

interface EditPropertyFormProps {
  property: Property;
  onUpdate: (property: Property) => void;
  onCancel: () => void;
}

interface UploadableFile {
  file: File;
  preview: string;
  progress: number;
  id: string;
}

export default function EditPropertyForm({ property, onUpdate, onCancel }: EditPropertyFormProps) {
  const [formData, setFormData] = useState<Property>(property);
  const [imagePreviews, setImagePreviews] = useState<string[]>(property.imageUrls || []);
  const [newImageFiles, setNewImageFiles] = useState<UploadableFile[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Update Property');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>({ lat: property.latitude, lng: property.longitude });
  const [selectedProvince, setSelectedProvince] = useState(property.location.split(', ')[1] || '');
  const [selectedDistrict, setSelectedDistrict] = useState(property.location.split(', ')[0] || '');
  const [mapCenter, setMapCenter] = useState({ lat: property.latitude, lng: property.longitude });
  const [mapZoom, setMapZoom] = useState(13);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { user } = useAuth();

  const provinceData = laosLocations.provinces.find(p => p.name === selectedProvince);
  const districts = provinceData ? provinceData.districts : [];

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'la' },
    },
    debounce: 300,
  });

  const handleLocationChange = useCallback(async (address: string, zoom: number) => {
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setMapCenter({ lat, lng });
      setMapZoom(zoom);
      setLocation({ lat, lng });
    } catch (error) {
      console.error('Error getting geocode:', error);
    }
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).map(file => ({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        id: `${file.name}-${file.lastModified}`
      }));

      if ((imagePreviews.length + newFiles.length) > 10) {
        alert('You can upload a maximum of 10 images.');
        return;
      }
      setNewImageFiles(prev => [...prev, ...newFiles]);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file.file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number, preview: string) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    if (!preview.startsWith('http')) {
      setNewImageFiles(prev => prev.filter(file => file.preview !== preview));
    } else {
        setFormData(prev => ({
            ...prev,
            imageUrls: prev.imageUrls?.filter(url => url !== preview) || [],
        }));
    }
  };

  const handleLocationSelect = (selectedLocation: { lat: number; lng: number }) => {
    setLocation(selectedLocation);
  };

  const handlePlaceSelect = ({ description }: { description: string }) => {
    setValue(description, false);
    clearSuggestions();
    handleLocationChange(description, 15);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvince = e.target.value;
    setSelectedProvince(newProvince);
    setSelectedDistrict(''); // Reset district when province changes
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUpdating(true);
    setErrorMessage(null);

    if (!user) {
      setErrorMessage("You must be logged in to update a property.");
      setIsUpdating(false);
      return;
    }

    if (!formRef.current) {
      setErrorMessage("Form not found. Please try again.");
      setIsUpdating(false);
      return;
    }

    const currentFormData = new FormData(formRef.current);
    
    if (!selectedProvince || !selectedDistrict) {
      setErrorMessage("Please select a province and district.");
      setIsUpdating(false);
      return;
    }

    if (!location) {
      setErrorMessage("Please select a location on the map.");
      setIsUpdating(false);
      return;
    }

    try {
      setStatusMessage('Compressing images...');
      const compressionOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFiles = await Promise.all(
        newImageFiles.map(imageFile => imageCompression(imageFile.file, compressionOptions))
      );

      setStatusMessage('Uploading new images...');
      const newImageUrls = await Promise.all(
        compressedFiles.map((file, index) => {
          const imageRef = ref(storage, `property-images/${user.uid}/${property.id}/${file.name}`);
          const uploadTask = uploadBytesResumable(imageRef, file);

          return new Promise<string>((resolve, reject) => {
            uploadTask.on('state_changed',
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setNewImageFiles(prevFiles => {
                  const newFiles = [...prevFiles];
                  const fileIndex = newFiles.findIndex(f => f.file.name === file.name);
                  if(fileIndex !== -1) newFiles[fileIndex].progress = progress;
                  return newFiles;
                });
              },
              (error) => {
                console.error("Upload failed for:", file.name, error);
                reject(error);
              },
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadURL);
              }
            );
          });
        })
      );

      setStatusMessage('Finalizing...');

      currentFormData.set('latitude', location.lat.toString());
      currentFormData.set('longitude', location.lng.toString());
      currentFormData.set('location', `${selectedDistrict}, ${selectedProvince}`);
      
      const existingImageUrls = formData.imageUrls || [];
      const allImageUrls = [...existingImageUrls, ...newImageUrls];
      allImageUrls.forEach(url => currentFormData.append('imageUrls[]', url));

      const result = await updatePropertyAction(property.id, currentFormData);

      if (result.success) {
        const updatedProperty = { 
            ...property, 
            ...Object.fromEntries(currentFormData.entries()),
            latitude: location.lat,
            longitude: location.lng,
            imageUrls: allImageUrls,
            location: `${selectedDistrict}, ${selectedProvince}`
        } as unknown as Property;

        onUpdate(updatedProperty);
      } else {
        setErrorMessage(result.message || "An unexpected error occurred.");
        setIsUpdating(false);
        setStatusMessage('Update Property');
      }
    } catch (error) {
      console.error("Error during property update:", error);
      const message = error instanceof Error ? error.message : "An unexpected error occurred.";
      setErrorMessage(message);
      setIsUpdating(false);
      setStatusMessage('Update Property');
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 text-black">
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {errorMessage}</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Property Title</label>
              <input id="title" name="title" type="text" defaultValue={formData.title} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <textarea id="description" name="description" rows={5} defaultValue={formData.description} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required></textarea>
            </div>
            <div className="space-y-2">
                <label htmlFor="province" className="text-sm font-medium">Province</label>
                <select id="province" name="province" value={selectedProvince} onChange={handleProvinceChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value="">Select Province</option>
                    {laosLocations.provinces.map(p => (
                        <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                </select>
            </div>
            <div className="space-y-2">
                <label htmlFor="district" className="text-sm font-medium">District</label>
                <select id="district" name="district" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={!selectedProvince}>
                    <option value="">Select District</option>
                    {districts.map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <select id="category" name="category" defaultValue={formData.category} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">Property Type</label>
              <select id="type" name="type" defaultValue={formData.type} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="office">Office</option>
                <option value="land">Land</option>
              </select>
            </div>
             <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <select id="status" name="status" defaultValue={formData.status} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium">Price (Kip)</label>
              <input id="price" name="price" type="number" defaultValue={formData.price} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="area" className="text-sm font-medium">Area (sqft)</label>
              <input id="area" name="area" type="number" defaultValue={formData.area} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <label htmlFor="bedrooms" className="text-sm font-medium">Bedrooms</label>
              <input id="bedrooms" name="bedrooms" type="number" defaultValue={formData.bedrooms} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <label htmlFor="bathrooms" className="text-sm font-medium">Bathrooms</label>
              <input id="bathrooms" name="bathrooms" type="number" defaultValue={formData.bathrooms} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
             <div className="space-y-2">
                <label htmlFor="floor" className="text-sm font-medium">Floor</label>
                <input id="floor" name="floor" type="text" defaultValue={formData.floor} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
                <label htmlFor="propertyAge" className="text-sm font-medium">Property Age</label>
                <input id="propertyAge" name="propertyAge" type="text" defaultValue={formData.propertyAge} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <label className="text-sm font-medium">Search for a location</label>
            <div className="relative">
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={!ready || isUpdating}
                placeholder="Start typing an address..."
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {status === 'OK' && (
                <div className="absolute z-10 w-full bg-white border border-slate-300 rounded-lg mt-1 shadow-lg">
                  {data.map((suggestion) => {
                    const { place_id, description } = suggestion;
                    return (
                      <div key={place_id} onClick={() => handlePlaceSelect(suggestion)} className="p-4 hover:bg-slate-100 cursor-pointer flex items-center">
                        <MapPin className="w-5 h-5 mr-3 text-slate-400" />
                        <span>{description}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 space-y-4 h-96">
            <label className="text-sm font-medium">Or pin location on map</label>
            <LocationPicker onLocationSelect={handleLocationSelect} center={mapCenter} zoom={mapZoom} />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium mb-2 block">Property Images (up to 10)</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={preview} className="relative aspect-square">
                <Image src={preview} alt={`Preview ${index + 1}`} fill className="object-cover rounded-lg" />
                {!isUpdating && (
                    <button type="button" onClick={() => removeImage(index, preview)} className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition">
                    <XCircle className="w-5 h-5 text-red-500" />
                  </button>
                )}
              </div>
            ))}
            {newImageFiles.map((imageFile) => (
              <div key={imageFile.id} className="relative aspect-square">
                  <Image src={imageFile.preview} alt={`Preview`} fill className="object-cover rounded-lg" />
                  {isUpdating && imageFile.progress < 100 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                        <div className="w-full bg-slate-200 rounded-full h-2.5 mx-2">
                            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${imageFile.progress}%` }}></div>
                        </div>
                    </div>
                  )}
              </div>
            ))}
            {imagePreviews.length < 10 && !isUpdating && (
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 flex items-center justify-center aspect-square">
                <input type="file" ref={fileInputRef} className="hidden" id="image-upload-edit" onChange={handleImageChange} accept="image/*" multiple disabled={isUpdating} />
                <label htmlFor="image-upload-edit" className="cursor-pointer flex flex-col items-center justify-center text-slate-500">
                  <UploadIcon className="w-8 h-8 text-slate-400" />
                  <span className="text-xs mt-1">Add images</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
        <button type="button" onClick={onCancel} disabled={isUpdating} className="px-6 py-2 rounded-lg bg-slate-100 font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button type="submit" disabled={isUpdating} className="px-8 py-3 w-48 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-shadow shadow-lg disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center">
          {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUpdating ? statusMessage : 'Update Property'}
        </button>
      </div>
    </form>
  );
}

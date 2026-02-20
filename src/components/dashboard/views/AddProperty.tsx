'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft as ChevronLeftIcon, Upload as UploadIcon, XCircle, CheckCircle, MapPin, Loader2 } from 'lucide-react';
import { addProperty as addPropertyAction } from '@/app/actions';
import { Property } from '@/lib/types';
import { storage, db } from '@/lib/firebase-client';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, collection } from 'firebase/firestore';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import LocationPicker from './LocationPicker';
import { laosLocations } from '@/lib/laos-locations';
import imageCompression from 'browser-image-compression';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

interface AddPropertyViewProps {
  setActiveTab: (tab: string) => void;
  onPropertyAdded?: (property: Property) => void;
}

interface UploadableFile {
  file: File;
  preview: string;
  progress: number;
  id: string;
}

export default function AddPropertyView({ setActiveTab, onPropertyAdded }: AddPropertyViewProps) {
  const [imageFiles, setImageFiles] = useState<UploadableFile[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Save and Publish');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: 17.974855, lng: 102.630867 });
  const [mapZoom, setMapZoom] = useState(6);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { user } = useAuth(); // Get the authenticated user

  const districts = React.useMemo(() => {
    if (!selectedProvince) return [];
    const province = laosLocations.provinces.find(p => p.name === selectedProvince);
    return province ? province.districts : [];
  }, [selectedProvince]);

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

      if (imageFiles.length + newFiles.length > 10) {
        alert('You can upload a maximum of 10 images.');
        return;
      }
      setImageFiles(prev => [...prev, ...newFiles]);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const removeImage = (id: string) => {
    setImageFiles(prev => prev.filter(file => file.id !== id));
  };

  const resetForm = () => {
    setImageFiles([]);
    setErrorMessage(null);
    setIsSuccess(false);
    setLocation(null);
    setSelectedProvince('');
    setSelectedDistrict('');
    setMapCenter({ lat: 17.974855, lng: 102.630867 });
    setMapZoom(6);
    setValue('');
    formRef.current?.reset();
    setIsSaving(false);
    setStatusMessage('Save and Publish');
  };

  const handleLocationSelect = (selectedLocation: { lat: number; lng: number }) => {
    setLocation(selectedLocation);
  };

  const handlePlaceSelect = ({ description }: { description: string }) => {
    setValue(description, false);
    clearSuggestions();
    handleLocationChange(description, 15);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProvince = e.target.value;
    setSelectedProvince(newProvince);
    setSelectedDistrict('');
    if (newProvince) {
      handleLocationChange(newProvince, 10);
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDistrict = e.target.value;
    setSelectedDistrict(newDistrict);
    if (newDistrict) {
      handleLocationChange(`${newDistrict}, ${selectedProvince}`, 13);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    if (!user) {
        setErrorMessage("You must be logged in to add a property.");
        setIsSaving(false);
        return;
    }

    if (!formRef.current) {
        setErrorMessage("Form not found. Please try again.");
        setIsSaving(false);
        return;
    }
    
    const formData = new FormData(formRef.current);
    const province = formData.get('province') as string;
    const district = formData.get('district') as string;
    
    if (!province || !district) {
        setErrorMessage("Please select a province and district.");
        setIsSaving(false);
        return;
    }

    if (!location) {
        setErrorMessage("Please select a location on the map.");
        setIsSaving(false);
        return;
    }

    if (imageFiles.length === 0) {
        setErrorMessage("Please upload at least one image.");
        setIsSaving(false);
        return;
    }

    try {
        const newPropertyRef = doc(collection(db, 'properties'));
        const propertyId = newPropertyRef.id;

        setStatusMessage('Compressing images...');
        const compressionOptions = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFiles = await Promise.all(
          imageFiles.map(imageFile => imageCompression(imageFile.file, compressionOptions))
        );

        setStatusMessage('Uploading images...');
        const imageUrls = await Promise.all(
            compressedFiles.map((file, index) => {
                const imageRef = ref(storage, `property-images/${user.uid}/${propertyId}/${file.name}`);
                const uploadTask = uploadBytesResumable(imageRef, file);

                return new Promise<string>((resolve, reject) => {
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setImageFiles(prevFiles => {
                                const newFiles = [...prevFiles];
                                newFiles[index].progress = progress;
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
        formData.append('id', propertyId);
        formData.append('userId', user.uid);
        formData.append('latitude', location.lat.toString());
        formData.append('longitude', location.lng.toString());
        formData.append('location', `${district}, ${province}`);
        imageUrls.forEach(url => formData.append('imageUrls[]', url));
        
        const result = await addPropertyAction(formData);

        if (result.success && result.property) {
          if(onPropertyAdded) onPropertyAdded(result.property);
          setIsSuccess(true);
        } else {
          setErrorMessage(result.message || "An unexpected error occurred.");
          setIsSaving(false);
          setStatusMessage('Save and Publish');
        }
    } catch (error) {
        console.error("Error during property submission:", error);
        const message = error instanceof Error ? error.message : "An unexpected error occurred.";
        setErrorMessage(message);
        setIsSaving(false);
        setStatusMessage('Save and Publish');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex items-center mb-6">
          <button onClick={() => setActiveTab('properties')} className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            <ChevronLeftIcon className="w-5 h-5 mr-1" />
            Back to Dashboard
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Add New Property</h1>
          <p className="text-slate-500 mt-2">Fill out the details below and select the location on the map.</p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full">
          {isSuccess ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-in fade-in zoom-in-50 duration-500" />
              <h2 className="text-2xl font-bold text-slate-800">Property Added Successfully!</h2>
              <p className="text-slate-500 mt-2 mb-8">Your new property has been added to the listings.</p>
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <button onClick={resetForm} className="px-6 py-3 rounded-lg text-white font-semibold bg-blue-500 hover:bg-blue-600 transition-shadow shadow-lg">
                  Add Another Property
                </button>
                <button onClick={() => setActiveTab('properties')} className="px-6 py-3 rounded-lg text-slate-700 font-semibold bg-slate-100 hover:bg-slate-200 transition-shadow">
                  View All Properties
                </button>
              </div>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                  <strong className="font-bold">Error:</strong>
                  <span className="block sm:inline"> {errorMessage}</span>
                </div>
              )}
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <label htmlFor="title" className="text-sm font-medium text-slate-600">Property Title</label>
                        <input id="title" name="title" type="text" placeholder="e.g., Modern Apartment in Downtown" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" required />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label htmlFor="description" className="text-sm font-medium text-slate-600">Description</label>
                        <textarea id="description" name="description" rows={5} placeholder="Provide a detailed description of the property..." className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" required></textarea>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="province" className="text-sm font-medium text-slate-600">Province</label>
                        <select id="province" name="province" value={selectedProvince} onChange={handleProvinceChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" required>
                          <option value="">Select Province</option>
                          {laosLocations.provinces.map(p => (
                            <option key={p.name} value={p.name}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="district" className="text-sm font-medium text-slate-600">District</label>
                        <select id="district" name="district" value={selectedDistrict} onChange={handleDistrictChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" required disabled={!selectedProvince}>
                          <option value="">Select District</option>
                          {districts.map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="category" className="text-sm font-medium text-slate-600">Category</label>
                        <select id="category" name="category" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" required>
                          <option value="">Select Category</option>
                          <option value="sale">For Sale</option>
                          <option value="rent">For Rent</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="type" className="text-sm font-medium text-slate-600">Property Type</label>
                        <select id="type" name="type" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" required>
                          <option value="">Select Type</option>
                          <option value="house">House</option>
                          <option value="apartment">Apartment</option>
                          <option value="villa">Villa</option>
                          <option value="office">Office</option>
                          <option value="land">Land</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="price" className="text-sm font-medium text-slate-600">Price (Kip)</label>
                        <input id="price" name="price" type="number" placeholder="e.g., 1000000000" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" required />
                      </div>
                       <div className="space-y-2">
                        <label htmlFor="area" className="text-sm font-medium text-slate-600">Area (sqft)</label>
                        <input id="area" name="area" type="number" placeholder="e.g., 1200" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="bedrooms" className="text-sm font-medium text-slate-600">Bedrooms</label>
                        <input id="bedrooms" name="bedrooms" type="number" placeholder="e.g., 3" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="bathrooms" className="text-sm font-medium text-slate-600">Bathrooms</label>
                        <input id="bathrooms" name="bathrooms" type="number" placeholder="e.g., 2" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="floor" className="text-sm font-medium text-slate-600">Floor</label>
                        <input id="floor" name="floor" type="text" placeholder="e.g., 5th Floor" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" />
                      </div>
                       <div className="space-y-2">
                        <label htmlFor="propertyAge" className="text-sm font-medium text-slate-600">Property Age</label>
                        <input id="propertyAge" name="propertyAge" type="text" placeholder="e.g., 5 Years" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900" />
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                        <label className="text-sm font-medium text-slate-600">Search for a location</label>
                        <div className="relative">
                            <input
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                disabled={!ready || isSaving}
                                placeholder="Start typing an address..."
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                            />
                            {status === 'OK' && (
                                <div className="absolute z-10 w-full bg-white border border-slate-300 rounded-lg mt-1 shadow-lg">
                                {data.map((suggestion) => {
                                    const { place_id, description } = suggestion;
                                    return (
                                    <div key={place_id} onClick={() => handlePlaceSelect(suggestion)} className="p-4 hover:bg-slate-100 cursor-pointer flex items-center">
                                        <MapPin className="w-5 h-5 mr-3 text-slate-400" />
                                        <span className="text-slate-800">{description}</span>
                                    </div>
                                    );
                                })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-4 h-96">
                      <label className="text-sm font-medium text-slate-600">Or pin location on map</label>
                      <LocationPicker onLocationSelect={handleLocationSelect} center={mapCenter} zoom={mapZoom} />
                    </div>
                  </div>

                  <div className="space-y-4">
                      <label className="text-sm font-medium text-slate-600 mb-2 block">Property Images (up to 10)</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-4">
                          {imageFiles.map((imageFile) => (
                              <div key={imageFile.id} className="relative aspect-square">
                                  <Image src={imageFile.preview} alt={`Preview`} layout="fill" className="object-cover rounded-lg" />
                                  {isSaving && imageFile.progress < 100 && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                        <div className="w-full bg-slate-200 rounded-full h-2.5 mx-2">
                                            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${imageFile.progress}%` }}></div>
                                        </div>
                                    </div>
                                  )}
                                  {!isSaving && (
                                    <button type="button" onClick={() => removeImage(imageFile.id)} className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition">
                                        <XCircle className="w-5 h-5 text-red-500" />
                                    </button>
                                  )}
                              </div>
                          ))}
                          {imageFiles.length < 10 && !isSaving && (
                              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 flex items-center justify-center aspect-square">
                                  <input type="file" name="image" ref={fileInputRef} className="hidden" id="image-upload" onChange={handleImageChange} accept="image/*" multiple disabled={isSaving}/>
                                  <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center text-slate-500">
                                      <UploadIcon className="w-8 h-8 text-slate-400" />
                                      <span className="text-xs mt-1">Add images</span>
                                  </label>
                              </div>
                          )}
                      </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-6 border-t border-slate-200">
                  <button type="submit" disabled={isSaving} className="px-8 py-3 w-48 rounded-lg text-white font-semibold bg-yellow-500 hover:bg-yellow-600 transition-shadow shadow-lg disabled:bg-yellow-400 disabled:cursor-not-allowed flex items-center justify-center">
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    {isSaving ? statusMessage : 'Save and Publish'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

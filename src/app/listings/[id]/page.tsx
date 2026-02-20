'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import { Property } from '@/lib/types';
import { formatRelativeTime, formatPrice } from '@/lib/utils';
import {
    ChevronLeft, MapPin, Home, Bed, Bath, Ruler, Clock, Phone, Loader, Share2, Heart, Building, Camera, ExternalLink, Send
} from 'lucide-react';
import LocationPicker from '@/components/dashboard/views/LocationPicker';
import PublicPropertyCard from '@/components/shared/PublicPropertyCard';
import ImageModal from '@/components/ImageModal';
import { togglePropertyId, isPropertySaved } from '@/lib/localStorage';

export default function PropertyDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [property, setProperty] = useState<Property | null>(null);
    const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [showAllPhotosModal, setShowAllPhotosModal] = useState(false); // State for modal

    useEffect(() => {
        if (id) {
            // Check if property is saved in localStorage
            setIsSaved(isPropertySaved(id as string));
            
            const fetchProperty = async () => {
                setLoading(true);
                try {
                    const docRef = doc(db, 'properties', id as string);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data.status !== 'Active') {
                            setError('This property is currently not available.');
                            setLoading(false);
                            return;
                        }
                        const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString();
                        const fetchedProperty: Property = {
                            id: docSnap.id,
                            title: data.title || '',
                            description: data.description || '',
                            price: data.price || 0,
                            location: data.location || '',
                            imageUrls: data.imageUrls || [],
                            image: data.image || '',
                            status: data.status || 'Inactive',
                            createdAt: createdAt,
                            bedrooms: data.bedrooms || 0,
                            bathrooms: data.bathrooms || 0,
                            area: data.area || 0,
                            type: data.type || '',
                            category: data.category || '',
                            features: data.features || [],
                            agent: data.agent,
                            latitude: data.latitude,
                            longitude: data.longitude,
                            floor: data.floor || 'N/A', // Added floor
                            propertyAge: data.propertyAge || 'N/A', // Added propertyAge
                        };
                        setProperty(fetchedProperty);

                        const q = query(
                            collection(db, 'properties'),
                            where('status', '==', 'Active'),
                            where('type', '==', fetchedProperty.type),
                            limit(4)
                        );
                        const querySnapshot = await getDocs(q);
                        const related: Property[] = [];
                        querySnapshot.forEach((doc) => {
                            if (doc.id !== id) {
                                const docData = doc.data();
                                const created = docData.createdAt?.toDate ? docData.createdAt.toDate().toISOString() : new Date().toISOString();
                                related.push({
                                    id: doc.id,
                                    title: docData.title || '',
                                    description: docData.description || '',
                                    price: docData.price || 0,
                                    location: docData.location || '',
                                    imageUrls: docData.imageUrls || [],
                                    image: docData.image || '',
                                    status: docData.status || 'Inactive',
                                    createdAt: created,
                                    bedrooms: docData.bedrooms || 0,
                                    bathrooms: docData.bathrooms || 0,
                                    area: docData.area || 0,
                                    type: docData.type || '',
                                    category: docData.category || '',
                                    features: docData.features || [],
                                    agent: docData.agent,
                                    latitude: docData.latitude,
                                    longitude: docData.longitude,
                                    floor: docData.floor || 'N/A', // Added floor for related properties
                                    propertyAge: docData.propertyAge || 'N/A', // Added propertyAge for related properties
                                } as Property);
                            }
                        });
                        setRelatedProperties(related.slice(0, 3));

                    } else {
                        setError('Property not found.');
                    }
                } catch (err) {
                    setError('Failed to fetch property data.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchProperty();
        }
    }, [id]);

    const handleShareClick = () => {
        navigator.share({
            title: property?.title,
            text: `Check out this property: ${property?.title}`,
            url: window.location.href
        }).catch(err => console.error('Share failed:', err));
    };

    const handleShareLocation = () => {
        if (navigator.share && property) {
            navigator.share({
                title: `Location of ${property.title}`,
                text: `Here is the location of ${property.title}`,
                url: `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`
            }).catch(err => console.error('Share failed:', err));
        }
    }

    const handleSaveClick = () => {
        if (!property?.id) return;
        const saved = togglePropertyId(property.id);
        setIsSaved(saved);
    };

    const handleCloseModal = () => { // Function to close the modal
        setShowAllPhotosModal(false);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin text-yellow-500" size={48} /></div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    if (!property) {
        return <div className="flex justify-center items-center h-screen">Property not found.</div>;
    }

    const onBack = () => router.back();
    const onContact = () => alert('Contact functionality to be implemented!');
    const handleMapLocationSelect = () => { /* No-op */ };

    const imageCount = property.imageUrls?.length || 0;
    // Display up to 3 images in the main grid: 1 large, 2 small
    const galleryImages = property.imageUrls?.slice(0, 3) || [];

    return (
        <div className="animate-in fade-in duration-300 bg-gray-50 pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
                        <ChevronLeft className="w-5 h-5" />
                        Back to Listings
                    </button>
                    {/* Share/Save buttons moved below */}
                </div>

                {imageCount > 0 && (
                    <div className="relative grid grid-cols-1 md:grid-cols-3 gap-2.5 rounded-2xl overflow-hidden h-[500px] shadow-lg mb-12">
                        {/* Large main image on the left (col-span-2) */}
                        <div className="col-span-full md:col-span-2 row-span-2 relative group overflow-hidden rounded-bl-2xl rounded-tl-2xl">
                            <Image
                                src={galleryImages[0]}
                                alt={property.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20"></div>
                             {/* Watermark for the main image */}
                            <Image
                                src="/public/watermark.png" // Path to your watermark image
                                alt="Watermark"
                                width={100} // Adjust size as needed
                                height={100} // Adjust size as needed
                                className="absolute bottom-4 left-4 opacity-75 z-10" // Adjust position and opacity
                            />
                        </div>

                        {/* Two smaller images stacked on the right (col-span-1 each) */}
                        {galleryImages.slice(1, 3).map((url, index) => (
                            <div key={index} className={`col-span-full md:col-span-1 relative group overflow-hidden ${index === 0 ? 'rounded-tr-2xl' : ''} ${index === 1 ? 'rounded-br-2xl' : ''}`}>
                                <Image
                                    src={url}
                                    alt={`Property image ${index + 2}`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20"></div>
                                {/* Watermark for small images */}
                                <Image
                                    src="/public/watermark.png" // Path to your watermark image
                                    alt="Watermark"
                                    width={70} // Adjust size as needed
                                    height={70} // Adjust size as needed
                                    className="absolute bottom-2 left-2 opacity-75 z-10" // Adjust position and opacity
                                />
                                {/* "Show all photos" button on the last available slot (index 1 for slice(1,3)) */}
                                {index === 1 && imageCount > 3 && (
                                    <button
                                        onClick={() => setShowAllPhotosModal(true)} // Set state to true to open modal
                                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white font-bold text-3xl cursor-pointer hover:bg-black/60 transition-all duration-300"
                                    >
                                        <Camera className="w-8 h-8 mb-2" />
                                        <span>+{imageCount - 3}</span>
                                        <span className="text-base mt-1">Show all photos</span>
                                    </button>
                                )}
                            </div>
                        ))}
                         {/* If there are only 2 images, but more than 2 total, the button should appear on the second image directly */}
                        {imageCount === 2 && galleryImages.length === 2 && imageCount > 2 && (
                            <div className="col-span-full md:col-span-1 relative group overflow-hidden rounded-br-2xl">
                                <Image
                                    src={galleryImages[1]}
                                    alt={`Property image 2`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20"></div>
                                {/* Watermark */}
                                <Image
                                    src="/public/watermark.png" // Path to your watermark image
                                    alt="Watermark"
                                    width={70} // Adjust size as needed
                                    height={70} // Adjust size as needed
                                    className="absolute bottom-2 left-2 opacity-75 z-10" // Adjust position and opacity
                                />
                                <button
                                    onClick={() => setShowAllPhotosModal(true)} // Set state to true to open modal
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white font-bold text-3xl cursor-pointer hover:bg-black/60 transition-all duration-300"
                                >
                                    <Camera className="w-8 h-8 mb-2" />
                                    <span>+{imageCount - 2}</span>
                                    <span className="text-base mt-1">Show all photos</span>
                                </button>
                            </div>
                        )}
                        {/* Placeholder for the second small image if only one main image exists and total image count is >=2, and we need two small slots */}
                        {imageCount === 1 && property.imageUrls && property.imageUrls.length >= 2 && (
                            <div className="col-span-full md:col-span-1 relative flex items-center justify-center bg-gray-200 text-gray-500 overflow-hidden rounded-tr-2xl rounded-br-2xl">
                                <Camera className="w-8 h-8" />
                            </div>
                        )}
                        {/* Placeholder for both small images if only one main image exists and total image count is 1 */}
                         {imageCount === 1 && property.imageUrls && property.imageUrls.length === 1 && (
                            <>
                                <div className="col-span-full md:col-span-1 relative flex items-center justify-center bg-gray-200 text-gray-500 overflow-hidden rounded-tr-2xl">
                                    <Camera className="w-8 h-8" />
                                </div>
                                <div className="col-span-full md:col-span-1 relative flex items-center justify-center bg-gray-200 text-gray-500 overflow-hidden rounded-br-2xl">
                                    <Camera className="w-8 h-8" />
                                </div>
                            </>
                        )}
                         {/* If imageCount is 0, render placeholders for all three spots */}
                        {imageCount === 0 && (
                            <>
                                <div className="col-span-full md:col-span-2 row-span-2 relative flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg overflow-hidden">
                                    <Camera className="w-12 h-12" />
                                </div>
                                <div className="col-span-full md:col-span-1 relative flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg overflow-hidden">
                                    <Camera className="w-8 h-8" />
                                </div>
                                <div className="col-span-full md:col-span-1 relative flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg overflow-hidden">
                                    <Camera className="w-8 h-8" />
                                </div>
                            </>
                        )}
                    </div>
                )}


                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="w-full lg:w-2/3 space-y-12">
                        <div className="pb-6 border-b flex justify-between items-start"> {/* Added flex and justify-between */}
                            <div>
                                <span className="bg-[#CA8A04] text-white px-3 py-1 rounded-md text-sm font-bold uppercase tracking-wider mb-3 inline-block">For {property.category}</span>
                                <h1 className="text-3xl md:text-5xl font-bold mb-2 text-gray-900">{property.title}</h1>
                                <p className="text-lg text-gray-500 flex items-center gap-2"><MapPin className="w-5 h-5" /> {property.location}</p>
                            </div>
                            <div className="flex gap-3 z-10 -mt-2"> {/* Moved Share/Save buttons here */}
                                <button onClick={handleShareClick} className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-gray-100 transition">
                                    <Share2 className="w-5 h-5 text-gray-800" />
                                </button>
                                <button onClick={handleSaveClick} className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-gray-100 transition">
                                    <Heart className={`w-5 h-5 ${isSaved ? 'text-red-500' : 'text-gray-800'}`} fill={isSaved ? 'currentColor' : 'none'} />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3">
                                 <div className="bg-gray-100 p-2.5 rounded-lg"><Home className="w-6 h-6 text-gray-500" /></div>
                                 <div><p className="text-xs text-gray-400 uppercase font-bold">Type</p><p className="font-bold text-gray-900 capitalize">{property.type}</p></div>
                            </div>
                             <div className="flex items-center gap-3">
                                 <div className="bg-gray-100 p-2.5 rounded-lg"><Bed className="w-6 h-6 text-gray-500" /></div>
                                 <div><p className="text-xs text-gray-400 uppercase font-bold">Bedrooms</p><p className="font-bold text-gray-900">{property.bedrooms}</p></div>
                            </div>
                            <div className="flex items-center gap-3">
                                 <div className="bg-gray-100 p-2.5 rounded-lg"><Bath className="w-6 h-6 text-gray-500" /></div>
                                 <div><p className="text-xs text-gray-400 uppercase font-bold">Bathrooms</p><p className="font-bold text-gray-900">{property.bathrooms}</p></div>
                            </div>
                             <div className="flex items-center gap-3">
                                 <div className="bg-gray-100 p-2.5 rounded-lg"><Ruler className="w-6 h-6 text-gray-500" /></div>
                                 <div><p className="text-xs text-gray-400 uppercase font-bold">Area</p><p className="font-bold text-gray-900">{property.area} m²</p></div>
                            </div>
                             <div className="flex items-center gap-3">
                                <div className="bg-gray-100 p-2.5 rounded-lg"><Building className="w-6 h-6 text-gray-500" /></div>
                                <div><p className="text-xs text-gray-400 uppercase font-bold">Floors</p><p className="font-bold text-gray-900">{property.floor || 'N/A'}</p></div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-100 p-2.5 rounded-lg"><Clock className="w-6 h-6 text-gray-500" /></div>
                                <div><p className="text-xs text-gray-400 uppercase font-bold">Age</p><p className="font-bold text-gray-900">{property.propertyAge || 'N/A'}</p></div>
                            </div>
                             <div className="flex items-center gap-3">
                                 <div className="bg-gray-100 p-2.5 rounded-lg"><Clock className="w-6 h-6 text-gray-500" /></div>
                                 <div><p className="text-xs text-gray-400 uppercase font-bold">Listed</p><p className="font-bold text-gray-900">{formatRelativeTime(property.createdAt)}</p></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Description</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description || 'This is a premium property located in the heart of the city. It offers excellent amenities and easy access to major landmarks. Perfect for residential or investment purposes.'}</p>
                        </div>
                         <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Location</h3>
                            <div className="h-96 rounded-2xl overflow-hidden border shadow-sm">
                                {property.latitude !== undefined && property.longitude !== undefined ? (
                                    <LocationPicker
                                        onLocationSelect={handleMapLocationSelect}
                                        center={{ lat: property.latitude, lng: property.longitude }}
                                        zoom={15}
                                        locked={true}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-500">
                                        Map location not available.
                                    </div>
                                )}
                            </div>
                            {property.latitude !== undefined && property.longitude !== undefined && (
                                <div className="mt-4 flex justify-start gap-4">
                                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`} target="_blank" rel="noopener noreferrer" className="bg-[#CA8A04] text-white font-bold border border-gray-200 py-2 px-4 rounded-lg shadow-sm hover:bg-gray-50 transition flex items-center gap-2">
                                        <ExternalLink className="w-5 h-5" />
                                        Get Directions
                                    </a>
                                    <button onClick={handleShareLocation} className="bg-[#CA8A04] text-white font-bold border border-gray-200 py-2 px-4 rounded-lg shadow-sm hover:bg-gray-50 transition flex items-center gap-2">
                                        <Send className="w-5 h-5" />
                                        Share Location
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                            <div className="text-left mb-6">
                                <p className="text-sm opacity-80 uppercase tracking-widest font-bold mb-1">Price</p>
                                <p className="text-4xl font-bold text-[#CA8A04]">₭{formatPrice(parseInt(property.price))}</p>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Interested?</h3>
                            <button onClick={onContact} className="w-full bg-[#CA8A04] text-white font-bold py-3 rounded-xl hover:bg-[#b47a03] transition shadow-md mb-3">Send Inquiry</button>
                            <button onClick={onContact} className="w-full border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2"><Phone className="w-4 h-4" /> Call Agent</button>
                        </div>
                    </div>
                </div>

                {relatedProperties.length > 0 && (
                    <div className="mt-16 pt-12 border-t">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Properties</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedProperties.map(p => <PublicPropertyCard key={p.id} prop={p} />)}
                        </div>
                    </div>
                )}
            </div>

            {/* Photo Gallery Modal */}
            {showAllPhotosModal && property.imageUrls && (
                <ImageModal
                    imageUrls={property.imageUrls}
                    onClose={handleCloseModal}
                    propertyTitle={property.title}
                    handleShareClick={handleShareClick}
                    handleSaveClick={handleSaveClick}
                    isSaved={isSaved}
                />
            )}
        </div>
    )
}
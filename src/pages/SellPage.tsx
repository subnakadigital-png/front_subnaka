'use client';

import React from 'react';
import Image from 'next/image';
import { Upload, Tag, Home, MapPin, Type, Phone, Mail } from 'lucide-react';

export default function SellPage() {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative h-[400px] w-full flex items-center justify-center text-white bg-gray-900">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
            alt="House keys"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Sell or Rent Your Property</h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">Join thousands of sellers and landlords in Laos and list your property for FREE.</p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 md:py-24 bg-gray-50 relative z-10 rounded-t-3xl -mt-8">
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Property Details</h2>
            <p className="text-gray-600 mb-8">Please provide the following information to list your property.</p>
            
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Listing Type */}
              <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">I want to...</label>
                  <div className="flex gap-4">
                      <label className="flex items-center gap-2 p-4 border border-gray-200 rounded-lg cursor-pointer flex-1 hover:bg-gray-50 has-checked:bg-[#CA8A04]/10 has-checked:border-[#CA8A04]">
                          <input type="radio" name="listingType" value="sell" className="form-radio text-[#CA8A04] focus:ring-[#CA8A04]" defaultChecked />
                          <span className="font-medium text-gray-800">Sell Property</span>
                      </label>
                      <label className="flex items-center gap-2 p-4 border border-gray-200 rounded-lg cursor-pointer flex-1 hover:bg-gray-50 has-checked:bg-[#CA8A04]/10 has-checked:border-[#CA8A04]">
                          <input type="radio" name="listingType" value="rent" className="form-radio text-[#CA8A04] focus:ring-[#CA8A04]" />
                          <span className="font-medium text-gray-800">Rent Property</span>
                      </label>
                  </div>
              </div>

              {/* Property Title */}
              <div className="md:col-span-2 relative">
                  <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">Property Title</label>
                  <div className="absolute left-3 top-[42px] text-gray-400"><Tag className="w-5 h-5" /></div>
                  <input type="text" id="title" placeholder="e.g., Modern 3-Bedroom Villa" className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#CA8A04] transition" />
              </div>

              {/* Property Type */}
              <div className="relative">
                  <label htmlFor="type" className="block text-sm font-bold text-gray-700 mb-2">Property Type</label>
                   <div className="absolute left-3 top-[42px] text-gray-400"><Home className="w-5 h-5" /></div>
                  <select id="type" className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#CA8A04] transition appearance-none">
                      <option>House</option>
                      <option>Condo / Apartment</option>
                      <option>Land</option>
                      <option>Commercial</option>
                  </select>
              </div>

              {/* Location */}
              <div className="relative">
                  <label htmlFor="location" className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                  <div className="absolute left-3 top-[42px] text-gray-400"><MapPin className="w-5 h-5" /></div>
                  <select id="location" className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#CA8A04] transition appearance-none">
                      <option>Vientiane</option>
                      <option>Luang Prabang</option>
                      <option>Pakse</option>
                  </select>
              </div>

              {/* Price */}
              <div className="relative">
                  <label htmlFor="price" className="block text-sm font-bold text-gray-700 mb-2">Price (LAK)</label>
                  <div className="absolute left-3 top-[42px] text-gray-400"><Tag className="w-5 h-5" /></div>
                  <input type="number" id="price" placeholder="e.g., 1,500,000,000" className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#CA8A04] transition" />
              </div>

               {/* Bedrooms */}
              <div className="relative">
                  <label htmlFor="bedrooms" className="block text-sm font-bold text-gray-700 mb-2">Bedrooms</label>
                  <div className="absolute left-3 top-[42px] text-gray-400"><Type className="w-5 h-5" /></div>
                  <input type="number" id="bedrooms" placeholder="e.g., 3" className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#CA8A04] transition" />
              </div>

              {/* Photo Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Property Photos</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#CA8A04] hover:bg-gray-50 transition">
                  <Upload className="mx-auto w-12 h-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Drag & drop or <span className="font-bold text-[#CA8A04]">click to upload</span></p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>

              <hr className="md:col-span-2 my-4" />

              <h3 className="text-xl font-bold text-gray-900 md:col-span-2">Your Contact Information</h3>
              
              {/* Name */}
              <div className="md:col-span-2 relative">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input type="text" id="name" placeholder="Your Name" className="w-full pl-4 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#CA8A04] transition" />
              </div>

              {/* Phone */}
              <div className="relative">
                  <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                   <div className="absolute left-3 top-[42px] text-gray-400"><Phone className="w-5 h-5" /></div>
                  <input type="tel" id="phone" placeholder="+856 20..." className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#CA8A04] transition" />
              </div>

              {/* Email */}
              <div className="relative">
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                   <div className="absolute left-3 top-[42px] text-gray-400"><Mail className="w-5 h-5" /></div>
                  <input type="email" id="email" placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#CA8A04] transition" />
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 mt-6">
                  <button type="submit" className="w-full bg-[#CA8A04] hover:bg-[#b47a03] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition transform hover:scale-105">
                      Submit Property
                  </button>
              </div>

            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

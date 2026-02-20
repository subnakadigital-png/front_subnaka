'use client';

import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer({ navigateTo }: { navigateTo: (page: string) => void }) {
  return (
    <footer className="bg-black text-gray-400 pt-20 pb-10 mt-auto rounded-t-4xl hidden md:block">
       <div className="max-w-[95%] w-full mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-10">
          
          <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2 cursor-pointer mb-4">
                <Image src="/logo new.png" alt="Subnaka Logo" width={140} height={40} />
              </Link>
              <p className="text-sm leading-relaxed max-w-sm">Your trusted partner in finding the perfect property in Laos. We offer a wide range of services to make your real estate journey seamless.</p>
          </div>

          <div>
              <h4 className="text-white font-bold mb-4 text-base">Properties</h4>
              <ul className="space-y-3 text-sm">
                  <li><Link href="/listings" className="hover:text-yellow-500 transition">For Sale</Link></li>
                  <li><Link href="/listings" className="hover:text-yellow-500 transition">For Rent</Link></li>
                  <li><Link href="/listings" className="hover:text-yellow-500 transition">New Developments</Link></li>
                  <li><Link href="/sell" className="hover:text-yellow-500 transition">Sell Your Property</Link></li>
              </ul>
          </div>

          <div>
              <h4 className="text-white font-bold mb-4 text-base">Services</h4>
              <ul className="space-y-3 text-sm">
                  <li><Link href="/services?service=construction" className="hover:text-yellow-500 transition">Construction</Link></li>
                  <li><Link href="/services?service=legal" className="hover:text-yellow-500 transition">Legal Agreements</Link></li>
                  <li><Link href="/services?service=consultation" className="hover:text-yellow-500 transition">Consultation</Link></li>
              </ul>
          </div>

          <div>
              <h4 className="text-white font-bold mb-4 text-base">Connect</h4>
                <div className="flex items-center gap-3">
                    <a href="https://www.facebook.com/profile.php?id=61585238661826&sk=about" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-gray-800 rounded-full text-gray-400 hover:bg-[#CA8A04] hover:text-white transition-colors duration-300">
                        <Facebook className="w-5 h-5" />
                    </a>
                    <a href="https://www.instagram.com/subnaka.la/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center bg-gray-800 rounded-full text-gray-400 hover:bg-[#CA8A04] hover:text-white transition-colors duration-300">
                        <Instagram className="w-5 h-5" />
                    </a>
                </div>
          </div>
      </div>

      <div className="max-w-[95%] w-full mx-auto px-4 border-t border-gray-800/50 pt-8 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
          <p className="text-sm mb-4 sm:mb-0">&copy; 2025 Subnaka Development. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/privacy-policy" className="hover:text-yellow-500 transition">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-yellow-500 transition">Terms of Service</Link>
          </div>
      </div>
    </footer>
  );
}

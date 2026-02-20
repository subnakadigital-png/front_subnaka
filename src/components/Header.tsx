'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, User, PlusCircle, Heart, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase-client';
import { getSavedPropertyIds } from '@/lib/localStorage';

export default function Header({
  setShowLogin,
}: {
  setShowLogin: (show: boolean) => void;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [isLangMenuOpen, setLangMenuOpen] = useState(false); // State สำหรับเมนูภาษา
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [selectedLang, setSelectedLang] = useState('en'); // ภาษาที่เลือก
  const { user, loading } = useAuth();

  const pathname = usePathname();
  const router = useRouter();

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'la', name: 'Lao', flag: '🇱🇦' },
    { code: 'th', name: 'Thai', flag: '🇹🇭' },
    { code: 'cn', name: 'Chinese', flag: '🇨🇳' },
  ];

  const currentLang = languages.find(l => l.code === selectedLang) || languages[0];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateWishlistCount = () => {
      const savedIds = getSavedPropertyIds();
      setWishlistCount(savedIds.length);
    };
    
    // Initial count
    updateWishlistCount();
    
    // Listen for storage changes (in case user saves from another tab)
    window.addEventListener('storage', updateWishlistCount);
    
    // Custom event for same-tab updates
    window.addEventListener('wishlistUpdated', updateWishlistCount);
    
    return () => {
      window.removeEventListener('storage', updateWishlistCount);
      window.removeEventListener('wishlistUpdated', updateWishlistCount);
    };
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setUserMenuOpen(false);
    router.push('/');
  };

  const navigateToService = (service: string) => {
    router.push(`/services?service=${service}`);
    setServicesMenuOpen(false);
  };

  const headerClasses = `fixed w-full z-30 transition-all duration-300 ${isScrolled || pathname !== '/' ? 'bg-black/90 backdrop-blur-sm shadow-md' : 'bg-transparent'}`;

  return (
    <header className={headerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <div className="shrink-0">
          <Link href="/" className="cursor-pointer">
            <Image src="/logo new.png" alt="Subnaka Logo" width={120} height={30} className="object-contain" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6 font-medium text-white text-sm">
          <Link href="/" className={`hover:text-yellow-500 transition ${pathname === '/' ? 'text-yellow-500 font-bold' : ''}`}>Home</Link>
          <Link href="/listings" className={`hover:text-yellow-500 transition ${pathname === '/listings' ? 'text-yellow-500 font-bold' : ''}`}>Properties</Link>
          
          <div className="relative" onMouseEnter={() => setServicesMenuOpen(true)} onMouseLeave={() => setServicesMenuOpen(false)}>
            <button className={`flex items-center gap-1 hover:text-yellow-500 transition ${pathname === '/services' ? 'text-yellow-500 font-bold' : ''}`}>
              Services <ChevronDown size={14} />
            </button>
            {isServicesMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <button onClick={() => navigateToService('construction')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition">Construction</button>
                <button onClick={() => navigateToService('legal')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition">Legal Agreements</button>
                <button onClick={() => navigateToService('consultation')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition">Consultation</button>
              </div>
            )}
          </div>

          <Link href="/about" className={`hover:text-yellow-500 transition ${pathname === '/about' ? 'text-yellow-500 font-bold' : ''}`}>About</Link>
          <Link href="/contact" className={`hover:text-yellow-500 transition ${pathname === '/contact' ? 'text-yellow-500 font-bold' : ''}`}>Contact</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          

          <Link href="/contact" className="flex items-center gap-1.5 sm:gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-[10px] sm:text-xs transition shadow-lg shadow-yellow-500/20">
            <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="inline">Sell Property</span>
          </Link>

                {/* --- เพิ่มส่วนปุ่มเปลี่ยนภาษาตรงนี้ --- */}
                <div 
            className="relative" 
            onMouseEnter={() => setLangMenuOpen(true)} 
            onMouseLeave={() => setLangMenuOpen(false)}
          >
            <button className="flex items-center gap-1.5 text-white bg-white/10 hover:bg-white/20 px-2 sm:px-3 py-1.5 rounded-full border border-white/20 transition text-xs sm:text-sm">
              <span className="text-base sm:text-lg leading-none">{currentLang.flag}</span>
              <span className="hidden sm:inline uppercase font-bold tracking-wider">{currentLang.code}</span>
              <ChevronDown size={12} className={`transition-transform duration-200 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangMenuOpen && (
              <div className="absolute top-full right-0 mt-1 w-36 bg-white rounded-lg shadow-xl py-1 z-50 overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition ${
                      selectedLang === lang.code 
                      ? 'bg-yellow-50 text-yellow-600 font-bold' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* ---------------------------------- */}

          <Link href="/account/saved-properties" className="relative hidden md:flex items-center gap-2 transition text-white hover:text-yellow-500">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <div className="absolute -top-1 -right-2 bg-yellow-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold border border-black">{wishlistCount}</div>
            )}
          </Link>

          {!loading && (
            user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!isUserMenuOpen)} className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden focus:outline-none border-2 border-white/20 hover:border-yellow-500 transition">
                  {user.photoURL ? <Image src={user.photoURL} alt="User Avatar" width={32} height={32} /> : <User size={18} className="text-white" />}
                </button>
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-tight">Account</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user.displayName || 'User'}</p>
                    </div>
                    <Link href="/account/saved-properties" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition">Saved Properties</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition font-medium">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)} className="w-8 h-8 bg-white/10 text-white border border-white/20 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:border-yellow-500 transition shadow-sm group">
                <User size={18} className="group-hover:scale-110 transition-transform" />
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
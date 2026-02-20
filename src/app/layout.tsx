'use client';
import React, { useState } from 'react';
import { Inter, Noto_Sans_Lao } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { AuthProvider } from "@/context/AuthContext";
import { PropertiesProvider } from "@/app/context/PropertiesContext";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNavigation from "@/components/BottomNavigation";
import SlideMenu from "@/components/SlideMenu";
import { usePathname, useRouter } from 'next/navigation';
import LoginModal from '@/components/LoginModal';
import { getSavedPropertyIds } from '@/lib/localStorage';

const inter = Inter({ subsets: ["latin"] });
const notoSansLao = Noto_Sans_Lao({ subsets: ["lao"], weight: ["400", "700"] });

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  const [activePage, setActivePage] = React.useState('home');
  const [showLogin, setShowLogin] = React.useState(false);
  const [isSlideMenuOpen, setIsSlideMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isDashboardPage = pathname?.startsWith('/dashboard') ?? false;

  const navigateTo = (page: string) => {
    setActivePage(page);
    const pathMap: Record<string, string> = {
      'home': '/',
      'listings': '/listings',
      'saved': '/account/saved-properties',
      'services': '/services',
      'menu': '#',
      'saved-search': '/account/saved-searches',
      'contacted': '/account/contacted',
      'seen': '/account/seen-properties',
      'recent-searches': '/account/recent-searches',
      'post-property': '/dashboard/properties/add',
      'smart-deals': '/listings?smart-deals=true',
      'sell-rent': '/dashboard/properties/add',
      'zero-brokerage': '/listings?zero-brokerage=true',
    };
    const path = pathMap[page] || `/${page}`;
    if (path !== '#') {
      router.push(path);
    }
  };

  const handleMenuClick = () => {
    setIsSlideMenuOpen(true);
  };

  const wishlistCount = typeof window !== 'undefined' ? getSavedPropertyIds().length : 0;

  return (
    <html lang="en">
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${inter.className} ${notoSansLao.className}`}>
        <PropertiesProvider>
          <AuthProvider>
            {showLogin && <LoginModal setShowLogin={setShowLogin} />}
            {!isDashboardPage && <Header setShowLogin={setShowLogin} />}
            <main className={!isDashboardPage ? "pt-0" : ""}>
              {children}
            </main>
            {!isDashboardPage && <Footer navigateTo={navigateTo} />}
            
            {/* Mobile Bottom Navigation */}
            {!isDashboardPage && (
              <BottomNavigation
                activePage={activePage}
                navigateTo={navigateTo}
                onMenuClick={handleMenuClick}
                wishlistCount={wishlistCount}
              />
            )}
            
            {/* Mobile Slide Menu */}
            <SlideMenu
              isOpen={isSlideMenuOpen}
              onClose={() => setIsSlideMenuOpen(false)}
              navigateTo={navigateTo}
            />
          </AuthProvider>
        </PropertiesProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

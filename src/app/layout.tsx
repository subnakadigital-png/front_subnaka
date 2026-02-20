'use client';
import React from 'react';
import { Inter, Noto_Sans_Lao } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { AuthProvider } from "@/context/AuthContext";
import { PropertiesProvider } from "@/app/context/PropertiesContext";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from 'next/navigation';
import LoginModal from '@/components/LoginModal';

const inter = Inter({ subsets: ["latin"] });
const notoSansLao = Noto_Sans_Lao({ subsets: ["lao"], weight: ["400", "700"] });

export default function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  const [activePage, setActivePage] = React.useState('home');
  const [showLogin, setShowLogin] = React.useState(false);
  const pathname = usePathname();
  const isDashboardPage = pathname?.startsWith('/dashboard') ?? false;

  const navigateTo = (page: string) => {
    setActivePage(page);
  };

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
            {!isDashboardPage && <Header
              setShowLogin={setShowLogin}
            />}
            <main className={!isDashboardPage ? "pt-0" : ""}>
              {children}
            </main>
            {!isDashboardPage && <Footer navigateTo={navigateTo} />}
          </AuthProvider>
        </PropertiesProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

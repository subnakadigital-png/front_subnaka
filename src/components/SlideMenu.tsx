'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  X, 
  UserCircle2, 
  CheckCircle, 
  Heart, 
  Eye, 
  Phone, 
  History,
  Gem,
  Bookmark,
  Link,
  ChevronRight, 
  ChevronDown, 
  ChevronUp,
  Tags,
  Home,
  FileText,
  Building,
  Search,
  Wrench,
  Newspaper,
  Shield,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';

const ActivityButton = ({ icon: Icon, label, count, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 text-center flex-1">
    <div className="relative">
      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-inner">
        <Icon className="text-yellow-500" size={24} />
      </div>
    </div>
    <p className="text-xs text-gray-700 font-medium px-1">{label}</p>
    <p className="text-sm font-bold text-yellow-600">{count}</p>
  </button>
);

const QuickLink = ({ icon: Icon, label, isFree, onClick }: any) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 text-center w-24">
    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center relative shadow-sm">
      {isFree && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">FREE</span>}
      <Icon className="text-yellow-500" size={32} />
    </div>
    <p className="text-xs text-gray-700 font-medium text-center">{label}</p>
  </button>
);

const MenuItem = ({ icon: Icon, label, hasChevron, isCollapsible, isOpen, onClick }: any) => (
  <button onClick={onClick} className="w-full flex items-center justify-between text-left p-4 hover:bg-gray-50">
    <div className="flex items-center gap-4">
      <Icon className="text-gray-600" size={22} />
      <span className="font-medium text-gray-800">{label}</span>
    </div>
    {hasChevron && (isCollapsible ? (isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />) : <ChevronRight size={20} />)}
  </button>
);


export default function SlideMenu({ isOpen, onClose, navigateTo }: any) {
  const [openSection, setOpenSection] = useState<string | null>('quick-links');

  const handleToggle = (section: string) => {
    setOpenSection(prev => (prev === section ? null : section));
  };
  
  const handleNavigate = (page: string) => {
    navigateTo(page);
    onClose();
  };

  return (
    <>
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-gray-50 shadow-lg transform transition-transform z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto pb-20 md:hidden rounded-l-2xl`}>
        {/* Header */}
        <div className="p-4 bg-white">
          <div className="flex justify-end">
            <button onClick={onClose} className="p-2 -mt-2 -mr-2">
              <X size={24} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <UserCircle2 size={60} className="text-yellow-300 flex-shrink-0" />
            <div className="flex-grow">
              <p className="font-bold text-lg">Hello 👋</p>
              <div className="text-xs text-gray-500 flex items-center gap-1.5"><CheckCircle size={14} className="text-green-500" /> Easy Contact with sellers</div>
              <div className="text-xs text-gray-500 flex items-center gap-1.5"><CheckCircle size={14} className="text-green-500" /> Personalized experience</div>
            </div>
            <button onClick={() => handleNavigate('login')} className="ml-auto bg-yellow-400 text-black font-bold py-2 px-5 rounded-full self-start">Login</button>
          </div>
        </div>

        {/* My Activity */}
        <div className="p-4 mt-2">
          <h3 className="font-bold text-lg mb-3">My Activity</h3>
          <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
             <div className="flex justify-around">
                <ActivityButton onClick={() => handleNavigate('saved')} icon={Heart} label="Saved Properties" count="00" />
                <ActivityButton onClick={() => handleNavigate('seen')} icon={Eye} label="Seen Properties" count="00" />
                <ActivityButton onClick={() => handleNavigate('contacted')} icon={Phone} label="Contacted" count="00" />
                <ActivityButton onClick={() => handleNavigate('recent-searches')} icon={History} label="Recent Searches" count="00" />
             </div>
          </div>
        </div>
        
        {/* Sell/Rent card */}
        <div className="px-4 mt-4">
          <div className="bg-yellow-100 border border-yellow-200 rounded-2xl p-4 flex items-center gap-4">
              <Image src="https://img.icons8.com/plasticine/100/000000/property.png" alt="house" width={64} height={64} />
              <div>
                <h4 className="font-bold text-md">Looking to sell/rent your property?</h4>
                <button onClick={() => handleNavigate('post-property')} className="mt-2 bg-white font-bold py-2 px-4 rounded-full shadow-sm text-sm">Post property for FREE</button>
              </div>
          </div>
        </div>

        {/* Menu List */}
        <div className="mt-4 bg-white divide-y divide-gray-100">
           <MenuItem onClick={() => handleNavigate('zero-brokerage')} icon={Gem} label="Zero Brokerage Properties" hasChevron />
           <MenuItem onClick={() => handleNavigate('saved-search')} icon={Bookmark} label="Saved Search" hasChevron />

           {/* Quick Links */}
           <div>
            <MenuItem icon={Link} label="Quick Links" hasChevron isCollapsible isOpen={openSection === 'quick-links'} onClick={() => handleToggle('quick-links')} />
            {openSection === 'quick-links' && (
              <div className="bg-gray-50 py-4 px-2">
                <div className="flex justify-around">
                  <QuickLink onClick={() => handleNavigate('smart-deals')} icon={Tags} label="Smart Deals" />
                  <QuickLink onClick={() => handleNavigate('sell-rent')} icon={Home} label="Sell/Rent property" isFree />
                  <QuickLink onClick={() => handleNavigate('registry-records')} icon={FileText} label="Registry Records" />
                </div>
              </div>
            )}
           </div>

           <div>
             <MenuItem icon={Building} label="Residential Packages" hasChevron isCollapsible isOpen={openSection === 'packages'} onClick={() => handleToggle('packages')}/>
           </div>
           <div>
             <MenuItem icon={Search} label="Home Search" hasChevron isCollapsible isOpen={openSection === 'home-search'} onClick={() => handleToggle('home-search')}/>
           </div>
           <div>
             <MenuItem icon={Wrench} label="Tools & Advices" hasChevron isCollapsible isOpen={openSection === 'tools'} onClick={() => handleToggle('tools')}/>
           </div>
           
           <MenuItem onClick={() => handleNavigate('housing-news')} icon={Newspaper} label="Housing News" hasChevron />

           <div>
             <MenuItem icon={Shield} label="Housing Edge Services" hasChevron isCollapsible isOpen={openSection === 'edge'} onClick={() => handleToggle('edge')}/>
           </div>
           <MenuItem onClick={() => handleNavigate('report-fraud')} icon={AlertTriangle} label="Report a fraud" hasChevron />
        </div>

        {/* Help Centre */}
        <div className="p-4 mt-4">
            <button onClick={() => handleNavigate('help-centre')} className="w-full flex items-center justify-between text-left p-4 hover:bg-gray-200 bg-white rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                    <HelpCircle className="text-gray-600" size={24} />
                    <span className="font-medium text-gray-800">Help Centre</span>
                </div>
                <ChevronRight size={20} />
            </button>
        </div>

      </div>
    </>
  );
}

import { X } from 'lucide-react';

export default function MobileMenu({ isOpen, closeMenu, navigateTo }: any) {
  if (!isOpen) return null;

  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'listings', label: 'Properties' },
    { id: 'services', label: 'Services' },
    { id: 'news', label: 'News' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={closeMenu}>
      <div className="absolute top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-lg p-6 animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={closeMenu} className="p-2 -mr-2">
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col gap-4">
          {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => { navigateTo(item.id); closeMenu(); }}
              className="text-lg font-medium text-gray-700 hover:text-yellow-500 text-left py-2"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

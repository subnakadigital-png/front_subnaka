import { Home, Search, Heart, Briefcase, Menu } from 'lucide-react';

export default function BottomNavigation({ activePage, navigateTo, onMenuClick, wishlistCount }: any) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'listings', icon: Search, label: 'Search' },
    { id: 'saved', icon: Heart, label: 'Saved' },
    { id: 'services', icon: Briefcase, label: 'Services' },
    { id: 'menu', icon: Menu, label: 'Menu' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => (
          <button 
            key={item.id} 
            onClick={() => item.id === 'menu' ? onMenuClick() : navigateTo(item.id)}
            className={`relative flex flex-col items-center justify-center gap-1 transition-colors w-1/5 ${activePage === item.id ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'}`}>
            
            <div className="relative">
              <item.icon size={22} />
              {item.id === 'saved' && wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>

            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

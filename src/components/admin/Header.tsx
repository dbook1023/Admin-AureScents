import React from 'react';
import { Search, Bell, Menu, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSearch } from '@/context/SearchContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <header className="h-20 backdrop-blur-xl bg-[#0A192F]/40 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-30 transition-premium">
      <div className="flex items-center gap-6 flex-1">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden text-white hover:bg-white/10 rounded-xl">
          <Menu className="w-5 h-5" />
        </Button>
        <div className="relative max-w-xl w-full hidden md:block group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#C5A059] transition-premium" />
          <Input 
            type="search" 
            placeholder="Search entries, brands, notes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border-none text-white pl-12 h-11 w-full rounded-xl focus-visible:ring-1 focus-visible:ring-[#C5A059]/30 transition-premium font-medium text-xs placeholder:text-white/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Button variant="ghost" size="icon" className="text-white/30 hover:text-white hover:bg-white/5 rounded-xl h-10 w-10 transition-premium relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#C5A059] rounded-full border-2 border-[#0A192F] shadow-lg"></span>
        </Button>

        <div className="h-8 w-[px] bg-white/5 hidden sm:block"></div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 px-2 hover:bg-white/5 rounded-xl h-12 transition-premium group">
              {(() => {
                const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
                const displayName = adminUser.display_name || 'Admin';
                const role = adminUser.role || 'Controller';
                const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

                return (
                  <>
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-brand font-black text-white uppercase tracking-widest leading-none mb-1 group-hover:text-[#C5A059]">{displayName}</p>
                      <p className="text-[8px] text-white/30 font-bold tracking-widest uppercase opacity-60">{role}</p>
                    </div>
                    <Avatar className="h-9 w-9 border border-white/10 shadow-xl group-hover:scale-105 transition-premium">
                      <AvatarFallback className="bg-gradient-to-br from-[#112240] to-[#0A192F] text-white font-brand font-black text-[10px] uppercase">{initials || 'AD'}</AvatarFallback>
                    </Avatar>
                  </>
                );
              })()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 glass-card border-white/10 p-2 mt-2">
            <DropdownMenuLabel className="px-4 py-3 text-[10px] font-brand font-black uppercase tracking-[0.2em] text-[#C5A059]">Admin Identity</DropdownMenuLabel>
            <DropdownMenuSeparator className="mx-1 bg-white/5" />
            <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer rounded-xl px-4 py-3 text-xs font-bold transition-premium text-white/70" onClick={() => window.location.href = '/settings'}>
               <User className="w-4 h-4 mr-3 opacity-50" /> Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="mx-1 bg-white/5" />
            <DropdownMenuItem className="text-red-400 focus:bg-red-400/10 focus:text-red-400 cursor-pointer rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest" onClick={() => {
              localStorage.removeItem('isAuthenticated');
              window.location.href = '/login';
            }}>
              Logout Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Droplet, 
  UserCircle, 
  FileText, 
  Tags, 
  Settings, 
  Shield, 
  LogOut, 
  Sparkles,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import LogoutModal from '@/components/admin/LogoutModal';

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

const menuItems = [
  { icon: BarChart3, label: 'Analytics', path: '/dashboard' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: Droplet, label: 'Perfumes', path: '/perfumes' },
  { icon: UserCircle, label: 'Perfumers', path: '/perfumers' },
  { icon: FileText, label: 'Journals', path: '/journals' },
  { icon: Tags, label: 'Brand Library', path: '/brands' },
  { icon: Sparkles, label: 'Note Library', path: '/notes' },
];

const Sidebar: React.FC<SidebarProps> = ({ className, onClose }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const confirmLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/login';
  };

  return (
    <div className={cn("flex flex-col h-full glass-panel border-r border-white/5", className)}>
      {/* Branding Section */}
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-2 shadow-2xl border border-white/10">
            <img src="/ic_logo.png" alt="Aure" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-serif text-white tracking-[0.1em] uppercase font-medium">AURE</span>
            <span className="text-xl font-serif text-[#C5A059] tracking-[0.1em] uppercase font-black">SCENTS</span>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden text-white hover:bg-white/10 rounded-xl">
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-4 py-6">
        <div className="space-y-8">
          {/* Main Navigation */}
          <div className="space-y-1">
            <div className="px-4 mb-4 text-[10px] font-brand font-bold uppercase tracking-[0.5em] text-white/30">
              Main Management
            </div>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => cn(
                  "flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-premium group",
                  isActive 
                    ? "glass-button-active font-bold" 
                    : "glass-button-ghost"
                )}
              >
                <item.icon className={cn("w-4 h-4", "transition-colors")} />
                <span className="tracking-[0.2em] text-[10px] uppercase font-brand font-black">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Administration Section */}
          <div className="space-y-1">
            <div className="px-4 mb-4 text-[10px] font-brand font-bold uppercase tracking-[0.5em] text-white/30">
              Administration
            </div>
            <NavLink
              to="/admins"
              onClick={onClose}
              className={({ isActive }) => cn(
                "flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-premium group",
                isActive 
                    ? "glass-button-active font-bold" 
                    : "glass-button-ghost"
              )}
            >
              <Shield className="w-4 h-4" />
              <span className="tracking-[0.2em] text-[10px] uppercase font-brand font-black">Admin Users</span>
            </NavLink>
            <NavLink
              to="/settings"
              onClick={onClose}
              className={({ isActive }) => cn(
                "flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-premium group",
                isActive 
                    ? "glass-button-active font-bold" 
                    : "glass-button-ghost"
              )}
            >
              <Settings className="w-4 h-4" />
              <span className="tracking-[0.2em] text-[10px] uppercase font-brand font-black">Settings</span>
            </NavLink>
          </div>
        </div>
      </ScrollArea>

      {/* User Session Section */}
      <div className="p-4 mt-auto">
        {(() => {
          const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
          const displayName = adminUser.display_name || 'Admin';
          const role = adminUser.role || 'Institutional Lead';
          const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

          return (
            <div className="p-4 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl flex items-center gap-4 group transition-premium">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A059] to-[#8E733E] flex items-center justify-center text-[#0A192F] font-black text-xs shadow-xl group-hover:scale-110 transition-premium">
                {initials || 'AD'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-brand font-black text-white truncate uppercase tracking-widest">{displayName}</span>
                <span className="text-[9px] text-white/20 truncate font-black tracking-tighter uppercase mt-1">{role}</span>
              </div>
              <button 
                onClick={() => setIsLogoutModalOpen(true)}
                title="Log out"
                aria-label="Log out"
                className="ml-auto text-white/20 hover:text-red-400 transition-premium p-2 hover:bg-red-400/10 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          );
        })()}
      </div>

      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={confirmLogout} 
      />
    </div>
  );
};

export default Sidebar;

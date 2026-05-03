import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { SearchProvider } from '@/context/SearchContext';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    if (!isAuth) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <SearchProvider>
      <div className="flex h-screen bg-[#0A192F] overflow-hidden font-ui relative">
        {/* Dynamic Background Elements */}
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#1E3A8A]/20 rounded-full blur-[180px] opacity-60 animate-pulse transition-premium"></div>
        <div className="absolute bottom-[-15%] left-[-5%] w-[50%] h-[50%] bg-[#C5A059]/5 rounded-full blur-[150px] opacity-40 transition-premium"></div>
        <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-[#1E40AF]/10 rounded-full blur-[120px] opacity-30 transition-premium"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-[#0A192F] via-[#112240] to-[#0A192F] -z-10"></div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden transition-all duration-500"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          <main className="flex-1 overflow-y-auto relative p-6 sm:p-8 lg:p-10">
            <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
               <Outlet />
            </div>

            <footer className="mt-20 py-10 border-t border-white/5 text-center">
              <p className="text-[10px] font-brand font-bold text-white/20 uppercase tracking-[0.5em]">
                AURE SCENTS EXECUTIVE PORTFOLIO &copy; 2026
              </p>
            </footer>
          </main>
        </div>
      </div>
    </SearchProvider>
  );
};

export default AdminLayout;

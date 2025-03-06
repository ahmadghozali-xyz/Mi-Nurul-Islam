import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Info, Image, Bell, Mail, LogOut } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  isAdmin?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isAdmin }) => {
  const handleLogout = () => {
    // We'll implement this later with your local auth system
    console.log('Logout clicked');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    clsx(
      'flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-all',
      isActive && 'bg-green-50 text-green-700 font-medium'
    );

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 px-3 py-6 fixed left-0 top-0">
      <div className="flex flex-col items-center mb-8">
        <img
          src="https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?auto=format&fit=crop&q=80&w=100"
          alt="MI Nurul Islam Logo"
          className="w-20 h-20 rounded-full mb-3"
        />
        <h1 className="text-xl font-bold text-green-800">MI Nurul Islam</h1>
      </div>

      <nav className="space-y-2">
        <NavLink to="/" className={linkClass}>
          <Home size={20} />
          <span>Beranda</span>
        </NavLink>
        <NavLink to="/tentang" className={linkClass}>
          <Info size={20} />
          <span>Tentang Sekolah</span>
        </NavLink>
        <NavLink to="/galeri" className={linkClass}>
          <Image size={20} />
          <span>Galeri</span>
        </NavLink>
        <NavLink to="/informasi" className={linkClass}>
          <Bell size={20} />
          <span>Informasi</span>
        </NavLink>
        <NavLink to="/kontak" className={linkClass}>
          <Mail size={20} />
          <span>Kontak</span>
        </NavLink>
      </nav>

      {isAdmin && (
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all mt-auto absolute bottom-6 left-3 right-3"
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      )}
    </div>
  );
};
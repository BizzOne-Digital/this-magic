import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  FiLayout,
  FiUsers,
  FiBriefcase,
  FiStar,
  FiTag,
  FiImage,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: FiLayout, end: true },
  { to: '/admin/leads', label: 'Leads', icon: FiUsers },
  { to: '/admin/services', label: 'Services', icon: FiBriefcase },
  { to: '/admin/testimonials', label: 'Testimonials', icon: FiStar },
  { to: '/admin/promotions', label: 'Promotions', icon: FiTag },
  { to: '/admin/gallery', label: 'Gallery', icon: FiImage },
  { to: '/admin/content', label: 'Content', icon: FiFileText },
  { to: '/admin/settings', label: 'Settings', icon: FiSettings },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-teal/20 text-teal'
        : 'text-gray-300 hover:bg-navy-light hover:text-white'
    }`;

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-white/10">
        <h1 className="font-script text-2xl text-teal">This Magic Moment</h1>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={navLinkClass}
            onClick={() => setSidebarOpen(false)}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs text-gray-400 hover:text-teal transition-colors mb-3 px-4"
        >
          View Website →
        </a>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-navy/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-navy flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-white"
          aria-label="Close sidebar"
        >
          <FiX className="w-5 h-5" />
        </button>
        {sidebarContent}
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-navy"
              aria-label="Open sidebar"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold text-navy hidden sm:block">Admin Dashboard</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-navy">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiLogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

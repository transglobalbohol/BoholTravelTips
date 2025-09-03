import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user } = useAuth();

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
      />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {/* Header Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {getPageTitle(window.location.pathname)}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage your Bohol Travel Tips platform
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Helper function to get page title based on current path
const getPageTitle = (pathname: string): string => {
  const pathMap: { [key: string]: string } = {
    '/admin': 'Dashboard',
    '/admin/analytics': 'Analytics',
    '/admin/users': 'User Management',
    '/admin/bookings': 'Booking Management',
    '/admin/hotels': 'Hotel Management',
    '/admin/tours': 'Tour Management',
    '/admin/content': 'Content Management',
    '/admin/reviews': 'Reviews',
    '/admin/media': 'Media Gallery',
    '/admin/payments': 'Payments',
    '/admin/notifications': 'Notifications',
    '/admin/security': 'Security',
    '/admin/settings': 'Settings'
  };
  
  return pathMap[pathname] || 'Admin Panel';
};

export default AdminLayout;
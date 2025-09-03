import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Hotel, 
  MapPin, 
  FileText, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  Shield,
  CreditCard,
  Image,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      exact: true
    },
    {
      title: 'Analytics',
      icon: BarChart3,
      path: '/admin/analytics'
    },
    {
      title: 'User Management',
      icon: Users,
      path: '/admin/users'
    },
    {
      title: 'Booking Management',
      icon: Calendar,
      path: '/admin/bookings'
    },
    {
      title: 'Hotel Management',
      icon: Hotel,
      path: '/admin/hotels'
    },
    {
      title: 'Tour Management',
      icon: MapPin,
      path: '/admin/tours'
    },
    {
      title: 'Content Management',
      icon: FileText,
      path: '/admin/content'
    },
    {
      title: 'Reviews',
      icon: MessageSquare,
      path: '/admin/reviews'
    },
    {
      title: 'Media Gallery',
      icon: Image,
      path: '/admin/media'
    },
    {
      title: 'Payments',
      icon: CreditCard,
      path: '/admin/payments'
    },
    {
      title: 'Notifications',
      icon: Bell,
      path: '/admin/notifications'
    },
    {
      title: 'Security',
      icon: Shield,
      path: '/admin/security'
    },
    {
      title: 'Settings',
      icon: Settings,
      path: '/admin/settings'
    }
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-sm z-50 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-500">Bohol Travel Tips</p>
            </div>
          </div>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'admin@admin.com'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={isCollapsed ? item.title : ''}
              >
                <Icon className={`flex-shrink-0 w-5 h-5 ${
                  active ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                }`} />
                {!isCollapsed && (
                  <span className="ml-3 truncate">{item.title}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={handleLogout}
          className={`group flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut className="flex-shrink-0 w-5 h-5" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
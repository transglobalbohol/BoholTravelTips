import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Users, 
  Calendar, 
  Hotel, 
  MapPin,
  TrendingUp,
  DollarSign,
  Star,
  Activity,
  ChevronRight
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const statsCards = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12%',
      changeType: 'increase' as const,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Total Bookings',
      value: '1,234',
      change: '+8%',
      changeType: 'increase' as const,
      icon: Calendar,
      color: 'green'
    },
    {
      title: 'Total Hotels',
      value: '89',
      change: '+3%',
      changeType: 'increase' as const,
      icon: Hotel,
      color: 'yellow'
    },
    {
      title: 'Total Tours',
      value: '156',
      change: '+15%',
      changeType: 'increase' as const,
      icon: MapPin,
      color: 'purple'
    },
    {
      title: 'Revenue',
      value: '₱245,670',
      change: '+22%',
      changeType: 'increase' as const,
      icon: DollarSign,
      color: 'indigo'
    },
    {
      title: 'Avg. Rating',
      value: '4.8',
      change: '+0.2',
      changeType: 'increase' as const,
      icon: Star,
      color: 'pink'
    },
    {
      title: 'Active Sessions',
      value: '342',
      change: '+5%',
      changeType: 'increase' as const,
      icon: Activity,
      color: 'cyan'
    },
    {
      title: 'Growth Rate',
      value: '18.5%',
      change: '+2.3%',
      changeType: 'increase' as const,
      icon: TrendingUp,
      color: 'emerald'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New user registration', user: 'John Doe', time: '2 minutes ago', type: 'user' },
    { id: 2, action: 'New hotel booking', user: 'Jane Smith', time: '5 minutes ago', type: 'booking' },
    { id: 3, action: 'Review submitted', user: 'Mike Johnson', time: '10 minutes ago', type: 'review' },
    { id: 4, action: 'Tour package updated', user: 'Admin', time: '15 minutes ago', type: 'tour' },
    { id: 5, action: 'Payment processed', user: 'Sarah Wilson', time: '20 minutes ago', type: 'payment' }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; text: string; icon: string } } = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'bg-blue-500' },
      green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'bg-green-500' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: 'bg-yellow-500' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'bg-purple-500' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: 'bg-indigo-500' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-600', icon: 'bg-pink-500' },
      cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', icon: 'bg-cyan-500' },
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'bg-emerald-500' }
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <AdminLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);
          
          return (
            <div key={index} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 ${colors.icon} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.title}
                      </dt>
                      <dd className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                  <div className="ml-2">
                    <span className={`inline-flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
                      stat.changeType === 'increase' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Activity
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Latest actions and updates on your platform
              </p>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {recentActivities.map((activity) => (
                    <li key={activity.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            activity.type === 'user' ? 'bg-blue-100' :
                            activity.type === 'booking' ? 'bg-green-100' :
                            activity.type === 'review' ? 'bg-yellow-100' :
                            activity.type === 'tour' ? 'bg-purple-100' :
                            'bg-indigo-100'
                          }`}>
                            <Activity className={`h-4 w-4 ${
                              activity.type === 'user' ? 'text-blue-600' :
                              activity.type === 'booking' ? 'text-green-600' :
                              activity.type === 'review' ? 'text-yellow-600' :
                              activity.type === 'tour' ? 'text-purple-600' :
                              'text-indigo-600'
                            }`} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            by {activity.user} • {activity.time}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <a href="#" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                  View all activity
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white shadow-sm rounded-lg border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Quick Actions
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Common administrative tasks
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">Add New User</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                
                <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <Hotel className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">Add Hotel</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                
                <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">Add Tour</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                
                <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">View Reports</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Calendar, Camera, Save, Edit3, Shield, Bell, CreditCard } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  dateOfBirth: string;
  avatar: string;
  joinDate: string;
  totalBookings: number;
  preferences: {
    newsletter: boolean;
    smsNotifications: boolean;
    promotions: boolean;
  };
}

const Profile: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Mock user profile data
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+63 123 456 7890',
    location: 'Manila, Philippines',
    dateOfBirth: '1990-05-15',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    joinDate: '2023-01-15',
    totalBookings: 8,
    preferences: {
      newsletter: true,
      smsNotifications: false,
      promotions: true
    }
  });

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (preference: keyof UserProfile['preferences']) => {
    setUserProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: !prev.preferences[preference]
      }
    }));
  };

  const handleSaveProfile = () => {
    console.log('Saving profile:', userProfile);
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: <User className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'payment', label: 'Payment Methods', icon: <CreditCard className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container py-8">
          <h1 className="text-heading-1 mb-4">My Profile</h1>
          <p className="text-subheading">
            Manage your account information and preferences
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              {/* Profile Overview */}
              <div className="text-center mb-8">
                <div className="relative inline-block mb-4">
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <button className="absolute bottom-0 right-0 bg-gray-900 text-white p-1 rounded-full hover:bg-gray-800 transition-colors">
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
                <h3 className="text-heading-3 text-lg font-semibold mb-1">{userProfile.name}</h3>
                <p className="text-small text-gray-500 mb-2">{userProfile.email}</p>
                <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Member since {new Date(userProfile.joinDate).getFullYear()}
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon}
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="card p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-heading-2 text-xl">Profile Information</h2>
                  <button
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isEditing 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      className="input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      value={userProfile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      className="input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>Location</span>
                    </label>
                    <input
                      type="text"
                      value={userProfile.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={!isEditing}
                      className="input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Date of Birth</span>
                    </label>
                    <input
                      type="date"
                      value={userProfile.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      disabled={!isEditing}
                      className="input"
                    />
                  </div>
                </div>

                {/* Account Statistics */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-heading-3 text-lg mb-4">Account Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{userProfile.totalBookings}</div>
                      <div className="text-small text-gray-500">Total Bookings</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">3</div>
                      <div className="text-small text-gray-500">Upcoming Trips</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">15</div>
                      <div className="text-small text-gray-500">Wishlist Items</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">4.8</div>
                      <div className="text-small text-gray-500">Avg Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="card p-8">
                <h2 className="text-heading-2 text-xl mb-8">Security Settings</h2>
                
                <div className="space-y-6">
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input type="password" className="input" placeholder="Enter current password" />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input type="password" className="input" placeholder="Enter new password" />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input type="password" className="input" placeholder="Confirm new password" />
                  </div>
                  
                  <button className="btn-primary">
                    Update Password
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-heading-3 text-lg mb-4">Two-Factor Authentication</h3>
                  <p className="text-body mb-4">Add an extra layer of security to your account.</p>
                  <button className="btn-secondary">
                    Enable 2FA
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="card p-8">
                <h2 className="text-heading-2 text-xl mb-8">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Newsletter</h4>
                      <p className="text-small text-gray-500">Receive our weekly travel newsletter</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userProfile.preferences.newsletter}
                        onChange={() => handlePreferenceChange('newsletter')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                      <p className="text-small text-gray-500">Get booking confirmations via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userProfile.preferences.smsNotifications}
                        onChange={() => handlePreferenceChange('smsNotifications')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Promotional Offers</h4>
                      <p className="text-small text-gray-500">Receive special deals and discounts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userProfile.preferences.promotions}
                        onChange={() => handlePreferenceChange('promotions')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === 'payment' && (
              <div className="card p-8">
                <h2 className="text-heading-2 text-xl mb-8">Payment Methods</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-small text-gray-500">Expires 12/25</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-small text-blue-600 hover:text-blue-700">Edit</button>
                      <button className="text-small text-red-600 hover:text-red-700">Remove</button>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        MC
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 8888</p>
                        <p className="text-small text-gray-500">Expires 06/26</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-small text-blue-600 hover:text-blue-700">Edit</button>
                      <button className="text-small text-red-600 hover:text-red-700">Remove</button>
                    </div>
                  </div>
                </div>
                
                <button className="btn-primary">
                  Add New Payment Method
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
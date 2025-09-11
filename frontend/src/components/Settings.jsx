import { useState, useEffect } from "react";
import { clearAuthToken } from "../auth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import {
  User,
  Mail,
  Bell,
  Globe,
  Shield,
  Smartphone,
  Moon,
  Sun,
  LogOut,
  Save,
  Trash2,
  X,
  Check,
  AlertCircle,
  Lock
} from "lucide-react";

function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  const logout = () => {
    clearAuthToken();
    navigate("/login", { replace: true });
  };

  // Simulate API call to fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data that would come from your backend
      const mockUserData = {
        id: "user-123",
        name: "Jane Doe",
        email: "jane.doe@example.com",
        avatar: "https://ui-avatars.com/api/?name=Jane+Doe&background=0D8ABC&color=fff",
        role: "Full-stack Developer",
        bio: "Passionate developer with experience in React, Node.js, and cloud technologies. Always eager to learn and collaborate on innovative projects.",
        location: "San Francisco, CA",
        website: "https://janedoe.dev",
        github: "janedoe",
        linkedin: "jane-doe",
        twitter: "janedoedev",
        skills: ["React", "Node.js", "TypeScript", "AWS", "UI/UX Design"],
        notifications: {
          email: true,
          browser: true,
          mobile: false,
          newsletter: true,
          teamUpdates: true,
          projectInvites: true,
          mentorshipRequests: true
        },
        privacy: {
          profileVisibility: "public",
          showEmail: false,
          showLocation: true,
          allowTagging: true,
          allowMessaging: true
        },
        preferences: {
          theme: "system",
          language: "en",
          timezone: "America/Los_Angeles"
        },
        security: {
          twoFactorEnabled: false,
          lastPasswordChange: "2023-12-15",
          activeSessions: 2
        }
      };
      
      setUserData(mockUserData);
      setFormData(mockUserData);
      setLoading(false);
    };

    fetchUserData();
  }, []);

  // Get theme context
  const { theme, updateTheme } = useTheme();

  // Sync theme state with form data when component mounts or theme changes
  useEffect(() => {
    if (formData?.preferences && theme !== formData.preferences.theme) {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          theme: theme
        }
      }));
    }
  }, [theme, formData?.preferences]);

  // Handle form input changes
  const handleInputChange = (section, field, value) => {
    // If changing theme, update ThemeContext as well
    if (section === 'preferences' && field === 'theme') {
      updateTheme(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setUnsavedChanges(true);
  };

  // Handle direct field changes (not nested)
  const handleDirectFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setUnsavedChanges(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simulate API call to update user data
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update the user data with form data
    setUserData(formData);
    setUnsavedChanges(false);
    setLoading(false);
    
    // Show success toast
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    // Simulate API call to delete account
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, this would redirect to logout or login page
    setShowDeleteModal(false);
    setLoading(false);
    logout();
  };

  // Loading state
  if (loading && !userData) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="flex space-x-4">
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="max-w-3xl space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 rounded-2xl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
              <nav className="flex flex-col">
                <button 
                  onClick={() => setActiveTab("profile")} 
                  className={`flex items-center space-x-3 px-4 py-3 text-left ${activeTab === "profile" ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </button>
                <button 
                  onClick={() => setActiveTab("notifications")} 
                  className={`flex items-center space-x-3 px-4 py-3 text-left ${activeTab === "notifications" ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="font-medium">Notifications</span>
                </button>
                <button 
                  onClick={() => setActiveTab("privacy")} 
                  className={`flex items-center space-x-3 px-4 py-3 text-left ${activeTab === "privacy" ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Privacy</span>
                </button>
                <button 
                  onClick={() => setActiveTab("preferences")} 
                  className={`flex items-center space-x-3 px-4 py-3 text-left ${activeTab === "preferences" ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <Globe className="w-5 h-5" />
                  <span className="font-medium">Preferences</span>
                </button>
                <button 
                  onClick={() => setActiveTab("security")} 
                  className={`flex items-center space-x-3 px-4 py-3 text-left ${activeTab === "security" ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <Lock className="w-5 h-5" />
                  <span className="font-medium">Security</span>
                </button>
                <button 
                  onClick={() => setActiveTab("danger")} 
                  className={`flex items-center space-x-3 px-4 py-3 text-left ${activeTab === "danger" ? "bg-red-50 text-red-700 border-l-4 border-red-500" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Danger Zone</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Profile Settings */}
                {activeTab === "profile" && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h2 className="font-semibold text-xl text-gray-900">Profile Information</h2>
                      <p className="text-gray-500 text-sm mt-1">Update your personal information and public profile</p>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Avatar */}
                      <div className="flex items-center space-x-4">
                        <img 
                          src={userData.avatar} 
                          alt={userData.name} 
                          className="h-16 w-16 rounded-full"
                        />
                        <div>
                          <button type="button" className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors">
                            Change Avatar
                          </button>
                          <p className="text-xs text-gray-500 mt-1">JPG, GIF or PNG. 1MB max.</p>
                        </div>
                      </div>

                      {/* Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.name || ''}
                            onChange={(e) => handleDirectFieldChange('name', e.target.value)}
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.email || ''}
                            onChange={(e) => handleDirectFieldChange('email', e.target.value)}
                          />
                        </div>
                        <div>
                          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                            Role/Title
                          </label>
                          <input
                            type="text"
                            id="role"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.role || ''}
                            onChange={(e) => handleDirectFieldChange('role', e.target.value)}
                          />
                        </div>
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            id="location"
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={formData.location || ''}
                            onChange={(e) => handleDirectFieldChange('location', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Bio */}
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          rows="4"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Tell us about yourself"
                          value={formData.bio || ''}
                          onChange={(e) => handleDirectFieldChange('bio', e.target.value)}
                        ></textarea>
                        <p className="text-xs text-gray-500 mt-1">Brief description for your profile.</p>
                      </div>

                      {/* Skills */}
                      <div>
                        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                          Skills
                        </label>
                        <input
                          type="text"
                          id="skills"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="e.g. React, Node.js, UI Design"
                          value={formData.skills ? formData.skills.join(', ') : ''}
                          onChange={(e) => handleDirectFieldChange('skills', e.target.value.split(',').map(skill => skill.trim()))}
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === "notifications" && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h2 className="font-semibold text-xl text-gray-900">Notification Preferences</h2>
                      <p className="text-gray-500 text-sm mt-1">Manage how and when you receive notifications</p>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Notification Channels */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Notification Channels</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Mail className="w-5 h-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                                <p className="text-xs text-gray-500">Receive notifications via email</p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={formData.notifications?.email || false}
                                onChange={(e) => handleInputChange('notifications', 'email', e.target.checked)}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Bell className="w-5 h-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">Browser Notifications</p>
                                <p className="text-xs text-gray-500">Receive notifications in your browser</p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={formData.notifications?.browser || false}
                                onChange={(e) => handleInputChange('notifications', 'browser', e.target.checked)}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Smartphone className="w-5 h-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">Mobile Push Notifications</p>
                                <p className="text-xs text-gray-500">Receive notifications on your mobile device</p>
                              </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={formData.notifications?.mobile || false}
                                onChange={(e) => handleInputChange('notifications', 'mobile', e.target.checked)}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Notification Types */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Notification Types</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Team Updates</p>
                              <p className="text-xs text-gray-500">Notifications about your teams' activities</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={formData.notifications?.teamUpdates || false}
                                onChange={(e) => handleInputChange('notifications', 'teamUpdates', e.target.checked)}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Project Invites</p>
                              <p className="text-xs text-gray-500">Notifications when you're invited to projects</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={formData.notifications?.projectInvites || false}
                                onChange={(e) => handleInputChange('notifications', 'projectInvites', e.target.checked)}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Mentorship Requests</p>
                              <p className="text-xs text-gray-500">Notifications about mentorship opportunities</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={formData.notifications?.mentorshipRequests || false}
                                onChange={(e) => handleInputChange('notifications', 'mentorshipRequests', e.target.checked)}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Settings */}
                {activeTab === "privacy" && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h2 className="font-semibold text-xl text-gray-900">Privacy Settings</h2>
                      <p className="text-gray-500 text-sm mt-1">Control your privacy and what others can see</p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div>
                        <label htmlFor="profileVisibility" className="block text-sm font-medium text-gray-700 mb-1">
                          Profile Visibility
                        </label>
                        <select
                          id="profileVisibility"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formData.privacy?.profileVisibility || 'public'}
                          onChange={(e) => handleInputChange('privacy', 'profileVisibility', e.target.value)}
                        >
                          <option value="public">Public - Anyone can view your profile</option>
                          <option value="members">Members Only - Only registered users can view your profile</option>
                          <option value="connections">Connections Only - Only your connections can view your profile</option>
                          <option value="private">Private - Only you can view your profile</option>
                        </select>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Show Email Address</p>
                            <p className="text-xs text-gray-500">Allow others to see your email address</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={formData.privacy?.showEmail || false}
                              onChange={(e) => handleInputChange('privacy', 'showEmail', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Show Location</p>
                            <p className="text-xs text-gray-500">Allow others to see your location</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={formData.privacy?.showLocation || false}
                              onChange={(e) => handleInputChange('privacy', 'showLocation', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Allow Tagging</p>
                            <p className="text-xs text-gray-500">Allow others to tag you in posts and projects</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={formData.privacy?.allowTagging || false}
                              onChange={(e) => handleInputChange('privacy', 'allowTagging', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Allow Messaging</p>
                            <p className="text-xs text-gray-500">Allow others to send you direct messages</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={formData.privacy?.allowMessaging || false}
                              onChange={(e) => handleInputChange('privacy', 'allowMessaging', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Settings */}
                {activeTab === "preferences" && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h2 className="font-semibold text-xl text-gray-900">Preferences</h2>
                      <p className="text-gray-500 text-sm mt-1">Customize your experience</p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div>
                        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                          Theme
                        </label>
                        <div className="flex space-x-4">
                          <label className="relative flex flex-col items-center cursor-pointer">
                            <input 
                              type="radio" 
                              name="theme" 
                              className="sr-only peer" 
                              value="light"
                              checked={formData.preferences?.theme === 'light'}
                              onChange={() => handleInputChange('preferences', 'theme', 'light')}
                            />
                            <div className="w-16 h-16 bg-white border-2 rounded-lg flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-50">
                              <Sun className="h-8 w-8 text-gray-700" />
                            </div>
                            <span className="mt-1 text-sm font-medium text-gray-700">Light</span>
                          </label>
                          <label className="relative flex flex-col items-center cursor-pointer">
                            <input 
                              type="radio" 
                              name="theme" 
                              className="sr-only peer" 
                              value="dark"
                              checked={formData.preferences?.theme === 'dark'}
                              onChange={() => handleInputChange('preferences', 'theme', 'dark')}
                            />
                            <div className="w-16 h-16 bg-gray-900 border-2 border-gray-700 rounded-lg flex items-center justify-center peer-checked:border-blue-500">
                              <Moon className="h-8 w-8 text-white" />
                            </div>
                            <span className="mt-1 text-sm font-medium text-gray-700">Dark</span>
                          </label>
                          <label className="relative flex flex-col items-center cursor-pointer">
                            <input 
                              type="radio" 
                              name="theme" 
                              className="sr-only peer" 
                              value="system"
                              checked={formData.preferences?.theme === 'system'}
                              onChange={() => handleInputChange('preferences', 'theme', 'system')}
                            />
                            <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-900 border-2 rounded-lg flex items-center justify-center peer-checked:border-blue-500">
                              <div className="flex">
                                <Sun className="h-6 w-6 text-yellow-500" />
                                <Moon className="h-6 w-6 text-blue-300 -ml-1" />
                              </div>
                            </div>
                            <span className="mt-1 text-sm font-medium text-gray-700">System</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                          Language
                        </label>
                        <select
                          id="language"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formData.preferences?.language || 'en'}
                          onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                          <option value="zh">中文</option>
                          <option value="ja">日本語</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                          Timezone
                        </label>
                        <select
                          id="timezone"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formData.preferences?.timezone || 'America/Los_Angeles'}
                          onChange={(e) => handleInputChange('preferences', 'timezone', e.target.value)}
                        >
                          <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                          <option value="America/Denver">Mountain Time (US & Canada)</option>
                          <option value="America/Chicago">Central Time (US & Canada)</option>
                          <option value="America/New_York">Eastern Time (US & Canada)</option>
                          <option value="Europe/London">London</option>
                          <option value="Europe/Paris">Paris</option>
                          <option value="Asia/Tokyo">Tokyo</option>
                          <option value="Australia/Sydney">Sydney</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === "security" && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h2 className="font-semibold text-xl text-gray-900">Security</h2>
                      <p className="text-gray-500 text-sm mt-1">Manage your account security settings</p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">Change Password</h3>
                          <p className="text-xs text-gray-500 mt-1">Last changed: {formData.security?.lastPasswordChange || 'Never'}</p>
                        </div>
                        <button 
                          type="button" 
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                          Change Password
                        </button>
                      </div>

                      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                        <div>
                          <h3 className="text-sm font-medium text-gray-700">Two-Factor Authentication</h3>
                          <p className="text-xs text-gray-500 mt-1">Add an extra layer of security to your account</p>
                        </div>
                        <button 
                          type="button" 
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                        >
                          {formData.security?.twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
                        </button>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Active Sessions</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Current Session</p>
                              <p className="text-xs text-gray-500">Windows • Chrome • San Francisco, CA</p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active Now
                            </span>
                          </div>
                          {formData.security?.activeSessions > 1 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Other Session</p>
                                  <p className="text-xs text-gray-500">macOS • Safari • New York, NY</p>
                                </div>
                                <button 
                                  type="button" 
                                  className="text-xs text-red-600 hover:text-red-800"
                                >
                                  Revoke
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 text-right">
                          <button 
                            type="button" 
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Log out of all other sessions
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Danger Zone */}
                {activeTab === "danger" && (
                  <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-red-100 bg-red-50">
                      <h2 className="font-semibold text-xl text-red-700">Danger Zone</h2>
                      <p className="text-red-600 text-sm mt-1">Irreversible and destructive actions</p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-red-700">Delete Account</h3>
                        <p className="text-sm text-red-600 mt-1 mb-4">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <button 
                          type="button" 
                          onClick={() => setShowDeleteModal(true)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                {activeTab !== "danger" && (
                  <div className="flex justify-end space-x-3">
                    <button 
                      type="button" 
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!unsavedChanges || loading}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">Confirm Account Deletion</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-3 text-red-600 mb-4">
                <AlertCircle className="h-6 w-6" />
                <h4 className="text-lg font-medium">This action cannot be undone</h4>
              </div>
              <p className="text-gray-600 mb-4">
                You are about to delete your account and all associated data. This action is permanent and cannot be reversed.
              </p>
              <div className="mb-4">
                <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">
                  Please type "DELETE" to confirm
                </label>
                <input
                  type="text"
                  id="confirm"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="DELETE"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-4 right-4 bg-green-50 border border-green-200 rounded-lg shadow-lg p-4 flex items-center space-x-3 animate-fade-in-up">
          <div className="flex-shrink-0">
            <Check className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-800">Settings saved successfully!</p>
          </div>
          <button 
            onClick={() => setShowSuccessToast(false)}
            className="ml-4 text-green-500 hover:text-green-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default Settings;
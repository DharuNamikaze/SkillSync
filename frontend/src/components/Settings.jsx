import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import { UsersAPI } from "../lib/api";
import {
  User,
  Bell,
  Globe,
  Shield,
  Moon,
  Sun,
  LogOut,
  Save,
  Trash2,
  X,
  Check,
  AlertCircle
} from "lucide-react";

function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("notifications");
  const [formData, setFormData] = useState({});
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const userData = Object.keys(formData || {}).length ? formData : (user || {});

  // Fetch user profile data from API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await UsersAPI.profile();
        if (response.ok && response.data) {
          setFormData(response.data);
        } else if (user) {
          // Fallback to auth context user
          setFormData(user);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to auth context user
        if (user) {
          setFormData(user);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

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
    
    try {
      setLoading(true);
      const response = await UsersAPI.updateProfile(formData);
      
      if (response.ok) {
        setUnsavedChanges(false);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } else {
        alert(response.error || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const response = await UsersAPI.deleteProfile();
      
      if (response.ok) {
        setShowDeleteModal(false);
        logout();
        navigate('/login');
      } else {
        alert(response.error || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert(error.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
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


                {/* Notification Settings */}
                {activeTab === "notifications" && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                      <h2 className="font-semibold text-xl text-gray-900">Notification Preferences</h2>
                      <p className="text-gray-500 text-sm mt-1">Manage how and when you receive notifications</p>
                    </div>
                    <div className="p-6 space-y-6">
                      {/* Browser Notifications Only */}
                      <div>
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
                      onClick={() => {
                        if (user) {
                          setFormData(user);
                          setUnsavedChanges(false);
                        }
                      }}
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
                  onChange={(e) => {
                    const btn = document.getElementById('delete-confirm-btn');
                    if (btn) btn.disabled = e.target.value !== 'DELETE';
                  }}
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
                  id="delete-confirm-btn"
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={true}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center space-x-2 disabled:bg-red-300 disabled:cursor-not-allowed"
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



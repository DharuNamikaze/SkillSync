import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';

export default function UserSearchDialog({ onClose, onSelectUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // Search users
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm.trim()) {
        setUsers([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.message || 'Failed to search users');
        }
      } catch (error) {
        console.error('Error searching users:', error);
        setError('Failed to search users. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">New Conversation</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search users by name or username..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            // Loading skeleton
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : users.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {users.map(user => (
                <button
                  key={user.id}
                  className="w-full text-left p-3 hover:bg-gray-50 flex items-center space-x-3"
                  onClick={() => onSelectUser(user)}
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">@{user.username}</div>
                  </div>
                  <Plus className="h-5 w-5 text-gray-400" />
                </button>
              ))}
            </div>
          ) : searchTerm ? (
            <div className="text-center text-gray-500 py-8">
              No users found matching "{searchTerm}"
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Start typing to search for users
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
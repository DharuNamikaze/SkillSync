import React from 'react';
import { X, MessageSquare } from 'lucide-react';

function UserProfilePopup({ user, onClose, onStartChat }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* User info */}
        <div className="flex flex-col items-center">
          <img 
            src={user.picture || user.avatar} 
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <h3 className="mt-4 text-xl font-semibold text-gray-900">{user.name}</h3>
          {user.title && (
            <p className="text-gray-600 mt-1">{user.title}</p>
          )}
        </div>

        {/* User details */}
        <div className="mt-6 space-y-4">
          {user.bio && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Bio</h4>
              <p className="mt-1 text-gray-900">{user.bio}</p>
            </div>
          )}
          
          {user.socialLinks && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Social Links</h4>
              <div className="mt-1 space-y-2">
                {user.socialLinks.github && (
                  <a 
                    href={user.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 block"
                  >
                    GitHub
                  </a>
                )}
                {user.socialLinks.linkedin && (
                  <a 
                    href={user.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 block"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => onStartChat(user)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Start Private Chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfilePopup;
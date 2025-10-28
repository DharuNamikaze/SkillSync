import React from 'react';
import { useNotifications } from '../NotificationContext';
import { X, Bell, UserPlus, FileText, MessageCircle, AlertCircle, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationPopup = () => {
  const { popupNotifications, dismissPopup } = useNotifications();
  const navigate = useNavigate();

  const getIcon = (type) => {
    const icons = {
      invitation: UserPlus,
      task_assignment: FileText,
      comment: MessageCircle,
      new_message: MessageCircle,
      deadline: AlertCircle,
      achievement: Award,
      mention: MessageCircle,
      team_update: UserPlus,
      system: Bell
    };
    return icons[type] || Bell;
  };

  const getIconColor = (type) => {
    const colors = {
      invitation: 'bg-blue-100 text-blue-600',
      task_assignment: 'bg-orange-100 text-orange-600',
      comment: 'bg-green-100 text-green-600',
      new_message: 'bg-green-100 text-green-600',
      deadline: 'bg-red-100 text-red-600',
      achievement: 'bg-purple-100 text-purple-600',
      mention: 'bg-yellow-100 text-yellow-600',
      team_update: 'bg-indigo-100 text-indigo-600',
      system: 'bg-gray-100 text-gray-600'
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  const handleNotificationClick = (notification) => {
    dismissPopup(notification.id);
    
    // Navigate based on notification type
    if (notification.type === 'new_message' && notification.projectId) {
      navigate(`/projects/${notification.projectId}/workspace`);
    } else if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  if (popupNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full pointer-events-none">
      {popupNotifications.map((notification) => {
        const Icon = getIcon(notification.type);
        
        return (
          <div
            key={notification.id}
            className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 animate-slide-in-right pointer-events-auto cursor-pointer hover:shadow-3xl transition-all"
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex items-start space-x-3">
              {/* Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getIconColor(notification.type)}`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {notification.title && (
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        {notification.title}
                      </h4>
                    )}
                    
                    {notification.message && (
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {notification.message}
                      </p>
                    )}

                    {notification.sender && (
                      <div className="flex items-center space-x-2 mt-2">
                        {notification.sender.avatar && (
                          <img
                            src={notification.sender.avatar}
                            alt={notification.sender.name}
                            className="w-5 h-5 rounded-full"
                          />
                        )}
                        <span className="text-xs text-gray-500">
                          {notification.sender.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Close button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissPopup(notification.id);
                    }}
                    className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress bar for auto-dismiss */}
                <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 animate-progress"
                    style={{ animationDuration: '5s' }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        .animate-progress {
          animation: progress linear;
        }
      `}</style>
    </div>
  );
};

export default NotificationPopup;

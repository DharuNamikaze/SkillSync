import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  Check,
  X,
  Filter,
  Settings,
  User,
  MessageCircle,
  Calendar,
  GitPullRequest,
  AlertCircle,
  Award,
  UserPlus,
  FileText,
  Clock,
  Trash2,
  MoreVertical,
  Eye,
  EyeOff,
  Archive
} from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Simulate API call - replace with actual API integration
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data that would typically come from your database
      const mockNotifications = [
        {
          id: 'notif-001',
          type: 'invitation',
          title: 'Project Invitation',
          message: 'Alex Chen invited you to join Campus Navigator App',
          timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
          isRead: false,
          priority: 'high',
          sender: {
            id: 'user-123',
            name: 'Alex Chen',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
            role: 'Project Lead'
          },
          actionUrl: '/projects/campus-navigator',
          category: 'projects',
          metadata: {
            projectId: 'proj-002',
            projectName: 'Campus Navigator App'
          }
        },
        {
          id: 'notif-002',
          type: 'task_assignment',
          title: 'New Task Assigned',
          message: 'You have been assigned API integration task in Open Source Docs Revamp',
          timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
          isRead: false,
          priority: 'medium',
          sender: {
            id: 'user-456',
            name: 'Sarah Martinez',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
            role: 'Tech Lead'
          },
          actionUrl: '/tasks/api-integration',
          category: 'tasks',
          metadata: {
            taskId: 'task-789',
            dueDate: '2024-09-15',
            estimatedHours: 8
          }
        },
        {
          id: 'notif-003',
          type: 'comment',
          title: 'New Comment',
          message: 'Dr. Emily Watson commented on your proposal in AI Study Buddy project',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
          isRead: true,
          priority: 'low',
          sender: {
            id: 'user-789',
            name: 'Dr. Emily Watson',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
            role: 'Research Director'
          },
          actionUrl: '/projects/ai-study-buddy/comments',
          category: 'comments',
          metadata: {
            commentId: 'comment-456',
            parentType: 'proposal'
          }
        },
        {
          id: 'notif-004',
          type: 'deadline',
          title: 'Approaching Deadline',
          message: 'Sustainable Energy Dashboard project deadline is in 3 days',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          isRead: false,
          priority: 'high',
          sender: {
            id: 'system',
            name: 'System',
            avatar: null,
            role: 'Automated'
          },
          actionUrl: '/projects/sustainable-energy-dashboard',
          category: 'deadlines',
          metadata: {
            projectId: 'proj-004',
            daysLeft: 3,
            completionPercentage: 85
          }
        },
        {
          id: 'notif-005',
          type: 'achievement',
          title: 'Achievement Unlocked',
          message: 'Congratulations! You completed 5 projects this quarter',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          isRead: true,
          priority: 'low',
          sender: {
            id: 'system',
            name: 'System',
            avatar: null,
            role: 'Automated'
          },
          actionUrl: '/profile/achievements',
          category: 'achievements',
          metadata: {
            achievementType: 'project_completion',
            points: 500,
            badge: 'Prolific Contributor'
          }
        },
        {
          id: 'notif-006',
          type: 'mention',
          title: 'You were mentioned',
          message: 'Lisa Park mentioned you in Community Marketplace discussion',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
          isRead: true,
          priority: 'medium',
          sender: {
            id: 'user-321',
            name: 'Lisa Park',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face',
            role: 'Product Manager'
          },
          actionUrl: '/projects/community-marketplace/discussions',
          category: 'mentions',
          metadata: {
            discussionId: 'disc-123',
            context: 'feature planning'
          }
        },
        {
          id: 'notif-007',
          type: 'team_update',
          title: 'Team Update',
          message: 'New team member joined Mental Health Tracker project',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
          isRead: true,
          priority: 'low',
          sender: {
            id: 'user-654',
            name: 'David Kim',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
            role: 'Project Manager'
          },
          actionUrl: '/projects/mental-health-tracker/team',
          category: 'team',
          metadata: {
            projectId: 'proj-006',
            newMemberName: 'Jordan Smith',
            teamSize: 5
          }
        },
        {
          id: 'notif-008',
          type: 'system',
          title: 'System Maintenance',
          message: 'Scheduled maintenance will occur tonight from 12-2 AM EST',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          isRead: false,
          priority: 'medium',
          sender: {
            id: 'system',
            name: 'System Admin',
            avatar: null,
            role: 'Administrator'
          },
          actionUrl: '/system/maintenance',
          category: 'system',
          metadata: {
            maintenanceWindow: '12:00 AM - 2:00 AM EST',
            affectedServices: ['API', 'Database'],
            estimatedDowntime: 120
          }
        }
      ];
      
      setNotifications(mockNotifications);
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  // Helper functions
  const getNotificationIcon = (type) => {
    const icons = {
      invitation: UserPlus,
      task_assignment: FileText,
      comment: MessageCircle,
      deadline: AlertCircle,
      achievement: Award,
      mention: MessageCircle,
      team_update: User,
      system: Settings
    };
    return icons[type] || Bell;
  };

  const getTypeColor = (type, priority) => {
    const colors = {
      invitation: 'bg-blue-100 text-blue-600',
      task_assignment: 'bg-orange-100 text-orange-600',
      comment: 'bg-green-100 text-green-600',
      deadline: 'bg-red-100 text-red-600',
      achievement: 'bg-purple-100 text-purple-600',
      mention: 'bg-yellow-100 text-yellow-600',
      team_update: 'bg-indigo-100 text-indigo-600',
      system: 'bg-gray-100 text-gray-600'
    };
    return colors[type] || 'bg-gray-100 text-gray-600';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return timestamp.toLocaleDateString();
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.category === filter;
    const matchesReadStatus = !showUnreadOnly || !notification.isRead;
    return matchesFilter && matchesReadStatus;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Event handlers
  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    // In real app, navigate to the action URL
    console.log('Navigating to:', notification.actionUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const NotificationCard = ({ notification }) => {
    const Icon = getNotificationIcon(notification.type);
    
    return (
      <div
        className={` bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border cursor-pointer group ${
          notification.isRead 
            ? 'border-gray-100 hover:border-gray-200' 
            : 'border-blue-200 bg-blue-50/30 hover:border-blue-300'
        }`}
        onClick={() => handleNotificationClick(notification)}
      >
        <div className="p-4">
          <div className="flex items-start space-x-4">
            {/* Avatar or Icon */}
            <div className="flex-shrink-0">
              {notification.sender.avatar ? (
                <img
                  src={notification.sender.avatar}
                  alt={notification.sender.name}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                />
              ) : (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}>
                  <Icon className="w-5 h-5" />
                </div>
              )}
              {!notification.isRead && (
                <div className="w-3 h-3 bg-blue-500 rounded-full -mt-2 ml-8 border-2 border-white"></div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className={`text-sm font-semibold ${
                      notification.isRead ? 'text-gray-900' : 'text-gray-900'
                    }`}>
                      {notification.title}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                      {notification.type.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <p className={`text-sm mb-2 ${
                    notification.isRead ? 'text-gray-600' : 'text-gray-700'
                  }`}>
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(notification.timestamp)}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span>{notification.sender.name}</span>
                    {notification.sender.role && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span>{notification.sender.role}</span>
                      </>
                    )}
                  </div>

                  {/* Metadata */}
                  {notification.metadata && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                      <div className="text-xs text-gray-600">
                        {notification.type === 'task_assignment' && (
                          <div className="flex items-center space-x-4">
                            <span>Due: {notification.metadata.dueDate}</span>
                            <span>Est: {notification.metadata.estimatedHours}h</span>
                          </div>
                        )}
                        {notification.type === 'deadline' && (
                          <div className="flex items-center space-x-4">
                            <span className="text-red-600 font-medium">{notification.metadata.daysLeft} days left</span>
                            <span>{notification.metadata.completionPercentage}% complete</span>
                          </div>
                        )}
                        {notification.type === 'achievement' && (
                          <div className="flex items-center space-x-2">
                            <Award className="w-3 h-3 text-purple-500" />
                            <span className="font-medium">{notification.metadata.badge}</span>
                            <span>+{notification.metadata.points} points</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-full"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 rounded-2xl">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="w-8 h-8 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'projects', label: 'Projects' },
                { key: 'tasks', label: 'Tasks' },
                { key: 'comments', label: 'Comments' },
                { key: 'team', label: 'Team' },
                { key: 'system', label: 'System' }
              ].map(filterOption => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === filterOption.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm transition-colors ${
                  showUnreadOnly
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {showUnreadOnly ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>Unread only</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BellRing className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">{notifications.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-xl font-bold text-gray-900">{unreadCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Read</p>
                <p className="text-xl font-bold text-gray-900">{notifications.length - unreadCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500">
                {showUnreadOnly
                  ? "You're all caught up! No unread notifications."
                  : "Try adjusting your filter criteria."}
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
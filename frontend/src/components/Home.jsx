import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  CheckSquare,
  Calendar,
  Award,
  Activity,
  Clock,
  Star,
  GitPullRequest,
  MessageSquare,
  Bell,
  BarChart2
} from "lucide-react";

function Home() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projectsCompleted: 0,
    tasksInProgress: 0,
    upcomingDeadlines: 0,
    teamActivities: 0
  });

  // Simulate API call to fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data that would come from your backend
      const mockUserData = {
        name: "Jane Doe",
        role: "Full-stack Developer",
        recentActivity: [
          { type: "project_join", content: "Joined Sustainable Energy Dashboard project", timestamp: "2 hours ago" },
          { type: "task_complete", content: "Completed API integration for Community Marketplace", timestamp: "1 day ago" },
          { type: "comment", content: "Commented on Mental Health Tracker proposal", timestamp: "3 days ago" }
        ],
        trendingProjects: [
          { id: "proj-001", name: "Open Source Docs Revamp", stars: 24, activity: "high" },
          { id: "proj-002", name: "Campus Navigator App", stars: 18, activity: "medium" },
          { id: "proj-003", name: "AI Study Buddy", stars: 32, activity: "high" }
        ],
        teams: [
          { id: "team-001", name: "Full‑stack Guild", members: 8, unreadMessages: 3 },
          { id: "team-002", name: "UI/UX Collective", members: 5, unreadMessages: 0 }
        ],
        upcomingTasks: [
          { id: "task-001", name: "Design review", dueDate: "2024-08-25", priority: "high", project: "Campus Navigator App" },
          { id: "task-002", name: "API integration", dueDate: "2024-08-28", priority: "medium", project: "Community Marketplace" },
          { id: "task-003", name: "Documentation update", dueDate: "2024-09-02", priority: "low", project: "Open Source Docs Revamp" }
        ],
        skills: [
          { name: "React", level: 85, recentGrowth: 5 },
          { name: "Node.js", level: 72, recentGrowth: 3 },
          { name: "TypeScript", level: 68, recentGrowth: 8 }
        ]
      };
      
      setUserData(mockUserData);
      setStats({
        projectsCompleted: 7,
        tasksInProgress: 4,
        upcomingDeadlines: 3,
        teamActivities: 12
      });
      setLoading(false);
    };

    fetchUserData();
  }, []);

  // Format date for better display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      high: "text-red-600",
      medium: "text-orange-500",
      low: "text-blue-500"
    };
    return colors[priority] || colors.medium;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                </div>
              ))}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userData?.name}</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your projects and teams</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckSquare className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Projects Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.projectsCompleted}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tasks In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.tasksInProgress}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Upcoming Deadlines</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingDeadlines}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Team Activities</p>
                <p className="text-2xl font-bold text-gray-900">{stats.teamActivities}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
          {/* Trending Projects */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Trending Projects</h3>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
            </div>
            <div className="p-6 space-y-4">
              {userData?.trendingProjects.map(project => (
                <div key={project.id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <div>
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                      <span className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{project.stars}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Activity className="w-4 h-4" />
                        <span className="capitalize">{project.activity}</span>
                      </span>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    Join
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Your Teams */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Your Teams</h3>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
            </div>
            <div className="p-6 space-y-4">
              {userData?.teams.map(team => (
                <div key={team.id} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <div>
                    <h4 className="font-medium text-gray-900">{team.name}</h4>
                    <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                      <span className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{team.members} members</span>
                      </span>
                      {team.unreadMessages > 0 && (
                        <span className="flex items-center space-x-1 text-blue-600">
                          <MessageSquare className="w-4 h-4" />
                          <span>{team.unreadMessages} new</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Open
                  </button>
                </div>
              ))}
              <button className="w-full py-2 mt-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Create New Team</span>
              </button>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-gray-900">Upcoming Tasks</h3>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
            </div>
            <div className="p-6 space-y-4">
              {userData?.upcomingTasks.map(task => (
                <div key={task.id} className="flex items-start justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <div>
                    <h4 className="font-medium text-gray-900">{task.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">For {task.project}</p>
                    <div className="flex items-center space-x-3 text-sm mt-2">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{formatDate(task.dueDate)}</span>
                      </span>
                      <span className={`flex items-center space-x-1 ${getPriorityColor(task.priority)}`}>
                        <Activity className="w-4 h-4" />
                        <span className="capitalize">{task.priority}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                      <CheckSquare className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 mt-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2">
                <CheckSquare className="w-4 h-4" />
                <span>View All Tasks</span>
              </button>
            </div>
          </div>
        </div>

        {/* Skills Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Skills Progress</h3>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          <div className="p-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {userData?.skills.map(skill => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    <span className="text-sm text-gray-600">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-blue-600" 
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                  {skill.recentGrowth > 0 && (
                    <div className="text-xs text-green-600 flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>+{skill.recentGrowth}% this month</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-gray-900">Recent Activity</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {userData?.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="mt-1">
                    {activity.type === 'project_join' && <GitPullRequest className="w-5 h-5 text-blue-500" />}
                    {activity.type === 'task_complete' && <CheckSquare className="w-5 h-5 text-green-500" />}
                    {activity.type === 'comment' && <MessageSquare className="w-5 h-5 text-purple-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">{activity.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;



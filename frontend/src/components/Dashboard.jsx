import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BarChart, 
  PieChart, 
  Calendar, 
  Users, 
  Briefcase, 
  Award, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock3
} from "lucide-react";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [skillProgress, setSkillProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock data that would come from your backend
      const mockStats = {
        projectsCompleted: 12,
        projectsInProgress: 5,
        totalTeams: 8,
        skillsLearned: 24,
        hoursLogged: 342,
        tasksCompleted: 87,
        tasksInProgress: 14,
        projectCompletionRate: 78, // percentage
      };

      const mockActivities = [
        {
          id: 1,
          type: "project_milestone",
          title: "Frontend MVP Completed",
          project: "SkillSync Platform",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          user: {
            name: "Alex Johnson",
            avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff"
          }
        },
        {
          id: 2,
          type: "task_completed",
          title: "API Integration",
          project: "SkillSync Platform",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
          user: {
            name: "Sarah Williams",
            avatar: "https://ui-avatars.com/api/?name=Sarah+Williams&background=6366F1&color=fff"
          }
        },
        {
          id: 3,
          type: "team_joined",
          title: "Joined Backend Team",
          team: "Backend Development",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          user: {
            name: "Michael Chen",
            avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=10B981&color=fff"
          }
        },
        {
          id: 4,
          type: "skill_achieved",
          title: "React Advanced Level",
          skill: "React",
          level: "Advanced",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
          user: {
            name: "Emily Rodriguez",
            avatar: "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=F59E0B&color=fff"
          }
        },
        {
          id: 5,
          type: "project_created",
          title: "Mobile App Design",
          description: "UI/UX design for the new mobile application",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
          user: {
            name: "David Kim",
            avatar: "https://ui-avatars.com/api/?name=David+Kim&background=EF4444&color=fff"
          }
        }
      ];

      const mockUpcomingTasks = [
        {
          id: 101,
          title: "Complete API Documentation",
          project: "SkillSync Platform",
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days from now
          priority: "high",
          status: "in_progress"
        },
        {
          id: 102,
          title: "Design User Dashboard",
          project: "SkillSync Platform",
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day from now
          priority: "medium",
          status: "not_started"
        },
        {
          id: 103,
          title: "Fix Authentication Bug",
          project: "SkillSync Platform",
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 12), // 12 hours from now
          priority: "high",
          status: "in_progress"
        },
        {
          id: 104,
          title: "Team Progress Meeting",
          project: "SkillSync Platform",
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours from now
          priority: "medium",
          status: "not_started"
        },
        {
          id: 105,
          title: "Review Pull Requests",
          project: "SkillSync Platform",
          dueDate: new Date(Date.now() + 1000 * 60 * 60 * 6), // 6 hours from now
          priority: "low",
          status: "not_started"
        }
      ];

      const mockSkillProgress = [
        { name: "React", progress: 85, level: "Advanced" },
        { name: "Node.js", progress: 70, level: "Intermediate" },
        { name: "TypeScript", progress: 60, level: "Intermediate" },
        { name: "UI/UX Design", progress: 45, level: "Beginner" },
        { name: "GraphQL", progress: 30, level: "Beginner" }
      ];

      setStats(mockStats);
      setActivities(mockActivities);
      setUpcomingTasks(mockUpcomingTasks);
      setSkillProgress(mockSkillProgress);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  // Format date to readable format
  const formatDate = (date) => {
    if (!date) return "";
    
    const now = new Date();
    const targetDate = new Date(date);
    const diffMs = targetDate - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffDays === 0) {
      if (diffHours <= 0) {
        return "Today";
      }
      return `In ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else {
      return `In ${diffDays} days`;
    }
  };

  // Format timestamp for activities
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    
    const now = new Date();
    const activityDate = new Date(timestamp);
    const diffMs = now - activityDate;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return activityDate.toLocaleDateString();
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-amber-600 bg-amber-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "in_progress":
        return <Clock3 className="h-4 w-4 text-blue-500" />;
      case "not_started":
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  // Get activity icon
  const getActivityIcon = (type) => {
    switch (type) {
      case "project_milestone":
        return <Award className="h-5 w-5 text-purple-500" />;
      case "task_completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "team_joined":
        return <Users className="h-5 w-5 text-blue-500" />;
      case "skill_achieved":
        return <Award className="h-5 w-5 text-amber-500" />;
      case "project_created":
        return <Briefcase className="h-5 w-5 text-indigo-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-[calc(100vh-64px)] rounded-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold ">Dashboard</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Overview */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Projects</p>
                <h3 className="text-2xl font-bold mt-1">{stats?.projectsCompleted + stats?.projectsInProgress}</h3>
                <div className="flex items-center mt-1 space-x-1">
                  <span className="text-xs text-green-600 font-medium flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    {stats?.projectCompletionRate}%
                  </span>
                  <span className="text-xs text-gray-500">completion rate</span>
                </div>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-4 flex justify-between text-xs text-gray-500">
              <div>
                <span className="block font-medium text-gray-700">{stats?.projectsCompleted}</span>
                <span>Completed</span>
              </div>
              <div>
                <span className="block font-medium text-gray-700">{stats?.projectsInProgress}</span>
                <span>In Progress</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Teams</p>
                <h3 className="text-2xl font-bold mt-1">{stats?.totalTeams}</h3>
                <div className="flex items-center mt-1 space-x-1">
                  <span className="text-xs text-gray-500">Active collaborations</span>
                </div>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Tasks</p>
                <h3 className="text-2xl font-bold mt-1">{stats?.tasksCompleted + stats?.tasksInProgress}</h3>
                <div className="flex items-center mt-1 space-x-1">
                  <span className="text-xs text-green-600 font-medium flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    {Math.round((stats?.tasksCompleted / (stats?.tasksCompleted + stats?.tasksInProgress)) * 100)}%
                  </span>
                  <span className="text-xs text-gray-500">completion rate</span>
                </div>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4 flex justify-between text-xs text-gray-500">
              <div>
                <span className="block font-medium text-gray-700">{stats?.tasksCompleted}</span>
                <span>Completed</span>
              </div>
              <div>
                <span className="block font-medium text-gray-700">{stats?.tasksInProgress}</span>
                <span>In Progress</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Skills</p>
                <h3 className="text-2xl font-bold mt-1">{stats?.skillsLearned}</h3>
                <div className="flex items-center mt-1 space-x-1">
                  <span className="text-xs text-gray-500">Skills acquired</span>
                </div>
              </div>
              <div className="p-2 bg-amber-50 rounded-lg">
                <Award className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Tasks */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-gray-800">Upcoming Tasks</h3>
                <Link to="/projects" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="p-4 animate-pulse">
                    <div className="flex justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-6 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))
              ) : upcomingTasks.length > 0 ? (
                upcomingTasks.map(task => (
                  <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {getStatusIcon(task.status)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{task.title}</h4>
                          <p className="text-sm text-gray-500">{task.project}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                        <span className="text-sm text-gray-600 whitespace-nowrap">{formatDate(task.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No upcoming tasks
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skill Progress */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-gray-800">Skill Progress</h3>
                <Link to="/profile" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2 animate-pulse">
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded w-full"></div>
                  </div>
                ))
              ) : skillProgress.length > 0 ? (
                skillProgress.map((skill, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                      <span className="text-xs text-gray-500">{skill.level}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${skill.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  No skills tracked yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
     
    </div>
  );
}

export default Dashboard;
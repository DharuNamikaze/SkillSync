import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Users,
  Calendar,
  Star,
  GitBranch,
  Clock,
  Eye,
  UserPlus,
  MoreVertical,
  Briefcase,
  TrendingUp,
  Award,
  MapPin
} from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Simulate API call - replace with actual API integration
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data that would typically come from your database
      const mockProjects = [
        {
          id: 'proj-004',
          name: 'Sustainable Energy Dashboard',
          description: 'Real-time monitoring dashboard for renewable energy sources with predictive analytics and automated reporting.',
          status: 'active',
          technologies: ['Vue.js', 'D3.js', 'Python', 'InfluxDB'],
          members: {
            current: 6,
            max: 6,
            avatars: [
              'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
            ]
          },
          progress: 85,
          deadline: '2024-09-30',
          createdBy: 'Alex Thompson',
          department: 'Sustainability',
          difficulty: 'advanced',
          tags: ['dashboard', 'analytics', 'green-tech'],
          metrics: {
            commits: 312,
            issues: 3,
            stars: 78
          },
        },
        {
          id: 'proj-005',
          name: 'Community Marketplace',
          description: 'Local marketplace platform connecting community members for buying, selling, and trading goods and services.',
          status: 'recruiting',
          technologies: ['Next.js', 'Stripe', 'Firebase', 'Tailwind'],
          members: {
            current: 2,
            max: 5,
            avatars: [
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
            ]
          },
          progress: 25,
          deadline: '2024-11-15',
          createdBy: 'Lisa Park',
          department: 'Community',
          difficulty: 'intermediate',
          tags: ['marketplace', 'community', 'e-commerce'],
          metrics: {
            commits: 98,
            issues: 7,
            stars: 23
          },
        },
        {
          id: 'proj-006',
          name: 'Mental Health Tracker',
          description: 'Privacy-focused mental health tracking app with mood analytics, meditation guides, and peer support features.',
          status: 'completed',
          technologies: ['Flutter', 'Dart', 'Firebase', 'Charts'],
          members: {
            current: 4,
            max: 4,
            avatars: [
              'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face'
            ]
          },
          progress: 100,
          deadline: '2024-08-15',
          createdBy: 'David Kim',
          department: 'Healthcare',
          difficulty: 'intermediate',
          tags: ['health', 'mobile', 'privacy'],
          metrics: {
            commits: 445,
            issues: 0,
            stars: 234
          },
        }
      ];

      setProjects(mockProjects);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  // Filter and search logic
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = selectedFilter === 'all' || project.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  // Helper functions
  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-100 text-green-800 border-green-200',
      'recruiting': 'bg-blue-100 text-blue-800 border-blue-200',
      'planning': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'completed': 'bg-gray-100 text-gray-800 border-gray-200',
      'paused': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || colors['planning'];
  };



  const getDifficultyIcon = (difficulty) => {
    const config = {
      'beginner': { icon: '🟢', label: 'Beginner' },
      'intermediate': { icon: '🟡', label: 'Intermediate' },
      'advanced': { icon: '🔴', label: 'Advanced' }
    };
    return config[difficulty] || config['intermediate'];
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `${diffDays} days left`;
    return date.toLocaleDateString();
  };

  // Event handlers
  const handleJoinProject = (projectId) => {
    // In real app, this would make an API call
    console.log('Joining project:', projectId);
    // Update local state optimistically
    setProjects(prev => prev.map(p =>
      p.id === projectId
        ? { ...p, members: { ...p.members, current: p.members.current + 1 } }
        : p
    ));
  };

  const handleViewProject = (projectId) => {
    // In real app, this would navigate to project details
    console.log('Viewing project:', projectId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
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

  const ProjectCard = ({ project }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden group">
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {project.name}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {project.description}
            </p>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Status and Priority */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            {getDifficultyIcon(project.difficulty).icon}
            {getDifficultyIcon(project.difficulty).label}
          </span>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map(tech => (
            <span key={tech} className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-500">
              +{project.technologies.length - 3} more
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-700">Progress</span>
            <span className="text-xs text-gray-500">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${project.progress >= 80 ? 'bg-green-500' :
                project.progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
                }`}
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Team Members */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {project.members.avatars.slice(0, 3).map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`Member ${index + 1}`}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                />
              ))}
              {project.members.current > 3 && (
                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center shadow-sm">
                  <span className="text-xs font-medium text-gray-600">
                    +{project.members.current - 3}
                  </span>
                </div>
              )}
            </div>
            <span className="text-sm text-gray-600">
              {project.members.current}/{project.members.max} members
            </span>
          </div>
        </div>

        {/* Project Info */}
        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Deadline</p>
              <p className="text-xs font-medium text-gray-900">{formatDeadline(project.deadline)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Department</p>
              <p className="text-xs font-medium text-gray-900">{project.department}</p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <GitBranch className="w-3 h-3" />
            <span>{project.metrics.commits}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3" />
            <span>{project.metrics.stars}</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={() => handleJoinProject(project.id)}
            disabled={project.members.current >= project.members.max || project.status === 'completed'}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-4 h-4" />
            <span>Join</span>
          </button>
          <button
            onClick={() => handleViewProject(project.id)}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">Discover and join exciting projects in your community</p>
          </div>
          <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
            <Plus className="w-5 h-5" />
            <span>Create Project</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects by name, description, or technology..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Projects</option>
                <option value="active">Active</option>
                <option value="recruiting">Recruiting</option>
                <option value="planning">Planning</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recruiting</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter(p => p.status === 'recruiting').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {projects.filter(p => p.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
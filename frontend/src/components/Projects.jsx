import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  MapPin,
  Code2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { ProjectsAPI } from "../lib/api";
import CreateProjectModal from "./CreateProjectModal";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch projects from API with fallback to mock data
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await ProjectsAPI.list({
          search: searchTerm || undefined,
          status: selectedFilter === 'all' ? undefined : selectedFilter,
          limit: 50
        });

        console.log('Projects API response:', response);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to view projects');
        }
        throw new Error(response.error || 'Failed to fetch projects');
      }

      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid response data format:', response);
        throw new Error('Invalid response format from server');
      }

      // Validate project data format
      const validProjects = response.data.filter(project => {
        const isValid = project && 
          project._id && 
          project.name && 
          project.description &&
          project.status &&
          project.members;

        if (!isValid) {
          console.warn('Invalid project data:', project);
        }

        return isValid;
      });

      if (validProjects.length < response.data.length) {
        console.warn(`Filtered ${response.data.length - validProjects.length} invalid projects`);
      }

      setError(null); // Clear any previous errors
      setProjects(validProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        
        // Handle specific error cases
        if (error.message === 'Authentication required' || error.response?.status === 401) {
          setError('Please log in to view projects');
        } else {
          setError(error.message || 'Failed to load projects. Please try again.');
        }
        
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [searchTerm, selectedFilter]); // Re-fetch when search or filter changes

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
  const handleJoinProject = async (projectId) => {
    try {
      const response = await ProjectsAPI.join(projectId);
      if (response.ok && response.data) {
        // Update local state with the response data
        setProjects(prev => prev.map(p =>
          p.id === projectId
            ? {
                ...p,
                members: response.data.members, // Replace entire members object
                workspace: response.data.workspace,
                status: response.data.status // Update status if it changed
              }
            : p
        ));

        // Navigate to the workspace
        if (response.data.workspace?.ideUrl) {
          // If IDE URL exists, open in new tab
          window.open(response.data.workspace.ideUrl, '_blank');
        }
        // Always navigate to workspace page
        navigate(`/projects/${projectId}/workspace`);
      }
    } catch (error) {
      console.error('Error joining project:', error);
      // Show specific error message based on response
      let errorMessage = error.message;
      const response = error.response || {};

      if (response.status === 401) {
        errorMessage = 'Please log in to join this project.';
      } else if (response.status === 404) {
        errorMessage = 'This project no longer exists.';
      } else if (response.status === 400) {
        if (error.message.includes('already a member')) {
          // If already a member, just navigate to workspace
          navigate(`/projects/${projectId}/workspace`);
          return;
        } else if (error.message.includes('full')) {
          errorMessage = 'This project is already full.';
        } else if (error.message.includes('completed') || error.message.includes('paused')) {
          errorMessage = 'This project is not currently accepting new members.';
        }
      }
      alert(errorMessage);
    }
  };

  const handleViewProject = (projectId) => {
    // Navigate to project details
    window.open(`/projects/${projectId}`, '_blank');
  };

  const handleProjectCreated = (newProject) => {
    // Add the new project to the list
    setProjects(prev => [newProject, ...prev]);
    console.log('New project created:', newProject);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ProjectCard = ({ project }) => (
    <Card className="hover-lift transition-all duration-200 overflow-hidden group">
      {/* Card Header */}
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <CardTitle className="text-xl font-heading mb-2 group-hover:text-main transition-colors">
              {project.name}
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed line-clamp-2">
              {project.description}
            </CardDescription>
          </div>
          <Button variant="neutral" size="icon" className="p-1">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>

        {/* Status and Priority */}
        <div className="flex items-center gap-2 mb-4">
          <Badge
            variant={project.status === 'active' ? 'default' : project.status === 'completed' ? 'secondary' : 'outline'}
            className="text-xs"
          >
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </Badge>
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            {getDifficultyIcon(project.difficulty).icon}
            {getDifficultyIcon(project.difficulty).label}
          </Badge>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(project.technologies || []).slice(0, 3).map(tech => (
            <Badge key={tech} variant="outline" className="text-xs hover:bg-accent transition-colors">
              {tech}
            </Badge>
          ))}
          {(project.technologies || []).length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{project.technologies.length - 3} more
            </Badge>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-base font-medium">Progress</span>
            <span className="text-xs text-muted-foreground">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-3" />
        </div>

        {/* Team Members */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {(project.members?.avatars || []).slice(0, 3).map((avatar, index) => (
                <img
                  key={index}
                  src={avatar || `https://ui-avatars.com/api/?name=User+${index + 1}&background=random`}
                  alt={`Member ${index + 1}`}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                />
              ))}
              {(project.members?.current || 0) > 3 && (
                <div className="w-8 h-8 rounded-full bg-secondary-background border-2 border-border flex items-center justify-center shadow-sm">
                  <span className="text-xs font-medium text-muted-foreground">
                    +{(project.members?.current || 0) - 3}
                  </span>
                </div>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {project.members.current}/{project.members.max} members
            </span>
          </div>
        </div>

        {/* Project Info */}
        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-secondary-background rounded-lg">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Deadline</p>
              <p className="text-xs font-medium text-foreground">{formatDeadline(project.deadline)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Department</p>
              <p className="text-xs font-medium text-foreground">{project.department}</p>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <GitBranch className="w-3 h-3" />
            <span>{project.metrics.commits}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3" />
            <span>{project.metrics.stars}</span>
          </div>
        </div>

      </CardHeader>
      <CardContent className="pt-0 bg-muted/50 border-t border-border">
        <div className="flex gap-2">
          <Button
            onClick={() => handleJoinProject(project._id)}
            disabled={project.members.current >= project.members.max || project.status === 'completed'}
            className="flex-1 flex items-center justify-center gap-2"
            size="sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Join</span>
          </Button>
          <Button
            onClick={() => handleViewProject(project.id)}
            variant="neutral"
            className="flex items-center justify-center gap-2"
            size="sm"
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </Button>

          {project.workspace?.ideUrl && (
            <Button
              onClick={() => window.location.href = `/projects/${project.id}/workspace`}
              variant="default"
              className="flex items-center justify-center gap-2"
              size="sm"
            >
              <Code2 className="w-4 h-4" />
              <span>IDE</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading text-foreground">Projects</h1>
            <p className="text-muted-foreground mt-1">Discover and join exciting projects in your community</p>
          </div>
          <Button
            className="flex items-center gap-2"
            size="lg"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-5 h-5" />
            <span>Create Project</span>
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="hover-lift transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 pt-5">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search projects by name, description, or technology..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-2 border-2 border-border rounded-base bg-secondary-background text-foreground focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  <option value="all">All Projects</option>
                  <option value="active">Active</option>
                  <option value="recruiting">Recruiting</option>
                  <option value="planning">Planning</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="hover-lift transition-all duration-200">
            <CardContent className="p-6 pt-6  ">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-main rounded-base border-2 border-border">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-foreground font-base">Total Projects</p>
                  <p className="text-2xl font-heading">{projects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover-lift transition-all duration-200">
            <CardContent className="p-6 pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent rounded-base border-2 border-border">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-base">Active</p>
                  <p className="text-2xl font-heading">
                    {projects.filter(p => p.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover-lift transition-all duration-200">
            <CardContent className="p-6 pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-secondary rounded-base border-2 border-border">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-base">Recruiting</p>
                  <p className="text-2xl font-heading">
                    {projects.filter(p => p.status === 'recruiting').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover-lift transition-all duration-200">
            <CardContent className="p-6 pt-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent rounded-base border-2 border-border">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-base">Completed</p>
                  <p className="text-2xl font-heading">
                    {projects.filter(p => p.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-red-500 mb-2">{error}</h3>
            <p className="text-muted-foreground">Please try again or contact support if the problem persists</p>
          </div>
        )}

        {/* Projects Grid */}
        {!error && (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {filteredProjects.length === 0 && !error && (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-secondary-background rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </>
        )}

        {/* Create Project Modal */}
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onProjectCreated={handleProjectCreated}
          className="hover-lift transition-all duration-500"
        />

      </div>
    </div>
  );
};

export default Projects;

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { 
  ArrowLeft,
  Users,
  Settings,
  Play,
  Save,
  Share2,
  MessageSquare,
  Video,
  Terminal,
  FolderTree,
  Code2,
  Eye,
  Download,
  Github,
  Globe,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ProjectsAPI } from '../lib/api';

const ProjectWorkspace = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [collaborators, setCollaborators] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  useEffect(() => {
    if (activeTab === 'chat' && project?._id) {
      fetchMessages();
    }
  }, [projectId, activeTab, project]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add error handling for non-member access
  useEffect(() => {
    if (!loading && project && user && !project.members.userIds.includes(user.id)) {
      navigate('/projects');
      alert('You must join this project to access the workspace.');
    }
  }, [loading, project, user, navigate]);

  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);
      const response = await ProjectsAPI.getProjectMessages(projectId);
      if (response.ok) {
        setMessages(response.data.reverse()); // Show newest messages at the bottom
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await ProjectsAPI.sendProjectMessage(projectId, {
        message: newMessage,
        type: 'text'
      });

      if (response.ok) {
        setMessages(prev => [...prev, response.data]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const fetchProjectData = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await ProjectsAPI.get(projectId);
      
      if (!response.ok || !response.data) {
        throw new Error(response.message || 'Failed to load project');
      }
      
      // Check if user is a member
      if (!response.data.members.userIds.includes(user.id)) {
        throw new Error('Not a member');
      }
      
      setProject(response.data);
      // Set initial collaborator list with current user
      setCollaborators([{
        id: user.id,
        name: user.name,
        avatar: user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`,
        status: 'online'
      }]);

      // Fetch other collaborators in background
      try {
        const userPromises = response.data.members.userIds
          .filter(uid => uid !== user.id)
          .map(uid => ProjectsAPI.getUserProfile(uid));
        const users = await Promise.all(userPromises);
        setCollaborators(prev => [
          ...prev,
          ...users.map(u => ({
            id: u.data.id,
            name: u.data.name || 'Anonymous',
            avatar: u.data.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.data.name || 'Anonymous')}`,
            status: 'online'
          }))
        ]);
      } catch (collaboratorError) {
        console.error('Error fetching collaborators:', collaboratorError);
        // Don't fail the whole workspace if collaborator fetch fails
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      if (error.message === 'Not a member') {
        navigate('/projects');
        alert('You must join this project to access the workspace.');
      } else {
        alert(error.message || 'Failed to load project workspace');
        navigate('/projects');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRunProject = () => {
    if (project?.workspace?.ideUrl) {
      window.open(`${project.workspace.ideUrl}?view=preview`, '_blank');
    }
  };

  const handleShare = async () => {
    if (project?.workspace?.ideUrl) {
      await navigator.clipboard.writeText(project.workspace.ideUrl);
      alert('Project URL copied to clipboard!');
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-main border-t-transparent rounded-full animate-spin"></div>
              <span className="font-base">Loading project workspace...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!project || !project.name || !project.description || !project.technologies) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="font-heading text-lg mb-2">Project Not Found</h2>
            <p className="text-muted-foreground mb-4">The project data is incomplete or you don't have access to it.</p>
            <Button onClick={() => navigate('/projects')} variant="neutral">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-background`}>
      {/* Header */}
      <div className="border-b-2 border-border bg-background">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="neutral"
              size="sm"
              onClick={() => navigate('/projects')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {isFullscreen ? null : 'Back'}
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-main rounded-base border-2 border-border">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-heading text-lg">{project.name || 'Untitled Project'}</h1>
                <p className="text-sm text-muted-foreground">{project.description || 'No description available'}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {(project.technologies || []).map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Collaborators */}
            <div className="flex items-center gap-2 px-3 py-2 border-2 border-border rounded-base bg-muted/50">
              <div className="flex -space-x-2">
                {collaborators.slice(0, 3).map((collab) => (
                  <div key={collab.id} className="relative">
                    <img
                      src={collab.avatar}
                      alt={collab.name}
                      className="w-6 h-6 rounded-full border-2 border-border"
                    />
                    <div 
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-border ${
                        collab.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                    />
                  </div>
                ))}
              </div>
              <span className="text-xs font-base">
                {collaborators.length} online
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="neutral"
                size="sm"
                onClick={handleRunProject}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Run
              </Button>
              
              <Button
                variant="neutral"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>

              <Button
                variant="neutral"
                size="sm"
                onClick={toggleFullscreen}
                className="flex items-center gap-2"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                {isFullscreen ? 'Exit' : 'Fullscreen'}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 pb-2">
          <Button
            variant={activeTab === 'editor' ? 'default' : 'neutral'}
            size="sm"
            onClick={() => setActiveTab('editor')}
            className="flex items-center gap-2"
          >
            <Code2 className="w-4 h-4" />
            Editor
          </Button>
          <Button
            variant={activeTab === 'preview' ? 'default' : 'neutral'}
            size="sm"
            onClick={() => setActiveTab('preview')}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button
            variant={activeTab === 'terminal' ? 'default' : 'neutral'}
            size="sm"
            onClick={() => setActiveTab('terminal')}
            className="flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" />
            Terminal
          </Button>
          <Button
            variant={activeTab === 'chat' ? 'default' : 'neutral'}
            size="sm"
            onClick={() => setActiveTab('chat')}
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Team Chat
          </Button>
        </div>
      </div>

      {/* Main IDE Content */}
      <div className={`${isFullscreen ? 'h-[calc(100vh-140px)]' : 'h-[calc(100vh-200px)]'}`}>
        {activeTab === 'editor' && (
          <div className="h-full">
            <div className="h-full flex items-center justify-center">
              <Card>
                <CardContent className="p-6 text-center">
                  <Code2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading text-lg mb-2">Welcome to Your Project</h3>
                  <p className="text-muted-foreground mb-4">
                    The IDE interface is currently in development. Please check back soon!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="h-full">
            <div className="h-full flex items-center justify-center">
              <Card>
                <CardContent className="p-6 text-center">
                  <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading text-lg mb-2">Preview Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Project previews will be available in a future update.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'terminal' && (
          <div className="h-full bg-black text-green-500 p-4 font-mono text-sm overflow-y-auto">
            <div className="mb-2">
              <span className="text-blue-400">~/projects/{(project.name || 'untitled').toLowerCase().replace(/\s+/g, '-')}</span>
              <span className="text-white"> $ </span>
            </div>
            <div className="mb-4 text-gray-300">
              Welcome to SkillSync Collaborative Terminal<br/>
              Project: {project.name || 'Untitled Project'}<br/>
              Type 'help' for available commands.<br/>
            </div>
            <div className="mb-2">
              <span className="text-blue-400">~/projects/{(project.name || 'untitled').toLowerCase().replace(/\s+/g, '-')}</span>
              <span className="text-white"> $ npm install</span>
            </div>
            <div className="text-gray-300 mb-2">
              Installing dependencies...<br/>
              ✓ React@18.2.0<br/>
              ✓ TypeScript@5.0.0<br/>
              ✓ All dependencies installed successfully!<br/>
            </div>
            <div className="mb-2">
              <span className="text-blue-400">~/projects/{(project.name || 'untitled').toLowerCase().replace(/\s+/g, '-')}</span>
              <span className="text-white"> $ </span>
              <span className="animate-pulse">|</span>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="h-full flex">
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {project.messages?.map((message) => (
                    <div key={message.id} className="flex items-start gap-3">
                      <img
                        src={message.userAvatar}
                        alt={message.userName}
                        className="w-8 h-8 rounded-full border-2 border-border"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-base font-medium text-sm">{message.userName}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <Card className="inline-block max-w-2xl">
                          <CardContent className="p-3">
                            {message.type === 'code' ? (
                              <pre className="bg-secondary-background p-2 rounded text-sm overflow-x-auto">
                                <code className={`language-${message.codeBlock?.language || 'plaintext'}`}>
                                  {message.codeBlock?.content || message.message}
                                </code>
                              </pre>
                            ) : (
                              <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 border-t-2 border-border">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="w-80 border-l-2 border-border p-4">
              <h3 className="font-heading text-sm mb-3">Team Members</h3>
              <div className="space-y-2">
                {collaborators.map((collab) => (
                  <div key={collab.id} className="flex items-center gap-3 p-2 rounded-base hover:bg-muted/50">
                    <div className="relative">
                      <img
                        src={collab.avatar}
                        alt={collab.name}
                        className="w-8 h-8 rounded-full border-2 border-border"
                      />
                      <div 
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-border ${
                          collab.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-base font-medium text-sm">{collab.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{collab.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectWorkspace;
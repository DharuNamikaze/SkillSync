import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import websocketService from '../services/websocketService';
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
  Minimize2,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ProjectsAPI } from "../lib/api";

const ProjectWorkspace = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Load active tab from localStorage or default to "editor"
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem(`workspace-tab-${projectId}`);
    return saved || "editor";
  });
  const [collaborators, setCollaborators] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const chatEndRef = useRef(null);
  const editorFrameRef = useRef(null);
  const previewFrameRef = useRef(null);

  useEffect(() => {
    fetchProjectData();
    setSandboxLoading(true); // Start loading when component mounts
  }, [projectId]);

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    if (projectId) {
      localStorage.setItem(`workspace-tab-${projectId}`, activeTab);
    }
  }, [activeTab, projectId]);

  // Fetch messages when project is loaded (always load messages in background)
  useEffect(() => {
    if (projectId) {
      fetchMessages();
    }
  }, [projectId]);

  // WebSocket for real-time team chat
  useEffect(() => {
    if (!projectId || !user) return;

    const cleanupFns = [];

    // Join project room
    websocketService.joinProject(projectId);
    console.log(`Joined workspace chat for project: ${projectId}`);

    // Project message listener
    cleanupFns.push(
      websocketService.onProjectMessage(projectId, (message) => {
        console.log('✅ Received workspace message via WebSocket:', message);
        
        setMessages(prev => {
          // Remove optimistic message with temp ID if it exists
          const withoutTemp = prev.filter(m => !m.id?.startsWith('temp-'));
          
          // Check if real message already exists (prevent duplicates)
          if (withoutTemp.some(m => m.id === message.id)) {
            console.log('Message already exists, skipping:', message.id);
            return prev;
          }
          
          // Transform WebSocket message format
          const transformedMessage = {
            id: message.id,
            message: message.content || message.message,
            userName: message.sender?.name || message.userName,
            userAvatar: message.sender?.avatar || message.userAvatar,
            userId: message.sender?.id || message.userId,
            timestamp: message.timestamp,
            type: message.type || 'text',
            codeBlock: message.codeBlock
          };
          
          console.log('Adding new workspace message to state');
          return [...withoutTemp, transformedMessage];
        });
      })
    );

    return () => {
      // Cleanup WebSocket listeners
      cleanupFns.forEach(cleanup => cleanup());
      
      // Leave project room
      websocketService.leaveProject(projectId);
      console.log(`Left workspace chat for project: ${projectId}`);
    };
  }, [projectId, user?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add error handling for non-member access
  useEffect(() => {
    if (
      !loading &&
      project &&
      user &&
      !project.members.userIds.includes(user.id)
    ) {
      navigate("/projects");
      alert("You must join this project to access the workspace.");
    }
  }, [loading, project, user, navigate]);

  const fetchMessages = async () => {
    if (!projectId) {
      console.warn('No projectId provided for fetching messages');
      return;
    }

    try {
      setLoadingMessages(true);
      console.log('📥 [WORKSPACE] Fetching messages for project:', projectId);
      const response = await ProjectsAPI.getProjectMessages(projectId);
      console.log('📥 [WORKSPACE] Messages response:', response);
      
      if (response.ok) {
        let messagesData = response.data;
        
        // Ensure we have an array
        if (!Array.isArray(messagesData)) {
          console.warn('[WORKSPACE] Response data is not an array:', messagesData);
          messagesData = [];
        }
        
        console.log('📥 [WORKSPACE] Raw messages count:', messagesData.length);
        
        // Transform messages to match expected format
        const transformedMessages = messagesData.map(msg => {
          return {
            id: msg.id || msg._id,
            message: msg.content || msg.message, // content comes first from API
            userName: msg.sender?.name || msg.userName,
            userAvatar: msg.sender?.avatar || msg.userAvatar,
            userId: msg.sender?.id || msg.userId,
            timestamp: msg.timestamp || msg.createdAt,
            type: msg.type || 'text',
            codeBlock: msg.codeBlock
          };
        });
        
        console.log('✅ [WORKSPACE] Setting', transformedMessages.length, 'messages to state');
        setMessages(transformedMessages);
      } else {
        console.error('[WORKSPACE] API response not ok:', response);
        setMessages([]);
      }
    } catch (error) {
      console.error("❌ [WORKSPACE] Error fetching messages:", error);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messageContent = newMessage.trim();
      setNewMessage('');
      
      console.log('📤 Sending project message via WebSocket...');
      await websocketService.sendProjectMessage(projectId, messageContent);
      console.log('✅ Message sent successfully');
    } catch (error) {
      console.error("❌ Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const fetchProjectData = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await ProjectsAPI.get(projectId);

      if (!response.ok || !response.data) {
        throw new Error(response.message || "Failed to load project");
      }

      // Check if user is a member
      if (!response.data.members.userIds.includes(user.id)) {
        throw new Error("Not a member");
      }

      setProject(response.data);
      // Set initial collaborator list with current user
      setCollaborators([
        {
          id: user.id,
          name: user.name,
          avatar:
            user.picture ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`,
          status: "online",
        },
      ]);

      // Fetch other collaborators in background
      try {
        const userPromises = response.data.members.userIds
          .filter((uid) => uid !== user.id)
          .map((uid) => ProjectsAPI.getUserProfile(uid));
        const users = await Promise.all(userPromises);
        setCollaborators((prev) => [
          ...prev,
          ...users.map((u) => ({
            id: u.data.id,
            name: u.data.name || "Anonymous",
            avatar:
              u.data.picture ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                u.data.name || "Anonymous"
              )}`,
            status: "online",
          })),
        ]);
      } catch (collaboratorError) {
        console.error("Error fetching collaborators:", collaboratorError);
        // Don't fail the whole workspace if collaborator fetch fails
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      if (error.message === "Not a member") {
        navigate("/projects");
        alert("You must join this project to access the workspace.");
      } else {
        alert(error.message || "Failed to load project workspace");
        navigate("/projects");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (project?.workspace?.ideUrl) {
      await navigator.clipboard.writeText(project.workspace.ideUrl);
      alert("Project URL copied to clipboard!");
    }
  };

  const toggleFullscreen = async () => {
    const workspaceElement = document.getElementById('project-workspace');
    
    if (!document.fullscreenElement) {
      // Enter fullscreen
      try {
        await workspaceElement?.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Error entering fullscreen:', err);
      }
    } else {
      // Exit fullscreen
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error('Error exiting fullscreen:', err);
      }
    }
  };

  // Listen for fullscreen changes (user can exit with ESC key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

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

  if (
    !project ||
    !project.name ||
    !project.description ||
    !project.technologies
  ) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="font-heading text-lg mb-2">Project Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The project data is incomplete or you don't have access to it.
            </p>
            <Button onClick={() => navigate("/projects")} variant="neutral">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Derive embed URLs for editor and preview
  const embedEditorUrl =
    project?.workspace?.embedUrl ||
    (project?.workspace?.sandboxId
      ? `https://codesandbox.io/p/sandbox/${project.workspace.sandboxId}`
      : null);
  const embedPreviewUrl =
    project?.workspace?.previewUrl ||
    (project?.workspace?.sandboxId
      ? `https://codesandbox.io/p/sandbox/${project.workspace.sandboxId}?view=preview`
      : embedEditorUrl);

  return (
    <div
      id="project-workspace"
      className={`${
        isFullscreen ? "fixed inset-0 z-50" : "min-h-screen"
      } bg-background`}
    >
      {/* Header */}
      <div className="border-b-2 border-border bg-background">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="neutral"
              size="sm"
              onClick={() => navigate("/projects")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {isFullscreen ? null : "Back"}
            </Button>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-main rounded-base border-2 border-border">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-heading text-lg">
                  {project.name || "Untitled Project"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {project.description || "No description available"}
                </p>
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
                        collab.status === "online"
                          ? "bg-green-500"
                          : "bg-yellow-500"
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
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
                {isFullscreen ? "Exit" : "Fullscreen"}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 pb-2">
          <Button
            variant={activeTab === "editor" ? "default" : "neutral"}
            size="sm"
            onClick={() => setActiveTab("editor")}
            className="flex items-center gap-2"
          >
            <Code2 className="w-4 h-4" />
            Editor
          </Button>
          <Button
            variant={activeTab === "preview" ? "default" : "neutral"}
            size="sm"
            onClick={() => setActiveTab("preview")}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button
            variant={activeTab === "terminal" ? "default" : "neutral"}
            size="sm"
            onClick={() => setActiveTab("terminal")}
            className="flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" />
            Terminal
          </Button>
          <Button
            variant={activeTab === "chat" ? "default" : "neutral"}
            size="sm"
            onClick={() => setActiveTab("chat")}
            className="flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            Team Chat
          </Button>
        </div>
      </div>

      {/* Main IDE Content */}
      <div
        className={`${
          isFullscreen ? "h-[calc(100vh-140px)]" : "h-[calc(100vh-200px)]"
        } relative`}
      >
        {/* Editor Tab - Keep mounted but hide */}
        <div
          className={`h-full ${activeTab === "editor" ? "block" : "hidden"}`}
        >
          {embedEditorUrl ? (
            <>
              {sandboxLoading && activeTab === "editor" && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="w-12 h-12 border-4 border-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="font-base text-sm">
                        Loading CodeSandbox IDE...
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
              <iframe
                ref={editorFrameRef}
                title="CodeSandbox Editor"
                src={embedEditorUrl}
                className="w-full h-full bg-white"
                allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write; fullscreen; display-capture"
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                onLoad={() => setSandboxLoading(false)}
              />
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Code2 className="w-12 h-12 text-muted-foreground mx-auto animate-bounce" />
                  <h3 className="font-heading text-lg mb-2">
                    Workspace Initializing
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Your collaborative IDE is being prepared.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    This usually takes 10-15 seconds. Please wait...
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Preview Tab - Keep mounted but hide */}
        <div
          className={`h-full ${activeTab === "preview" ? "block" : "hidden"}`}
        >
          {embedPreviewUrl ? (
            <iframe
              ref={previewFrameRef}
              title="CodeSandbox Preview"
              src={embedPreviewUrl}
              className="w-full h-full bg-white"
              allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write; fullscreen; display-capture"
              sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-heading text-lg mb-2">
                    Preview Unavailable
                  </h3>
                  <p className="text-muted-foreground">
                    No running preview is available for this workspace yet.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Terminal Tab */}
        <div
          className={`h-full ${activeTab === "terminal" ? "block" : "hidden"}`}
        >
          <div className="h-full bg-black text-green-500 p-4 font-mono text-sm overflow-y-auto">
            <div className="mb-2">
              <span className="text-blue-400">
                ~/projects/
                {(project.name || "untitled")
                  .toLowerCase()
                  .replace(/\s+/g, "-")}
              </span>
              <span className="text-white"> $ </span>
            </div>
            <div className="mb-4 text-gray-300">
              Welcome to SkillSync Collaborative Terminal
              <br />
              Project: {project.name || "Untitled Project"}
              <br />
              Type 'help' for available commands.
              <br />
            </div>
            <div className="mb-2">
              <span className="text-blue-400">
                ~/projects/
                {(project.name || "untitled")
                  .toLowerCase()
                  .replace(/\s+/g, "-")}
              </span>
              <span className="text-white"> $ npm install</span>
            </div>
            <div className="text-gray-300 mb-2">
              Installing dependencies...
              <br />
              ✓ React@18.2.0
              <br />
              ✓ TypeScript@5.0.0
              <br />
              ✓ All dependencies installed successfully!
              <br />
            </div>
            <div className="mb-2">
              <span className="text-blue-400">
                ~/projects/
                {(project.name || "untitled")
                  .toLowerCase()
                  .replace(/\s+/g, "-")}
              </span>
              <span className="text-white"> $ </span>
              <span className="animate-pulse">|</span>
            </div>
          </div>
        </div>

        {/* Chat Tab */}
        <div className={`h-full ${activeTab === "chat" ? "flex" : "hidden"}`}>
          <div className="h-full flex">
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto bg-muted/20">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-main border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Loading messages...</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No messages yet</p>
                          <p className="text-xs text-muted-foreground mt-1">Start the conversation!</p>
                        </div>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isCurrentUser = message.userId === user?.id;
                        return (
                          <div key={message.id} className={`flex items-start gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                            <img
                              src={message.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.userName)}`}
                              alt={message.userName}
                              className="w-8 h-8 rounded-full border-2 border-border flex-shrink-0"
                            />
                            <div className={`flex-1 ${isCurrentUser ? 'flex flex-col items-end' : ''}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-base font-medium text-sm">
                                  {isCurrentUser ? 'You' : message.userName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <Card className={`inline-block max-w-2xl ${isCurrentUser ? 'bg-main text-white' : ''}`}>
                                <CardContent className="p-3">
                                  {message.type === "code" ? (
                                    <pre className="bg-secondary-background p-2 rounded text-sm overflow-x-auto">
                                      <code
                                        className={`language-${
                                          message.codeBlock?.language || "plaintext"
                                        }`}
                                      >
                                        {message.codeBlock?.content ||
                                          message.message}
                                      </code>
                                    </pre>
                                  ) : (
                                    <p className="text-sm whitespace-pre-wrap break-words">
                                      {message.message}
                                    </p>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}
              </div>

              <div className="p-4 border-t-2 border-border bg-background">
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
                  <Input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    Send
                  </Button>
                </form>
              </div>
            </div>

            <div className="w-80 border-l-2 border-border p-4">
              <h3 className="font-heading text-sm mb-3">Team Members</h3>
              <div className="space-y-2">
                {collaborators.map((collab) => (
                  <div
                    key={collab.id}
                    className="flex items-center gap-3 p-2 rounded-base hover:bg-muted/50"
                  >
                    <div className="relative">
                      <img
                        src={collab.avatar}
                        alt={collab.name}
                        className="w-8 h-8 rounded-full border-2 border-border"
                      />
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-border ${
                          collab.status === "online"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-base font-medium text-sm">
                        {collab.name}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {collab.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectWorkspace;

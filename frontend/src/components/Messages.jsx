import React, { useState, useEffect, useRef } from "react";
import { Send, Paperclip, Users, Folder, Search } from "lucide-react";
import websocketService from '../services/websocketService';
import { useAuth } from '../AuthContext';
import { ProjectsAPI } from '../lib/api';

function Messages() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch user's projects
  useEffect(() => {
    let mounted = true;
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectsResponse = await ProjectsAPI.userProjects();
        if (mounted) {
          setProjects(projectsResponse.data || []);
          if (projectsResponse.data?.length > 0) {
            setActiveProject(projectsResponse.data[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        if (mounted) {
          setError('Failed to load projects. Please try again later.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch messages when active project changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeProject) return;
      
      try {
        setLoading(true);
        setMessages([]);
        
        console.log('Fetching project messages for:', activeProject.id);
        const response = await ProjectsAPI.getProjectMessages(activeProject.id);
        
        console.log('Project messages response:', response);
        
        if (!response.data) {
          console.error('No data in response:', response);
          throw new Error('No data received from server');
        }

        if (!Array.isArray(response.data)) {
          console.error('Response data is not an array:', response.data);
          throw new Error('Invalid response format from server');
        }

        // Transform messages if needed
        const validMessages = response.data.map(message => {
          if (message.message && message.userId && !message.content) {
            return {
              id: message.id || message._id,
              content: message.message,
              timestamp: message.timestamp || message.createdAt,
              sender: {
                id: message.userId,
                name: message.userName,
                avatar: message.userAvatar
              },
              type: message.type || 'text',
              codeBlock: message.codeBlock
            };
          }
          return message;
        }).filter(message => {
          const isValid = message &&
            message.id &&
            message.content &&
            message.sender &&
            message.sender.id &&
            message.sender.name;

          if (!isValid) {
            console.warn('Invalid message format:', message);
          }

          return isValid;
        });

        if (validMessages.length < response.data.length) {
          console.warn(`Filtered ${response.data.length - validMessages.length} invalid messages`);
        }

        setMessages(validMessages);

      } catch (error) {
        console.error('Error loading messages:', error);
        setError(error.message || 'Failed to load messages');
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    return () => {
      setMessages([]);
      setLoading(true);
    };
  }, [activeProject?.id]);

  // Handle WebSocket connections for project chat
  useEffect(() => {
    if (!activeProject) return;

    const cleanupFns = [];

    // Join project room
    websocketService.joinProject(activeProject.id);
    console.log(`Joined project room: ${activeProject.id}`);

    // Project message listener
    cleanupFns.push(
      websocketService.onProjectMessage(activeProject.id, (message) => {
        console.log('✅ Received project message via WebSocket:', message);
        setMessages(prev => {
          // Remove optimistic message with temp ID if it exists
          const withoutTemp = prev.filter(m => !m.id.startsWith('temp-'));
          
          // Check if real message already exists (prevent duplicates)
          if (withoutTemp.some(m => m.id === message.id)) {
            console.log('Message already exists, skipping:', message.id);
            return prev;
          }
          
          console.log('Adding new message to state');
          return [...withoutTemp, message];
        });
      })
    );

    // Project typing indicator
    cleanupFns.push(
      websocketService.onProjectTyping(activeProject.id, (userId, isTyping) => {
        // Handle typing indicator if needed
        console.log(`User ${userId} is ${isTyping ? 'typing' : 'stopped typing'}`);
      })
    );

    return () => {
      // Cleanup WebSocket listeners
      cleanupFns.forEach(cleanup => cleanup());
      
      // Leave project room
      if (activeProject?.id) {
        websocketService.leaveProject(activeProject.id);
        console.log(`Left project room: ${activeProject.id}`);
      }
    };
  }, [activeProject?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeProject) return;

    try {
      setNewMessage('');
      
      console.log('📤 Sending project message via WebSocket...');
      await websocketService.sendProjectMessage(activeProject.id, newMessage.trim());
      console.log('✅ Message sent successfully');

    } catch (error) {
      console.error('❌ Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Filter projects based on search
  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex flex-1 overflow-hidden">
        {/* Error Notification */}
        {error && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md shadow-sm flex items-center space-x-2 z-50">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}
        
        {/* Sidebar - Project List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Project Chats</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-lg bg-gray-200 animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map(project => (
                    <button
                      key={project.id}
                      className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                        activeProject?.id === project.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setActiveProject(project)}
                    >
                      <div className="relative">
                        <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Folder className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-medium text-gray-900 truncate">{project.name}</h3>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {project.members.current}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{project.department}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No projects found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="hidden md:flex flex-col flex-1 bg-gray-50">
          {activeProject ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Folder className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{activeProject.name}</h3>
                    <p className="text-xs text-gray-500">
                      {activeProject.members.current} team members • {activeProject.department}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[70%] bg-gray-200 rounded-lg p-3 animate-pulse`}>
                          <div className="h-4 w-32 rounded"></div>
                          <div className="h-3 w-24 mt-2 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {messages.map(message => {
                      const isCurrentUser = message.sender?.id === user?.id;
                      const messageKey = message.id || `msg-${message.timestamp}`;
                      return (
                        <div key={messageKey} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                          <div className="flex items-end space-x-2 max-w-[70%]">
                            {!isCurrentUser && (
                              <img 
                                src={message.sender.avatar} 
                                alt={message.sender.name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            )}
                            
                            <div className={`flex-1 ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-white'} rounded-lg px-4 py-2 shadow-sm`}>
                              {!isCurrentUser && (
                                <div className="text-xs font-semibold mb-1">
                                  {message.sender.name}
                                </div>
                              )}
                              <p className="break-words">{message.content}</p>
                              <div className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                                {formatTimestamp(message.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <button 
                    type="button" 
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Paperclip className="h-5 w-5 text-gray-600" />
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto bg-gray-100 rounded-full p-6 w-24 h-24 flex items-center justify-center">
                  <Folder className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-700">Select a project</h3>
                <p className="mt-2 text-gray-500">Choose a project from the list to view team chat</p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile: No project selected message */}
        <div className="flex md:hidden flex-1 items-center justify-center bg-gray-50 p-6">
          <div className="text-center">
            <div className="mx-auto bg-gray-100 rounded-full p-6 w-24 h-24 flex items-center justify-center">
              <Folder className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="mt-4 text-xl font-medium text-gray-700">Project Chats</h3>
            <p className="mt-2 text-gray-500">Select a project from the list to view team messages</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messages;

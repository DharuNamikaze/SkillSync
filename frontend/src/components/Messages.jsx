import React, { useState, useEffect, useRef } from "react";
import { Search, Send, Paperclip, MoreVertical, Phone, Video, User, Clock, Check, CheckCheck, Plus, XCircle, Users, Folder } from "lucide-react";
import UserSearchDialog from './UserSearchDialog';
import UserProfilePopup from './UserProfilePopup';
import websocketService from '../services/websocketService';
import { useAuth } from '../AuthContext';
import { MessagesAPI } from '../lib/MessagesAPI';
import { ProjectsAPI, UsersAPI } from '../lib/api';
import { UserProfilePopup } from './UserProfilePopup';

function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // Can be a project or conversation
  const [chatType, setChatType] = useState(null); // 'project' or 'private'
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch conversations and projects
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch projects the user is a member of
        const projectsResponse = await ProjectsAPI.userProjects();
        if (mounted) {
          setProjects(projectsResponse.data || []);
        }

        // Fetch private conversations
        const conversationsResponse = await MessagesAPI.getConversations();
        if (mounted) {
          setConversations(conversationsResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (mounted) {
          setError('Failed to load conversations and projects. Please try again later.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    
    // Poll for updates every 30 seconds
    const pollInterval = setInterval(fetchData, 30000);

    return () => {
      mounted = false;
      clearInterval(pollInterval);
    };
  }, []);

  // Set first conversation as active when conversations are loaded
  useEffect(() => {
    if (conversations.length > 0 && !activeChat) {
      setActiveChat(conversations[0]);
      setChatType('private');
    }
  }, [conversations, activeChat]);

    // Fetch messages when active chat changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat) return;
      
      try {
        setLoading(true);
        setMessages([]); // Clear previous messages while loading
        
        let response;
        if (chatType === 'private') {
          response = await MessagesAPI.getConversation(activeChat.user.id);
          websocketService.markMessagesAsRead(activeChat.user.id);
        } else if (chatType === 'project') {
          console.log('Fetching project messages for:', activeChat.id);
          response = await ProjectsAPI.getProjectMessages(activeChat.id);
        }
        
        console.log('Project messages response:', response);
        
        if (!response.data) {
          console.error('No data in response:', response);
          throw new Error('No data received from server');
        }

        if (!Array.isArray(response.data)) {
          console.error('Response data is not an array:', response.data);
          throw new Error('Invalid response format from server');
        }

        // Transform messages if needed and validate required fields
        const validMessages = response.data.map(message => {
          // If message is in old format, transform it
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

        

        setMessages(validMessages.reverse());

      } catch (error) {
        console.error('Error loading messages:', error);
        setError(error.message || 'Failed to load messages');
        setMessages([]); // Clear messages on error
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Clear messages when chat changes
    return () => {
      setMessages([]);
      setLoading(true);
    };
  }, [activeChat?.id, activeChat?.user?.id, chatType]); // Only depend on user ID to prevent unnecessary rerenders

  // Handle WebSocket connections and message updates
  useEffect(() => {
    if (!activeChat || chatType !== 'private') return;

    const cleanupFns = [];

    // Connection status handler
    cleanupFns.push(
      websocketService.addConnectionHandler((connected) => {
        console.log(`WebSocket ${connected ? 'connected' : 'disconnected'}`);
      })
    );

    // Message listener
    cleanupFns.push(
      websocketService.onMessage(activeChat.user.id, (message) => {
        setMessages(prev => {
          // Check if message already exists (prevent duplicates)
          if (prev.some(m => m.id === message.id)) {
            return prev.map(m => m.id === message.id ? { ...m, ...message } : m);
          }
          return [...prev, message];
        });
        
        // Mark messages as read since chat is open
        websocketService.markMessagesAsRead(activeChat.user.id);
      })
    );

    // Typing indicator listener
    cleanupFns.push(
      websocketService.onTyping(activeChat.user.id, (isTyping) => {
        setTypingUsers(prev => {
          const next = new Set(prev);
          if (isTyping) {
            next.add(activeChat.user.id);
          } else {
            next.delete(activeChat.user.id);
          }
          return next;
        });
      })
    );

    // Read receipt listener
    cleanupFns.push(
      websocketService.onMessagesRead(activeChat.user.id, () => {
        setMessages(prev => 
          prev.map(msg => 
            msg.sender.id === user.id ? { ...msg, status: 'read' } : msg
          )
        );
      })
    );

    return () => {
      cleanupFns.forEach(cleanup => cleanup());
      setTypingUsers(new Set()); // Clear typing indicators on cleanup
    };
  }, [activeChat?.user?.id, chatType, user?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Error notification component
  const ErrorNotification = ({ message, onDismiss }) => {
    if (!message) return null;
    
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md shadow-sm flex items-center space-x-2">
        <span>{message}</span>
        <button
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700 focus:outline-none"
        >
          <XCircle className="h-5 w-5" />
        </button>
      </div>
    );
  };

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const timestamp = new Date();
    const messageId = `temp-${timestamp.getTime()}`;
    const optimisticMessage = {
      id: messageId,
      sender: user,
      content: newMessage.trim(),
      timestamp,
      status: 'sending'
    };

    if (chatType === 'private') {
      optimisticMessage.recipient = activeChat.user;
    } else {
      optimisticMessage.projectId = activeChat.id;
    }

    try {
      // Add optimistic message
      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage('');

      if (chatType === 'private') {
        // Send via WebSocket for private messages
        await websocketService.sendMessage(activeChat.user.id, optimisticMessage.content);
      } else {
        // Send project message via API
        await ProjectsAPI.sendProjectMessage(activeChat.id, {
          message: optimisticMessage.content,
          userName: user.name,
          userAvatar: user.picture || user.avatar
        });
      }
      
      // Update message status to sent
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, status: 'sent' }
            : msg
        )
      );

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update message status to error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, status: 'error', error: error.message }
            : msg
        )
      );
      
      setError('Failed to send message. Please try again.');
    }
  };

  // Handle user profile click in project chat
  const handleUserProfileClick = async (userId) => {
    try {
      const response = await UsersAPI.get(userId);
      setSelectedUser(response.data);
      setShowUserProfile(true);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user profile');
    }
  };

  // Handle starting a private chat from profile
  const handleStartPrivateChat = (user) => {
    const existingConversation = conversations.find(conv => conv.user.id === user.id);
    
    if (existingConversation) {
      setActiveChat(existingConversation);
    } else {
      const newConversation = {
        id: `conv-${user.id}`,
        user: {
          id: user.id,
          name: user.name,
          avatar: user.picture || user.avatar,
          status: 'offline',
          lastSeen: null
        },
        unreadCount: 0,
        lastMessage: null
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setActiveChat(newConversation);
    }
    
    setChatType('private');
    setShowUserProfile(false);
  };

  // Format timestamp to readable format
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffDays = Math.floor((now - messageDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today, show time
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return "Yesterday";
    } else if (diffDays < 7) {
      // Within a week, show day name
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older, show date
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conv => 
    conv.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render message status icon
  const renderMessageStatus = (status) => {
    switch(status) {
      case "sending":
        return <Clock className="h-3 w-3 text-gray-400" />;
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="flex flex-1 overflow-hidden">
        {/* Error Notification */}
        <ErrorNotification 
          message={error} 
          onDismiss={() => setError(null)} 
        />
        
        {/* Sidebar - Conversation List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
            <button
              onClick={() => setShowUserSearch(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Start new conversation"
            >
              <Plus className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="mt-2 relative">
            <input
              type="text"
              placeholder="Search conversations"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              // Loading skeleton
              <div className="p-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {/* Projects Section */}
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-600 flex items-center">
                    <Folder className="h-4 w-4 mr-1" />
                    Project Chats
                  </h3>
                </div>
                {projects
                  .filter(project => project.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(project => (
                    <button
                      key={project.id}
                      className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                        activeChat?.id === project.id && chatType === 'project' ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        setActiveChat(project);
                        setChatType('project');
                        setSelectedUser(null);
                      }}
                    >
                      <div className="relative">
                        <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-medium text-gray-900 truncate">{project.name}</h3>
                          <span className="text-xs text-gray-500">{project.members.current} members</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{project.department}</p>
                      </div>
                    </button>
                  ))}

                {/* Private Chats Section */}
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-600 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Private Messages
                  </h3>
                </div>
                {filteredConversations.length > 0 ? (
                  filteredConversations.map(conversation => (
                    <button
                      key={conversation.id}
                      className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                        activeChat?.id === conversation.id && chatType === 'private' ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => {
                        setActiveChat(conversation);
                        setChatType('private');
                      }}
                    >
                      <div className="relative">
                        <img 
                          src={conversation.user.avatar} 
                          alt={conversation.user.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                          conversation.user.status === 'online' ? 'bg-green-500' : 
                          conversation.user.status === 'away' ? 'bg-yellow-500' : 
                          'bg-gray-400'
                        }`}></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-medium text-gray-900 truncate">{conversation.user.name}</h3>
                          <span className="text-xs text-gray-500">{formatTimestamp(conversation.lastMessage?.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage?.text}</p>
                      </div>
                      {Number(conversation.unreadCount) > 0 && (
                        <span className="bg-blue-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                          {Number(conversation.unreadCount)}
                        </span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No private conversations found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="hidden md:flex flex-col flex-1 bg-gray-50">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {chatType === 'private' ? (
                    <>
                      <img 
                        src={activeChat.user.avatar} 
                        alt={activeChat.user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{activeChat.user.name}</h3>
                        <p className="text-xs text-gray-500">
                          {activeChat.user.status === 'online' 
                            ? 'Online' 
                            : activeChat.user.status === 'away'
                              ? 'Away'
                              : `Last seen ${formatTimestamp(activeChat.user.lastSeen)}`
                          }
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{activeChat.name}</h3>
                        <p className="text-xs text-gray-500">
                          {activeChat.members.current} team members • {activeChat.department}
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  {chatType === 'private' && (
                    <>
                      <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <Phone className="h-5 w-5 text-gray-600" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <Video className="h-5 w-5 text-gray-600" />
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => {
                      if (chatType === 'project') {
                        setShowUserSearch(true);
                      }
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  // Loading skeleton for messages
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[70%] ${i % 2 === 0 ? 'bg-gray-200' : 'bg-gray-200'} rounded-lg p-3 animate-pulse`}>
                          <div className="h-4 w-32 rounded"></div>
                          <div className="h-3 w-24 mt-2 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  messages.map(message => {
                    const isCurrentUser = message.sender.id === user.id;
                    return (
                      <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-white'} rounded-lg px-4 py-2 shadow-sm`}>
                          <p>{message.sender.name}: {message.content}</p>
                          <div className={`text-xs mt-1 flex items-center justify-end space-x-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                            <span>{formatTimestamp(message.timestamp)}</span>
                            {isCurrentUser && renderMessageStatus(message.status)}
                          </div>
                        </div>
                      </div>
                    );
                  })
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
                  <User className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="mt-4 text-xl font-medium text-gray-700">Select a conversation</h3>
                <p className="mt-2 text-gray-500">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile: No conversation selected message */}
        <div className="flex md:hidden flex-1 items-center justify-center bg-gray-50 p-6">
          <div className="text-center">
            <div className="mx-auto bg-gray-100 rounded-full p-6 w-24 h-24 flex items-center justify-center">
              <User className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="mt-4 text-xl font-medium text-gray-700">Your Messages</h3>
            <p className="mt-2 text-gray-500">Select a conversation from the list to view and reply to your messages</p>
          </div>
        </div>
      </div>

      {/* User Search Dialog */}
      {showUserSearch && (
        <UserSearchDialog
          onClose={() => setShowUserSearch(false)}
          onSelectUser={(user) => {
            if (chatType === 'project') {
              handleUserProfileClick(user.id);
            } else {
              // Start new conversation
              setConversations(prev => {
                const exists = prev.find(conv => conv.user.id === user.id);
                if (exists) {
                  setActiveChat(exists);
                  setChatType('private');
                  return prev;
                }

                const newConversation = {
                  id: `conv-${user.id}`,
                  user: {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    status: 'offline',
                    lastSeen: null
                  },
                  unreadCount: 0,
                  lastMessage: null
                };
                
                setActiveChat(newConversation);
                setChatType('private');
                return [newConversation, ...prev];
              });
            }
            setShowUserSearch(false);
          }}
        />
      )}

      {/* User Profile Popup */}
      {showUserProfile && selectedUser && (
        <UserProfilePopup
          user={selectedUser}
          onClose={() => {
            setShowUserProfile(false);
            setSelectedUser(null);
          }}
          onStartChat={handleStartPrivateChat}
        />
      )}
    </div>
  );
}

export default Messages;
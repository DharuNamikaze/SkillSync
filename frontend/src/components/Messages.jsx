import React, { useState, useEffect, useRef } from "react";
import { Search, Send, Paperclip, MoreVertical, Phone, Video, User, Clock, Check, CheckCheck } from "lucide-react";

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Simulate fetching conversations from API
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data that would come from your backend
      const mockConversations = [
        {
          id: "conv-1",
          user: {
            id: "user-1",
            name: "Alex Johnson",
            avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff",
            status: "online",
            lastSeen: null
          },
          unreadCount: 3,
          lastMessage: {
            text: "Hey, are you available for a quick project review?",
            timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
          }
        },
        {
          id: "conv-2",
          user: {
            id: "user-2",
            name: "Sarah Williams",
            avatar: "https://ui-avatars.com/api/?name=Sarah+Williams&background=6366F1&color=fff",
            status: "offline",
            lastSeen: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
          },
          unreadCount: 0,
          lastMessage: {
            text: "Thanks for your help with the UI design!",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) // 3 hours ago
          }
        },
        {
          id: "conv-3",
          user: {
            id: "user-3",
            name: "Michael Chen",
            avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=10B981&color=fff",
            status: "online",
            lastSeen: null
          },
          unreadCount: 0,
          lastMessage: {
            text: "I've pushed the latest code changes to the repository.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
          }
        },
        {
          id: "conv-4",
          user: {
            id: "user-4",
            name: "Emily Rodriguez",
            avatar: "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=F59E0B&color=fff",
            status: "away",
            lastSeen: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
          },
          unreadCount: 1,
          lastMessage: {
            text: "Can we schedule a call to discuss the project timeline?",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
          }
        },
        {
          id: "conv-5",
          user: {
            id: "user-5",
            name: "David Kim",
            avatar: "https://ui-avatars.com/api/?name=David+Kim&background=EF4444&color=fff",
            status: "offline",
            lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 hours ago
          },
          unreadCount: 0,
          lastMessage: {
            text: "I'll send you the project requirements document tomorrow.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
          }
        }
      ];
      
      setConversations(mockConversations);
      setLoading(false);
    };

    fetchConversations();
  }, []);

  // Set first conversation as active when conversations are loaded
  useEffect(() => {
    if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0]);
    }
  }, [conversations, activeConversation]);

  // Simulate fetching messages when active conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversation) return;
      
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Generate mock messages based on conversation ID
      const mockMessages = generateMockMessages(activeConversation.id);
      setMessages(mockMessages);
      setLoading(false);
    };

    fetchMessages();
  }, [activeConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Generate mock messages for a conversation
  const generateMockMessages = (conversationId) => {
    const currentUser = { id: "current-user", name: "You" };
    const otherUser = conversations.find(conv => conv.id === conversationId)?.user;
    
    if (!otherUser) return [];
    
    // Generate a different conversation based on the conversation ID
    switch(conversationId) {
      case "conv-1": // Alex Johnson
        return [
          {
            id: "msg-1-1",
            sender: otherUser,
            text: "Hi there! I was wondering if you could help me with a React component I'm building.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
            status: "read"
          },
          {
            id: "msg-1-2",
            sender: currentUser,
            text: "Sure, I'd be happy to help. What kind of component are you working on?",
            timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55 minutes ago
            status: "read"
          },
          {
            id: "msg-1-3",
            sender: otherUser,
            text: "It's a data visualization component that needs to handle real-time updates. I'm having trouble with the state management.",
            timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
            status: "read"
          },
          {
            id: "msg-1-4",
            sender: currentUser,
            text: "Have you tried using useReducer for complex state logic? Or maybe a context provider if you need to share the state across components?",
            timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
            status: "read"
          },
          {
            id: "msg-1-5",
            sender: otherUser,
            text: "I haven't tried useReducer yet. That's a good suggestion. Do you have time for a quick call to go over the implementation?",
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            status: "read"
          },
          {
            id: "msg-1-6",
            sender: otherUser,
            text: "I've also been looking at some libraries like Redux or MobX, but I'm not sure if that would be overkill for this project.",
            timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
            status: "read"
          },
          {
            id: "msg-1-7",
            sender: currentUser,
            text: "For a single component, Redux might be overkill. Let's start with useReducer and see if that solves your problem.",
            timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
            status: "read"
          },
          {
            id: "msg-1-8",
            sender: otherUser,
            text: "Hey, are you available for a quick project review?",
            timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
            status: "delivered"
          }
        ];
      case "conv-2": // Sarah Williams
        return [
          {
            id: "msg-2-1",
            sender: currentUser,
            text: "Hi Sarah, I've finished the UI mockups for the dashboard. Would you like to review them?",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
            status: "read"
          },
          {
            id: "msg-2-2",
            sender: otherUser,
            text: "Yes, please send them over! I'm excited to see what you've come up with.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.5), // 4.5 hours ago
            status: "read"
          },
          {
            id: "msg-2-3",
            sender: currentUser,
            text: "Here you go! I've attached the Figma link. Let me know what you think.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
            status: "read"
          },
          {
            id: "msg-2-4",
            sender: otherUser,
            text: "These look amazing! I love the color scheme and the layout is very intuitive.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5), // 3.5 hours ago
            status: "read"
          },
          {
            id: "msg-2-5",
            sender: otherUser,
            text: "Thanks for your help with the UI design!",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
            status: "read"
          }
        ];
      case "conv-3": // Michael Chen
        return [
          {
            id: "msg-3-1",
            sender: otherUser,
            text: "Hey, I'm working on the backend API for our project. Do you have the endpoint specifications ready?",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30), // 30 hours ago
            status: "read"
          },
          {
            id: "msg-3-2",
            sender: currentUser,
            text: "I'm still finalizing them, but I can send you what I have so far. Give me a few minutes.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 29), // 29 hours ago
            status: "read"
          },
          {
            id: "msg-3-3",
            sender: currentUser,
            text: "Here's the preliminary API spec. I'll update you when I have the final version.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 28), // 28 hours ago
            status: "read"
          },
          {
            id: "msg-3-4",
            sender: otherUser,
            text: "Thanks! This gives me enough to get started. I'll implement the basic structure and we can refine it later.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26), // 26 hours ago
            status: "read"
          },
          {
            id: "msg-3-5",
            sender: otherUser,
            text: "I've pushed the latest code changes to the repository.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
            status: "read"
          }
        ];
      case "conv-4": // Emily Rodriguez
        return [
          {
            id: "msg-4-1",
            sender: otherUser,
            text: "Hi! I wanted to discuss the project timeline. We might need to adjust some deadlines.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
            status: "read"
          },
          {
            id: "msg-4-2",
            sender: currentUser,
            text: "What's causing the delay? Is there anything I can help with?",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.8), // 3.8 hours ago
            status: "read"
          },
          {
            id: "msg-4-3",
            sender: otherUser,
            text: "We're waiting on some assets from the design team, and there were some unexpected technical challenges with the integration.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.5), // 3.5 hours ago
            status: "read"
          },
          {
            id: "msg-4-4",
            sender: currentUser,
            text: "I see. Let me know which specific assets you're waiting for, and I can follow up with the design team.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
            status: "read"
          },
          {
            id: "msg-4-5",
            sender: otherUser,
            text: "Can we schedule a call to discuss the project timeline?",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            status: "delivered"
          }
        ];
      case "conv-5": // David Kim
        return [
          {
            id: "msg-5-1",
            sender: currentUser,
            text: "Hi David, do you have the project requirements document ready?",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
            status: "read"
          },
          {
            id: "msg-5-2",
            sender: otherUser,
            text: "I'm still working on finalizing it. There are a few details I need to confirm with the client.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 70), // ~3 days ago
            status: "read"
          },
          {
            id: "msg-5-3",
            sender: currentUser,
            text: "No problem. When do you think it will be ready? I'd like to start planning my work.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 65), // ~2.7 days ago
            status: "read"
          },
          {
            id: "msg-5-4",
            sender: otherUser,
            text: "I should have it by tomorrow. Sorry for the delay!",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 60), // 2.5 days ago
            status: "read"
          },
          {
            id: "msg-5-5",
            sender: otherUser,
            text: "I'll send you the project requirements document tomorrow.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
            status: "read"
          }
        ];
      default:
        return [];
    }
  };

  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const newMsg = {
      id: `msg-new-${Date.now()}`,
      sender: { id: "current-user", name: "You" },
      text: newMessage,
      timestamp: new Date(),
      status: "sending"
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");

    // Simulate message sending and status updates
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMsg.id ? { ...msg, status: "sent" } : msg
        )
      );
      
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMsg.id ? { ...msg, status: "delivered" } : msg
          )
        );
      }, 1000);
    }, 1000);
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
        {/* Sidebar - Conversation List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
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
            {loading && !conversations.length ? (
              // Loading skeleton for conversations
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
                {filteredConversations.length > 0 ? (
                  filteredConversations.map(conversation => (
                    <button
                      key={conversation.id}
                      className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-center space-x-3 ${activeConversation?.id === conversation.id ? 'bg-blue-50' : ''}`}
                      onClick={() => setActiveConversation(conversation)}
                    >
                      <div className="relative">
                        <img 
                          src={conversation.user.avatar} 
                          alt={conversation.user.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${conversation.user.status === 'online' ? 'bg-green-500' : conversation.user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'}`}></span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-medium text-gray-900 truncate">{conversation.user.name}</h3>
                          <span className="text-xs text-gray-500">{formatTimestamp(conversation.lastMessage?.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage?.text}</p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No conversations found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="hidden md:flex flex-col flex-1 bg-gray-50">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={activeConversation.user.avatar} 
                    alt={activeConversation.user.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{activeConversation.user.name}</h3>
                    <p className="text-xs text-gray-500">
                      {activeConversation.user.status === 'online' 
                        ? 'Online' 
                        : activeConversation.user.status === 'away'
                          ? 'Away'
                          : `Last seen ${formatTimestamp(activeConversation.user.lastSeen)}`
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Phone className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Video className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
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
                    const isCurrentUser = message.sender.id === "current-user";
                    return (
                      <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-white'} rounded-lg px-4 py-2 shadow-sm`}>
                          <p>{message.text}</p>
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
    </div>
  );
}

export default Messages;
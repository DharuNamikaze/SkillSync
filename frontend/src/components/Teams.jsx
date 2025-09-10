import React, { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Search, 
  MessageSquare, 
  Calendar, 
  Settings, 
  ChevronRight, 
  Plus,
  X,
  Check,
  AlertCircle
} from "lucide-react";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamData, setNewTeamData] = useState({
    name: "",
    description: "",
    isPublic: true
  });
  const [activeTab, setActiveTab] = useState("my-teams");
  
  // Simulate API call to fetch teams data
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data that would come from your backend
      const mockTeams = [
        {
          id: "team-001",
          name: "Full‑stack Guild",
          description: "A collaborative team focused on full-stack development practices and knowledge sharing.",
          members: 8,
          avatar: "https://ui-avatars.com/api/?name=Full+Stack+Guild&background=0D8ABC&color=fff",
          unreadMessages: 3,
          isJoined: true,
          upcomingMeetings: 1,
          tags: ["web-development", "javascript", "react", "node"]
        },
        {
          id: "team-002",
          name: "UI/UX Collective",
          description: "Designers and developers working together to create beautiful and functional user experiences.",
          members: 5,
          avatar: "https://ui-avatars.com/api/?name=UI+UX+Collective&background=6366F1&color=fff",
          unreadMessages: 0,
          isJoined: true,
          upcomingMeetings: 0,
          tags: ["design", "user-experience", "figma", "prototyping"]
        },
        {
          id: "team-003",
          name: "Data Science Hub",
          description: "Exploring data analysis, machine learning, and AI applications for real-world problems.",
          members: 12,
          avatar: "https://ui-avatars.com/api/?name=Data+Science+Hub&background=10B981&color=fff",
          unreadMessages: 0,
          isJoined: false,
          upcomingMeetings: 2,
          tags: ["python", "machine-learning", "data-analysis", "ai"]
        },
        {
          id: "team-004",
          name: "Mobile Dev Crew",
          description: "Focused on iOS, Android, and cross-platform mobile application development.",
          members: 7,
          avatar: "https://ui-avatars.com/api/?name=Mobile+Dev+Crew&background=F59E0B&color=fff",
          unreadMessages: 0,
          isJoined: false,
          upcomingMeetings: 1,
          tags: ["mobile", "react-native", "flutter", "swift"]
        },
        {
          id: "team-005",
          name: "DevOps & Cloud",
          description: "Sharing best practices for CI/CD, infrastructure as code, and cloud services.",
          members: 9,
          avatar: "https://ui-avatars.com/api/?name=DevOps+Cloud&background=8B5CF6&color=fff",
          unreadMessages: 0,
          isJoined: true,
          upcomingMeetings: 0,
          tags: ["aws", "docker", "kubernetes", "ci-cd"]
        }
      ];
      
      setTeams(mockTeams);
      setLoading(false);
    };

    fetchTeams();
  }, []);

  // Filter teams based on search query and active tab
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         team.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === "my-teams") {
      return matchesSearch && team.isJoined;
    } else if (activeTab === "discover") {
      return matchesSearch && !team.isJoined;
    }
    return matchesSearch;
  });

  // Handle team join/leave
  const toggleTeamMembership = (teamId) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        return { ...team, isJoined: !team.isJoined };
      }
      return team;
    }));
  };

  // Handle create team form submission
  const handleCreateTeam = (e) => {
    e.preventDefault();
    
    // In a real app, you would send this data to your backend
    const newTeam = {
      id: `team-${Date.now()}`,
      name: newTeamData.name,
      description: newTeamData.description,
      members: 1,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newTeamData.name)}&background=3B82F6&color=fff`,
      unreadMessages: 0,
      isJoined: true,
      upcomingMeetings: 0,
      tags: []
    };
    
    setTeams([...teams, newTeam]);
    setShowCreateModal(false);
    setNewTeamData({ name: "", description: "", isPublic: true });
    setActiveTab("my-teams");
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-1/6 animate-pulse"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded w-full animate-pulse"></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
              <div className="flex justify-between">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
            <p className="text-gray-600 mt-1">Collaborate with others on projects and skills</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Team</span>
          </button>
        </div>

        {/* Search and Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search teams by name, description or tags..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'my-teams' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('my-teams')}
              >
                My Teams
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'discover' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('discover')}
              >
                Discover
              </button>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        {filteredTeams.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTeams.map(team => (
              <div key={team.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img 
                      src={team.avatar} 
                      alt={team.name} 
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{team.name}</h3>
                      <p className="text-sm text-gray-500">{team.members} members</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{team.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {team.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {team.isJoined && (
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      {team.unreadMessages > 0 ? (
                        <div className="flex items-center text-blue-600">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          <span>{team.unreadMessages} new messages</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          <span>No new messages</span>
                        </div>
                      )}
                      {team.upcomingMeetings > 0 ? (
                        <div className="flex items-center text-orange-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{team.upcomingMeetings} upcoming</span>
                        </div>
                      ) : null}
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors">
                      {team.isJoined ? 'View Details' : 'Learn More'}
                    </button>
                    <button 
                      onClick={() => toggleTeamMembership(team.id)}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${team.isJoined ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      {team.isJoined ? 'Leave Team' : 'Join Team'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {searchQuery ? 'No teams found' : activeTab === 'my-teams' ? 'You haven\'t joined any teams yet' : 'No teams to discover'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? `No teams match your search "${searchQuery}". Try a different search term.` 
                : activeTab === 'my-teams' 
                  ? 'Join existing teams or create your own to collaborate with others.'
                  : 'All available teams are already joined. Create a new team to get started.'}
            </p>
            {!searchQuery && activeTab === 'my-teams' && (
              <button 
                onClick={() => setActiveTab('discover')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Discover Teams
              </button>
            )}
            {!searchQuery && activeTab === 'discover' && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create a Team
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">Create New Team</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTeam} className="p-6 space-y-6">
              <div>
                <label htmlFor="team-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name*
                </label>
                <input
                  type="text"
                  id="team-name"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g. Web Development Squad"
                  value={newTeamData.name}
                  onChange={(e) => setNewTeamData({...newTeamData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label htmlFor="team-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <textarea
                  id="team-description"
                  rows="3"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="What is this team about?"
                  value={newTeamData.description}
                  onChange={(e) => setNewTeamData({...newTeamData, description: e.target.value})}
                  required
                ></textarea>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-2">Privacy</span>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-4 w-4 text-blue-600"
                      name="privacy"
                      checked={newTeamData.isPublic}
                      onChange={() => setNewTeamData({...newTeamData, isPublic: true})}
                    />
                    <span className="ml-2 text-sm text-gray-700">Public</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-4 w-4 text-blue-600"
                      name="privacy"
                      checked={!newTeamData.isPublic}
                      onChange={() => setNewTeamData({...newTeamData, isPublic: false})}
                    />
                    <span className="ml-2 text-sm text-gray-700">Private</span>
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {newTeamData.isPublic 
                    ? "Anyone can discover and join this team." 
                    : "Only people with invitation can join this team."}
                </p>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTeamData.name || !newTeamData.description}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teams;



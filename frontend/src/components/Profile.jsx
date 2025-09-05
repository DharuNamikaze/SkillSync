import React, { useState } from 'react';
import { User, Mail, MapPin, Calendar, Github, Linkedin, ExternalLink, Edit3, Plus, Star, Clock, Users } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data - in real app this would come from props/context/API
  const [userData, setUserData] = useState({
    name: 'Jane Doe',
    title: 'Full-stack Developer',
    bio: 'Passionate about MERN stack and team collaboration. I love creating seamless user experiences and building scalable applications.',
    email: 'jane.doe@example.com',
    joinDate: 'January 2023',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    skills: [
      { name: 'React', level: 'Expert', category: 'Frontend' },
      { name: 'Node.js', level: 'Advanced', category: 'Backend' },
      { name: 'Express', level: 'Advanced', category: 'Backend' },
      { name: 'MongoDB', level: 'Intermediate', category: 'Database' },
      { name: 'TypeScript', level: 'Advanced', category: 'Language' },
      { name: 'Figma', level: 'Intermediate', category: 'Design' },
      { name: 'Docker', level: 'Intermediate', category: 'DevOps' },
      { name: 'AWS', level: 'Beginner', category: 'Cloud' }
    ],
    projects: [
      {
        id: 1,
        name: 'SkillSync Platform',
        role: 'Team Lead',
        description: 'A collaborative platform for skill sharing and team building',
        status: 'Active',
        technologies: ['React', 'Node.js', 'MongoDB'],
        startDate: '2024-01',
        teamSize: 5
      },
      {
        id: 2,
        name: 'Realtime Chat',
        role: 'Backend Developer',
        description: 'Real-time messaging application with WebSocket support',
        status: 'Completed',
        technologies: ['Socket.io', 'Express', 'Redis'],
        startDate: '2023-09',
        teamSize: 3
      },
      {
        id: 3,
        name: 'E-commerce Dashboard',
        role: 'Full-stack Developer',
        description: 'Analytics dashboard for e-commerce businesses',
        status: 'In Progress',
        technologies: ['React', 'TypeScript', 'PostgreSQL'],
        startDate: '2024-03',
        teamSize: 2
      }
    ],
    socialLinks: {
      github: 'https://github.com/janedoe',
      linkedin: 'https://linkedin.com/in/janedoe'
    },
    stats: {
      projectsCompleted: 12,
      totalCommits: 1247,
      yearsExperience: 3
    }
  });

  const getSkillColor = (level) => {
    const colors = {
      'Expert': 'bg-green-100 text-green-800 border-green-200',
      'Advanced': 'bg-blue-100 text-blue-800 border-blue-200',
      'Intermediate': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Beginner': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[level] || colors['Beginner'];
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Completed': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-orange-100 text-orange-800',
      'On Hold': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors['Active'];
  };

  const groupedSkills = userData.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const StatCard = ({ icon: Icon, label, value, color = 'blue' }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg bg-${color}-100`}>
          <Icon className={`w-5 h-5 text-${color}-600`} />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const ProjectCard = ({ project }) => (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-3">
        <h4 className="text-lg font-semibold text-gray-900">{project.name}</h4>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-3">{project.role}</p>
      <p className="text-gray-700 mb-4">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.map(tech => (
          <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
            {tech}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{project.startDate}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{project.teamSize} members</span>
          </span>
        </div>
        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
          <ExternalLink className="w-4 h-4" />
          <span>View</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 -mt-16">
              <img
                src={userData.avatar}
                alt={userData.name}
                className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl object-cover"
              />
              <div className="flex-1 pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{userData.name}</h1>
                    <p className="text-xl text-gray-600 mb-3">{userData.title}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{userData.email}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {userData.joinDate}</span>
                      </span>
                    </div>
                    <p className="text-gray-700 max-w-2xl">{userData.bio}</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4 mt-4">
                  <a href={userData.socialLinks.github} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Github className="w-5 h-5 text-gray-600" />
                  </a>
                  <a href={userData.socialLinks.linkedin} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Linkedin className="w-5 h-5 text-gray-600" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={Star}
            label="Projects Completed"
            value={userData.stats.projectsCompleted}
            color="green"
          />
          <StatCard
            icon={Github}
            label="Total Commits"
            value={userData.stats.totalCommits.toLocaleString()}
            color="purple"
          />
          <StatCard
            icon={Clock}
            label="Years Experience"
            value={userData.stats.yearsExperience}
            color="blue"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'projects', label: 'Projects' },
                { id: 'skills', label: 'Skills' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-gray-900">Completed E-commerce Dashboard milestone</p>
                        <p className="text-sm text-gray-500">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-gray-900">Added TypeScript to skillset</p>
                        <p className="text-sm text-gray-500">1 week ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Projects ({userData.projects.length})</h3>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {userData.projects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Skills & Technologies</h3>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Add Skill</span>
                  </button>
                </div>
                <div className="space-y-8">
                  {Object.entries(groupedSkills).map(([category, skills]) => (
                    <div key={category}>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">{category}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {skills.map(skill => (
                          <div key={skill.name} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-900">{skill.name}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSkillColor(skill.level)}`}>
                                {skill.level}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
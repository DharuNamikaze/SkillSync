import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../AuthContext";
import { Mail, Calendar, Github, Linkedin, ExternalLink, Edit3, Plus, Star, Clock, Users } from 'lucide-react';
import { UsersAPI, SkillsAPI, ProjectsAPI } from "../lib/api";
import AddSkillModal from './AddSkillModal';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddSkillModalOpen, setIsAddSkillModalOpen] = useState(false);
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, sRes, projRes] = await Promise.all([
          UsersAPI.profile().catch(() => null),
          SkillsAPI.list().catch(() => ({ data: [] })),
          ProjectsAPI.userProjects().catch(() => ({ data: [] })),
        ]);
        setProfile(pRes?.data || null);
        setSkills(sRes?.data || []);
        setProjects(projRes?.data || []);
      } catch (_) {}
    };
    load();
  }, []);

  const userData = {
    name: profile?.name || user?.name || user?.given_name || 'User',
    email: profile?.email || user?.email || '',
    avatar: profile?.picture || user?.picture || '/api/placeholder/150/150',
    title: profile?.title || '',
    bio: profile?.bio || '',
    joinDate: new Date(profile?.createdAt || Date.now()).toLocaleDateString(),
    socialLinks: profile?.socialLinks || {},
    skills: skills,
    projects: projects.map(p => ({
      id: p.id,
      name: p.name,
      role: p.createdBy === user?.sub ? 'Owner' : 'Member',
      status: p.status === 'active' ? 'Active' : p.status === 'completed' ? 'Completed' : p.status,
      description: p.description,
      technologies: p.technologies || [],
      startDate: new Date(p.createdAt).toLocaleDateString()
    })),
    stats: {
      projectsCompleted: projects.filter(p => p.status === 'completed').length,
      totalCommits: 0,
      yearsExperience: 0
    },
    ...profile
  };

  const getSkillColor = (level) => {
    const colors = {
      'Expert': 'bg-green-100/80 text-green-700 border-green-200',
      'Advanced': 'bg-blue-100/80 text-blue-700 border-blue-200',
      'Intermediate': 'bg-amber-100/80 text-amber-700 border-amber-200',
      'Beginner': 'bg-slate-100/80 text-slate-700 border-slate-200'
    };
    return colors[level] || colors['Beginner'];
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-green-100/80 text-green-700',
      'Completed': 'bg-blue-100/80 text-blue-700',
      'In Progress': 'bg-amber-100/80 text-amber-700',
      'On Hold': 'bg-slate-100/80 text-slate-700'
    };
    return colors[status] || colors['Active'];
  };

  const groupedSkills = (userData.skills || []).reduce((acc, skill) => {
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
    <div className="group bg-white rounded-2xl p-6 border-2 border-border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{project.name}</h4>
          <p className="text-gray-600 mt-1">{project.role}</p>
        </div>
        <span className={`px-4 py-1.5 rounded-xl text-sm font-medium ${getStatusColor(project.status)}`}>
          {project.status}
        </span>
      </div>

      <p className="text-gray-700 mb-6">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {(project.technologies || []).map(tech => (
          <span 
            key={tech} 
            className="px-3 py-1.5 bg-gray-100 text-gray-800 text-sm rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{project.startDate}</span>
          </span>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
          <ExternalLink className="w-4 h-4" />
          <span>View Project</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 rounded-2xl">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-border hover:shadow-xl transition-shadow duration-300">
          <div className="h-48 bg-gradient-to-r from-main via-purple-600 to-blue-600 relative">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 -mt-24">
              <div className="relative group">
                <img
                  src={userData.avatar}
                  alt={userData.name}
                  className="w-40 h-40 rounded-2xl border-4 border-white shadow-xl object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900">
                      {userData.name}
                    </h1>
                    <p className="text-xl text-gray-600 mt-2">{userData.title}</p>
                    <div className="mt-6 flex flex-wrap items-center gap-4">
                      <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl shadow-sm">
                        <Mail className="w-5 h-5 text-gray-500 mr-2" />
                        <span className="text-gray-800">{userData.email}</span>
                      </div>
                      <div className="flex items-center bg-gray-50 px-4 py-2 rounded-xl shadow-sm">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                        <span className="text-gray-800">Joined {userData.joinDate}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 max-w-2xl mt-6 leading-relaxed">{userData.bio}</p>
                  </div>
                  <Link
                    to="/profile/edit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-main text-white rounded-xl hover:bg-main/90 transition-colors font-semibold shadow-lg hover:shadow-main/25"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </Link>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4 mt-4">
                  <a 
                    href={userData.socialLinks.github} 
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 group"
                  >
                    <Github className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </a>
                  <a 
                    href={userData.socialLinks.linkedin} 
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 group"
                  >
                    <Linkedin className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border-2 border-border shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-100 text-green-600 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Projects Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{userData.stats.projectsCompleted}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-border shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-100 text-purple-600 group-hover:scale-110 transition-transform duration-300">
                <Github className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Commits</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{userData.stats.totalCommits.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border-2 border-border shadow-sm hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Years Experience</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{userData.stats.yearsExperience}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-border">
          <div className="border-b-2 border-border">
            <nav className="flex space-x-1 p-2">
              {[
                { id: 'overview', label: 'Overview', icon: Users },
                { id: 'projects', label: 'Projects', icon: Star },
                { id: 'skills', label: 'Skills', icon: Clock }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
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
                  <h3 className="text-xl font-semibold text-gray-900">Projects ({(userData.projects || []).length})</h3>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {(userData.projects || []).map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Skills & Technologies</h3>
                  <button
                    onClick={() => setIsAddSkillModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Skill</span>
                  </button>
                </div>
                <div className="space-y-8">
                  {Object.entries(groupedSkills).map(([category, skills]) => (
                    <div key={category} className="group">
                      <h4 className="text-xl font-bold text-gray-900 mb-6">
                        {category}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {skills.map(skill => (
                          <div 
                            key={skill.name} 
                            className="group bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <span className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {skill.name}
                                </span>
                              </div>
                              <span className={`ml-4 px-3 py-1.5 rounded-xl text-sm font-medium ${getSkillColor(skill.level)}`}>
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

        {/* Add Skill Modal */}
        <AddSkillModal
          isOpen={isAddSkillModalOpen}
          onClose={() => setIsAddSkillModalOpen(false)}
          onSkillAdded={(newSkill) => {
            // Update skills list with the new skill
            setSkills(prev => [...prev, newSkill]);
            // Show success message
            alert('Skill added successfully!');
          }}
        />
      </div>
    </div>
  );
};

export default Profile;
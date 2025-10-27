import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Code2, 
  Globe, 
  Server, 
  Database, 
  Smartphone,
  Palette,
  X,
  Check,
  Rocket,
  Zap
} from 'lucide-react';
import { ProjectsAPI } from '../lib/api';

const PROJECT_TEMPLATES = [
  {
    id: 'react-app',
    name: 'React App',
    description: 'Modern React application with TypeScript and Vite',
    icon: <Code2 className="w-6 h-6" />,
    technologies: ['React', 'TypeScript', 'Vite', 'TailwindCSS'],
    color: 'bg-blue-100',
    sandboxTemplate: 'react-ts'
  },
  {
    id: 'vue-app',
    name: 'Vue.js App',
    description: 'Vue 3 application with Composition API',
    icon: <Globe className="w-6 h-6" />,
    technologies: ['Vue.js', 'TypeScript', 'Vite'],
    color: 'bg-green-100',
    sandboxTemplate: 'vue-ts'
  },
  {
    id: 'nodejs-api',
    name: 'Node.js API',
    description: 'RESTful API with Express and TypeScript',
    icon: <Server className="w-6 h-6" />,
    technologies: ['Node.js', 'Express', 'TypeScript', 'MongoDB'],
    color: 'bg-yellow-100',
    sandboxTemplate: 'node'
  },
  {
    id: 'fullstack-app',
    name: 'Full-Stack App',
    description: 'React frontend with Node.js backend',
    icon: <Database className="w-6 h-6" />,
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    color: 'bg-purple-100',
    sandboxTemplate: 'react-ts'
  },
  {
    id: 'mobile-app',
    name: 'React Native',
    description: 'Cross-platform mobile application',
    icon: <Smartphone className="w-6 h-6" />,
    technologies: ['React Native', 'TypeScript', 'Expo'],
    color: 'bg-pink-100',
    sandboxTemplate: 'react-native'
  },
  {
    id: 'ui-library',
    name: 'UI Component Library',
    description: 'Reusable component library with Storybook',
    icon: <Palette className="w-6 h-6" />,
    technologies: ['React', 'Storybook', 'TailwindCSS'],
    color: 'bg-orange-100',
    sandboxTemplate: 'react-ts'
  }
];

const DIFFICULTY_LEVELS = [
  { id: 'beginner', label: 'Beginner', description: 'Perfect for learning', color: 'bg-green-500' },
  { id: 'intermediate', label: 'Intermediate', description: 'Some experience required', color: 'bg-yellow-500' },
  { id: 'advanced', label: 'Advanced', description: 'Expert level project', color: 'bg-red-500' }
];

const CreateProjectModal = ({ isOpen, onOpenChange, onProjectCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template: null,
    difficulty: 'intermediate',
    maxMembers: 5,
    isPublic: true,
    technologies: [],
    department: 'Engineering',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), // yyyy-mm-dd for input
    tags: []
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTemplateSelect = (template) => {
    setFormData(prev => ({
      ...prev,
      template: template,
      technologies: template.technologies
    }));
  };

  const handleTechnologyToggle = (tech) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.includes(tech)
        ? prev.technologies.filter(t => t !== tech)
        : [...prev.technologies, tech]
    }));
  };

  const handleCreateProject = async () => {
    if (!formData.name.trim() || !formData.template) {
      alert('Please fill in all required fields and select a template');
      return;
    }

    setLoading(true);
    try {
      // Validate required fields
      if (!formData.name || !formData.template || !formData.difficulty || !formData.maxMembers || !formData.deadline || !formData.department) {
        throw new Error('Please fill in all required fields');
      }

      // Create project via API
      const projectData = {
        name: formData.name.trim(),
        description: (formData.description || 'No description provided.').trim(),
        technologies: formData.technologies || [],
        maxMembers: Number(formData.maxMembers),
        deadline: new Date(formData.deadline).toISOString(),
        department: formData.department.trim(),
        difficulty: formData.difficulty,
        tags: formData.tags || [],
        templateId: formData.template.id,
        sandboxTemplate: formData.template.sandboxTemplate,
        isPublic: formData.isPublic
      };

      const result = await ProjectsAPI.create(projectData);
        
      // Initialize IDE workspace (already handled by backend)
      await initializeIDEWorkspace(result.data);
      
      onProjectCreated(result.data);
      onOpenChange(false);
      
      // Redirect to project workspace
      window.location.href = `/projects/${result.data.id}/workspace`;
    } catch (error) {
      console.error('Error creating project:', error);
      alert(`Failed to create project: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const initializeIDEWorkspace = async (project) => {
    // This will initialize the collaborative IDE workspace
    // We'll implement the actual IDE integration in the next steps
    console.log('Initializing IDE workspace for project:', project.id);
    return Promise.resolve();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
<DialogContent className="w-96 max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Rocket className="w-6 h-6 text-main" />
            Create New Project
          </DialogTitle>
          <DialogDescription>
            Set up your collaborative coding project with an integrated IDE workspace
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Project Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-base font-medium mb-2 block">
                Project Name *
              </label>
              <Input
                placeholder="Enter your project name..."
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-base font-medium mb-2 block">
                Description
              </label>
              <textarea
                placeholder="Describe your project goals and features..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full h-20 px-3 py-2 border-2 border-border rounded-base bg-secondary-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              />
            </div>
          </div>

          {/* Project Templates */}
          <div>
            <label className="text-sm font-base font-medium mb-3 block">
              Choose Template *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PROJECT_TEMPLATES.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all duration-200 hover-lift ${
                    formData.template?.id === template.id 
                      ? 'ring-2 ring-main ring-offset-2' 
                      : ''
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardHeader className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-base ${template.color} border-2 border-border`}>
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {template.description}
                        </CardDescription>
                      </div>
                      {formData.template?.id === template.id && (
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 bg-main rounded-full flex items-center justify-center border-2 border-border">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-wrap gap-1">
                      {template.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {template.technologies.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Project Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Difficulty Level */}
            <div>
              <label className="text-sm font-base font-medium mb-3 block">
                Difficulty Level
              </label>
              <div className="space-y-2">
                {DIFFICULTY_LEVELS.map((level) => (
                  <Card
                    key={level.id}
                    className={`cursor-pointer transition-all duration-200 hover-lift p-3 ${
                      formData.difficulty === level.id 
                        ? 'ring-2 ring-main ring-offset-1' 
                        : ''
                    }`}
                    onClick={() => handleInputChange('difficulty', level.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${level.color}`}></div>
                      <div className="flex-1">
                        <p className="font-base font-medium text-sm">{level.label}</p>
                        <p className="text-xs text-muted-foreground">{level.description}</p>
                      </div>
                      {formData.difficulty === level.id && (
                        <Check className="w-4 h-4 text-main" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Team & Meta Settings */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-base font-medium mb-2 block">
                  Maximum Team Members
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="neutral"
                    size="sm"
                    onClick={() => handleInputChange('maxMembers', Math.max(1, formData.maxMembers - 1))}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={formData.maxMembers}
                    onChange={(e) => handleInputChange('maxMembers', parseInt(e.target.value) || 1)}
                    className="w-20 text-center"
                    min="1"
                    max="20"
                  />
                  <Button
                    variant="neutral"
                    size="sm"
                    onClick={() => handleInputChange('maxMembers', Math.min(20, formData.maxMembers + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-base font-medium mb-2 block">Department</label>
                <Input
                  placeholder="e.g., Engineering"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-base font-medium mb-2 block">Deadline</label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleInputChange('deadline', e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-border"
                />
                <label htmlFor="isPublic" className="text-sm font-base">
                  Make project publicly discoverable
                </label>
              </div>
            </div>
          </div>

          {/* Selected Technologies */}
          {formData.technologies.length > 0 && (
            <div>
              <label className="text-sm font-base font-medium mb-3 block">
                Technologies ({formData.technologies.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="default"
                    className="flex items-center gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => handleTechnologyToggle(tech)}
                  >
                    {tech}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="neutral"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateProject}
            disabled={loading || !formData.name.trim() || !formData.template}
            className="flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            {loading ? 'Creating...' : 'Create Project & Launch IDE'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
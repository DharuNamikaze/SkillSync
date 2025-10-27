import fetch from 'node-fetch';

interface CodeSandboxTemplate {
  [key: string]: {
    template: string;
    title: string;
    description: string;
    tags: string[];
  };
}

const SANDBOX_TEMPLATES: CodeSandboxTemplate = {
  'react-app': {
    template: 'create-react-app-typescript',
    title: 'React TypeScript App',
    description: 'React application with TypeScript and modern tooling',
    tags: ['react', 'typescript', 'vite']
  },
  'vue-app': {
    template: 'vue-ts',
    title: 'Vue TypeScript App',
    description: 'Vue 3 application with Composition API',
    tags: ['vue', 'typescript']
  },
  'nodejs-api': {
    template: 'node',
    title: 'Node.js API',
    description: 'Express.js API with TypeScript',
    tags: ['nodejs', 'express', 'typescript']
  },
  'fullstack-app': {
    template: 'create-react-app-typescript',
    title: 'Full-Stack Application',
    description: 'React frontend with Node.js backend setup',
    tags: ['react', 'nodejs', 'fullstack']
  },
  'mobile-app': {
    template: 'react-native',
    title: 'React Native App',
    description: 'Cross-platform mobile application',
    tags: ['react-native', 'mobile']
  },
  'ui-library': {
    template: 'create-react-app-typescript',
    title: 'UI Component Library',
    description: 'Component library with Storybook',
    tags: ['react', 'storybook', 'components']
  }
};

export class CodeSandboxService {
  private apiKey: string;
  private apiUrl = 'https://codesandbox.io/api/v1';

  constructor() {
    this.apiKey = process.env.CODESANDBOX_API_KEY || '';
  }

  async createSandbox(projectData: {
    templateId: string;
    name: string;
    description: string;
    technologies: string[];
  }) {
    const template = SANDBOX_TEMPLATES[projectData.templateId];
    
    if (!template) {
      throw new Error(`Unknown template: ${projectData.templateId}`);
    }

    try {
      // If no API key, skip sandbox creation to avoid mock data
      if (!this.apiKey) {
        return null as any;
      }

      const sandboxData = {
        title: projectData.name,
        description: projectData.description,
        template: template.template,
        tags: [...template.tags, ...projectData.technologies.map(t => t.toLowerCase())],
        privacy: 0, // Public
        files: this.getTemplateFiles(projectData.templateId, projectData)
      };

      const response = await fetch(`${this.apiUrl}/sandboxes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(sandboxData)
      });

      if (!response.ok) {
        throw new Error(`CodeSandbox API error: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        id: result.id,
        url: `https://codesandbox.io/s/${result.id}`,
        embed_url: `https://codesandbox.io/embed/${result.id}?view=editor&module=%2Fsrc%2FApp.tsx`,
        editor_url: `https://codesandbox.io/s/${result.id}`,
        preview_url: `https://codesandbox.io/s/${result.id}?view=preview`
      };
    } catch (error) {
      console.error('CodeSandbox creation error:', error);
      // Do not fallback to mock data
      return null as any;
    }
  }


  private getTemplateFiles(templateId: string, projectData: any): any {
    const baseFiles = {
      'package.json': {
        content: JSON.stringify({
          name: projectData.name.toLowerCase().replace(/\s+/g, '-'),
          version: '1.0.0',
          description: projectData.description,
          dependencies: this.getTemplateDependencies(templateId),
          scripts: this.getTemplateScripts(templateId)
        }, null, 2)
      },
      'README.md': {
        content: `# ${projectData.name}

${projectData.description}

## Technologies
${projectData.technologies.map((tech: string) => `- ${tech}`).join('\n')}

## Getting Started
This project was created with SkillSync collaborative IDE.

### Available Scripts
- \`npm start\` - Start development server
- \`npm build\` - Build for production
- \`npm test\` - Run tests
`
      }
    };

    // Add template-specific files
    switch (templateId) {
      case 'react-app':
        return {
          ...baseFiles,
          'src/App.tsx': {
            content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>${projectData.name}</h1>
        <p>${projectData.description}</p>
        <p>Welcome to your SkillSync collaborative project!</p>
      </header>
    </div>
  );
}

export default App;`
          },
          'src/App.css': {
            content: `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.App-header h1 {
  margin-bottom: 20px;
  color: #61dafb;
}`
          }
        };

      case 'nodejs-api':
        return {
          ...baseFiles,
          'src/index.js': {
            content: `const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to ${projectData.name}',
    description: '${projectData.description}',
    status: 'running'
  });
});

app.listen(port, () => {
  console.log(\`${projectData.name} API listening on port \${port}\`);
});`
          }
        };

      default:
        return baseFiles;
    }
  }

  private getTemplateDependencies(templateId: string): any {
    switch (templateId) {
      case 'react-app':
        return {
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          "@types/react": "^18.2.0",
          "@types/react-dom": "^18.2.0",
          "typescript": "^5.0.0"
        };
      case 'vue-app':
        return {
          "vue": "^3.3.0",
          "@vitejs/plugin-vue": "^4.0.0",
          "vite": "^4.0.0",
          "typescript": "^5.0.0"
        };
      case 'nodejs-api':
        return {
          "express": "^4.18.2",
          "@types/express": "^4.17.17",
          "typescript": "^5.0.0",
          "ts-node": "^10.9.0"
        };
      default:
        return {};
    }
  }

  private getTemplateScripts(templateId: string): any {
    switch (templateId) {
      case 'react-app':
        return {
          "start": "react-scripts start",
          "build": "react-scripts build",
          "test": "react-scripts test"
        };
      case 'vue-app':
        return {
          "dev": "vite",
          "build": "vite build",
          "preview": "vite preview"
        };
      case 'nodejs-api':
        return {
          "start": "node src/index.js",
          "dev": "ts-node src/index.ts"
        };
      default:
        return {
          "start": "npm start"
        };
    }
  }

  async updateSandbox(sandboxId: string, updates: any) {
    if (!this.apiKey) {
      return { skipped: true } as any;
    }

    try {
      const response = await fetch(`${this.apiUrl}/sandboxes/${sandboxId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(updates)
      });

      return await response.json();
    } catch (error) {
      console.error('Sandbox update error:', error);
      throw error;
    }
  }
}
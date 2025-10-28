import { CodeSandbox } from '@codesandbox/sdk';

interface SandboxCreationResult {
  sandboxId: string;
  embedUrl: string;
  previewUrl: string;
  editUrl: string;
  ideUrl: string;
}

interface TemplateConfig {
  template: string;
  initialFiles?: Record<string, string>;
  environment?: Record<string, string>;
}

export class CodeSandboxService {
  private sdk: CodeSandbox | null = null;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.CODESANDBOX_API_KEY || '';
    
    console.log('CodeSandbox API Key present:', !!this.apiKey);
    if (this.apiKey) {
      console.log('API Key preview:', this.apiKey.substring(0, 15) + '...');
    }

    if (!this.apiKey) {
      console.warn('⚠️  CODESANDBOX_API_KEY not set. Sandbox creation will be disabled.');
      console.warn('⚠️  Please add CODESANDBOX_API_KEY to backend/.env file');
      return; // Don't initialize SDK without key
    }

    // SDK constructor takes API key as first parameter (string)
    try {
      this.sdk = new CodeSandbox(this.apiKey);
      console.log('✅ CodeSandbox SDK initialized successfully');
    } catch (error: any) {
      console.error('❌ Failed to initialize CodeSandbox SDK:', error.message);
      this.sdk = null;
    }
  }

  /**
   * Map SkillSync templates to CodeSandbox configurations
   */
  private getTemplateConfig(sandboxTemplate: string, projectName: string): TemplateConfig {
    const configs: Record<string, TemplateConfig> = {
      'react-ts': {
        template: 'node',
        initialFiles: {
          'package.json': JSON.stringify({
            name: projectName.toLowerCase().replace(/\s+/g, '-'),
            version: '1.0.0',
            type: 'module',
            scripts: {
              dev: 'vite',
              build: 'vite build',
              preview: 'vite preview'
            },
            dependencies: {
              react: '^18.2.0',
              'react-dom': '^18.2.0'
            },
            devDependencies: {
              '@types/react': '^18.2.0',
              '@types/react-dom': '^18.2.0',
              '@vitejs/plugin-react': '^4.0.0',
              typescript: '^5.0.0',
              vite: '^4.3.0'
            }
          }, null, 2),
          'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  }
})`,
          'tsconfig.json': JSON.stringify({
            compilerOptions: {
              target: 'ES2020',
              useDefineForClassFields: true,
              lib: ['ES2020', 'DOM', 'DOM.Iterable'],
              module: 'ESNext',
              skipLibCheck: true,
              moduleResolution: 'bundler',
              allowImportingTsExtensions: true,
              resolveJsonModule: true,
              isolatedModules: true,
              noEmit: true,
              jsx: 'react-jsx',
              strict: true
            },
            include: ['src']
          }, null, 2),
          'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
          'src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`,
          'src/App.tsx': `import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <h1>${projectName}</h1>
        <p>Welcome to your SkillSync collaborative project!</p>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
        <p className="read-the-docs">
          Edit src/App.tsx and save to see changes
        </p>
      </header>
    </div>
  )
}

export default App`,
          'src/App.css': `#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.App-header {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
}

.card {
  padding: 2em;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  color: white;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}

.read-the-docs {
  color: #888;
}`,
          'src/index.css': `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`,
          'README.md': `# ${projectName}

A collaborative React + TypeScript project created with SkillSync.

## Getting Started

This project uses Vite for fast development and hot module replacement.

### Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build

## Technologies

- React 18
- TypeScript
- Vite
- CSS3
`,
          '.codesandbox/tasks.json': JSON.stringify({
            setupTasks: [
              {
                name: 'Install Dependencies',
                command: 'npm install'
              }
            ],
            tasks: {
              dev: {
                name: 'dev',
                command: 'npm run dev',
                runAtStart: true,
                preview: {
                  port: 5173
                }
              }
            }
          }, null, 2)
        }
      },
      'vue-ts': {
        template: 'node',
        initialFiles: {
          'package.json': JSON.stringify({
            name: projectName.toLowerCase().replace(/\s+/g, '-'),
            version: '1.0.0',
            type: 'module',
            scripts: {
              dev: 'vite',
              build: 'vite build',
              preview: 'vite preview'
            },
            dependencies: {
              vue: '^3.3.0'
            },
            devDependencies: {
              '@vitejs/plugin-vue': '^4.2.0',
              typescript: '^5.0.0',
              vite: '^4.3.0',
              'vue-tsc': '^1.8.0'
            }
          }, null, 2),
          'vite.config.ts': `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 5173
  }
})`,
          'tsconfig.json': JSON.stringify({
            compilerOptions: {
              target: 'ES2020',
              useDefineForClassFields: true,
              module: 'ESNext',
              lib: ['ES2020', 'DOM', 'DOM.Iterable'],
              skipLibCheck: true,
              moduleResolution: 'bundler',
              allowImportingTsExtensions: true,
              resolveJsonModule: true,
              isolatedModules: true,
              noEmit: true,
              strict: true
            },
            include: ['src/**/*.ts', 'src/**/*.d.ts', 'src/**/*.tsx', 'src/**/*.vue']
          }, null, 2),
          'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`,
          'src/main.ts': `import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')`,
          'src/App.vue': `<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

const count = ref(0)
</script>

<template>
  <div id="app">
    <h1>${projectName}</h1>
    <p>Welcome to your SkillSync Vue 3 project!</p>
    <HelloWorld />
    <div class="card">
      <button type="button" @click="count++">count is {{ count }}</button>
    </div>
    <p class="read-the-docs">
      Edit src/App.vue to see changes
    </p>
  </div>
</template>

<style scoped>
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.card {
  padding: 2em;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  color: white;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #42b883;
}

.read-the-docs {
  color: #888;
}
</style>`,
          'src/components/HelloWorld.vue': `<script setup lang="ts">
defineProps<{
  msg?: string
}>()
</script>

<template>
  <div class="hello">
    <h2>{{ msg || 'Hello from Vue 3!' }}</h2>
    <p>
      This is a collaborative Vue 3 + TypeScript project.
      Start editing to see live updates!
    </p>
  </div>
</template>

<style scoped>
.hello {
  margin: 2rem 0;
  padding: 1rem;
  border-radius: 8px;
  background: rgba(66, 184, 131, 0.1);
}

h2 {
  color: #42b883;
}
</style>`,
          'src/style.css': `body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
}

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}`,
          'README.md': `# ${projectName}

A collaborative Vue 3 + TypeScript project created with SkillSync.

## Getting Started

This project uses Vite for fast development and hot module replacement.

### Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build

## Technologies

- Vue 3
- TypeScript
- Vite
- Composition API
`,
          '.codesandbox/tasks.json': JSON.stringify({
            setupTasks: [
              {
                name: 'Install Dependencies',
                command: 'npm install'
              }
            ],
            tasks: {
              dev: {
                name: 'dev',
                command: 'npm run dev',
                runAtStart: true,
                preview: {
                  port: 5173
                }
              }
            }
          }, null, 2)
        }
      },
      'node': {
        template: 'node',
        initialFiles: {
          'package.json': JSON.stringify({
            name: projectName.toLowerCase().replace(/\s+/g, '-'),
            version: '1.0.0',
            type: 'module',
            scripts: {
              start: 'node src/index.js',
              dev: 'node --watch src/index.js'
            },
            dependencies: {
              express: '^4.18.2',
              cors: '^2.8.5',
              dotenv: '^16.0.0'
            }
          }, null, 2),
          'src/index.js': `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.path}\`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to ${projectName}!',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/hello/:name', (req, res) => {
  const { name } = req.params;
  res.json({ 
    message: \`Hello, \${name}!\`,
    timestamp: new Date().toISOString()
  });
});

// Sample POST endpoint
app.post('/api/echo', (req, res) => {
  res.json({ 
    message: 'Echo endpoint',
    received: req.body,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    path: req.path 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(\`🚀 ${projectName} API running on port \${PORT}\`);
  console.log(\`📡 Health check: http://localhost:\${PORT}/api/health\`);
});`,
          '.env': `PORT=3000
NODE_ENV=development`,
          'README.md': `# ${projectName}

A collaborative Node.js + Express API created with SkillSync.

## Getting Started

### Available Scripts

- \`npm start\` - Start the server
- \`npm run dev\` - Start with auto-reload (Node 18+)

## API Endpoints

### GET /
Health check endpoint

### GET /api/health
Detailed health status

### GET /api/hello/:name
Greeting endpoint with parameter

### POST /api/echo
Echo back the request body

## Technologies

- Node.js
- Express
- CORS
- dotenv

## Example Usage

\`\`\`bash
# GET request
curl http://localhost:3000/api/hello/world

# POST request
curl -X POST http://localhost:3000/api/echo \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello"}'
\`\`\`
`,
          '.codesandbox/tasks.json': JSON.stringify({
            setupTasks: [
              {
                name: 'Install Dependencies',
                command: 'npm install'
              }
            ],
            tasks: {
              start: {
                name: 'start',
                command: 'npm start',
                runAtStart: true,
                preview: {
                  port: 3000
                }
              }
            }
          }, null, 2)
        }
      }
    };

    return configs[sandboxTemplate] || configs['node'];
  }

  /**
   * Create a new sandbox for a project (new SDK method)
   */
  async createProjectSandbox(
    projectName: string,
    sandboxTemplate: string,
    projectId?: string
  ): Promise<SandboxCreationResult | null> {
    if (!this.sdk || !this.apiKey) {
      console.warn('⚠️  Skipping sandbox creation - CodeSandbox SDK not initialized');
      return null;
    }

    try {
      console.log(`🚀 Creating sandbox for project: ${projectName} (template: ${sandboxTemplate})`);

      const templateConfig = this.getTemplateConfig(sandboxTemplate, projectName);

      // Create sandbox (SDK will use default universal template)
      const sandbox = await this.sdk.sandboxes.create({
        title: projectName,
        description: `SkillSync project workspace${projectId ? ` (ID: ${projectId})` : ''}`,
        privacy: 'public'
      });

      console.log(`✅ Sandbox created with ID: ${sandbox.id}`);

      // Connect and setup initial files if needed
      if (templateConfig.initialFiles) {
        try {
          console.log(`📝 Writing ${Object.keys(templateConfig.initialFiles).length} files to sandbox...`);
          const client = await sandbox.connect();
          
          // CodeSandbox uses /project/sandbox as the working directory
          const workDir = '/project/sandbox';
          console.log(`📂 Using working directory: ${workDir}`);
          
          // Write files one by one with logging
          for (const [path, content] of Object.entries(templateConfig.initialFiles)) {
            try {
              const fullPath = `${workDir}/${path}`;
              
              // Create parent directories if needed
              const dirPath = fullPath.split('/').slice(0, -1).join('/');
              if (dirPath && dirPath !== workDir) {
                await client.fs.mkdir(dirPath, true);
              }
              
              await client.fs.writeTextFile(fullPath, content, { create: true, overwrite: true });
              console.log(`  ✅ ${fullPath}`);
            } catch (fileError: any) {
              console.error(`  ❌ ${path}: ${fileError.message}`);
            }
          }

          console.log(`✅ All files written to sandbox ${sandbox.id}`);
          
          // Verify files were created by listing working directory
          try {
            const files = await client.fs.readdir(workDir);
            console.log(`📁 ${workDir} contents:`, files.map(f => f.name).join(', '));
            
            // Check if package.json exists
            const hasPkg = files.some(f => f.name === 'package.json');
            if (hasPkg) {
              console.log(`✅ package.json found in ${workDir}`);
            } else {
              console.warn(`⚠️  package.json NOT found in ${workDir}!`);
            }
          } catch (verifyError: any) {
            console.warn('⚠️  Could not verify files:', verifyError.message);
          }
          
          // Wait a bit for sandbox to process files
          await new Promise(resolve => setTimeout(resolve, 2000));
          
        } catch (fileError: any) {
          console.error('❌ Could not write initial files:', fileError.message);
          console.error('Full error:', fileError);
        }
      }

      const sandboxId = sandbox.id;
      const embedUrl = `https://codesandbox.io/p/sandbox/${sandboxId}`;
      const previewUrl = `https://codesandbox.io/p/sandbox/${sandboxId}?view=preview`;
      const editUrl = embedUrl;
      const ideUrl = embedUrl;

      return {
        sandboxId,
        embedUrl,
        previewUrl,
        editUrl,
        ideUrl
      };
    } catch (error: any) {
      console.error('❌ Error creating sandbox:', error.message);
      return null;
    }
  }

  /**
   * Legacy method for backwards compatibility
   */
  async createSandbox(projectData: {
    templateId: string;
    name: string;
    description: string;
    technologies: string[];
  }) {
    const result = await this.createProjectSandbox(
      projectData.name,
      projectData.templateId
    );

    if (!result) {
      return null as any;
    }

    return {
      id: result.sandboxId,
      url: result.ideUrl,
      embed_url: result.embedUrl,
      editor_url: result.editUrl,
      preview_url: result.previewUrl
    };
  }


  /**
   * Hibernate a sandbox to save costs
   */
  async hibernateSandbox(sandboxId: string): Promise<boolean> {
    if (!this.sdk || !this.apiKey) {
      return false;
    }

    try {
      await this.sdk.sandboxes.hibernate(sandboxId);
      console.log(`💤 Sandbox ${sandboxId} hibernated`);
      return true;
    } catch (error: any) {
      console.error(`Error hibernating sandbox ${sandboxId}:`, error.message);
      return false;
    }
  }

  /**
   * Resume a hibernated sandbox
   */
  async resumeSandbox(sandboxId: string): Promise<boolean> {
    if (!this.sdk || !this.apiKey) {
      return false;
    }

    try {
      await this.sdk.sandboxes.resume(sandboxId);
      console.log(`🔄 Sandbox ${sandboxId} resumed`);
      return true;
    } catch (error: any) {
      console.error(`Error resuming sandbox ${sandboxId}:`, error.message);
      return false;
    }
  }

  /**
   * Delete a sandbox
   */
  async deleteSandbox(sandboxId: string): Promise<boolean> {
    if (!this.sdk || !this.apiKey) {
      return false;
    }

    try {
      await this.sdk.sandboxes.delete(sandboxId);
      console.log(`🗑️  Sandbox ${sandboxId} deleted`);
      return true;
    } catch (error: any) {
      console.error(`Error deleting sandbox ${sandboxId}:`, error.message);
      return false;
    }
  }

  /**
   * Check if SDK is properly configured
   */
  isConfigured(): boolean {
    return Boolean(this.sdk && this.apiKey);
  }
}

// Lazy singleton - instance created on first access (after dotenv loads)
let instance: CodeSandboxService | null = null;

function getCodeSandboxService(): CodeSandboxService {
  if (!instance) {
    instance = new CodeSandboxService();
  }
  return instance;
}

// Export a proxy that delays initialization
export const codeSandboxService = new Proxy({} as CodeSandboxService, {
  get(target, prop) {
    const service = getCodeSandboxService();
    return (service as any)[prop];
  }
});

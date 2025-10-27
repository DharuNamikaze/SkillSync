import { CodeSandbox } from '@codesandbox/sdk';

// Map SkillSync template IDs to CodeSandbox SDK template slugs
const TEMPLATE_SLUGS: Record<string, string> = {
  'react-app': 'react-ts',
  'vue-app': 'vue-ts',
  'nodejs-api': 'node',
  'fullstack-app': 'react-ts', // consider custom template later
  'mobile-app': 'react-native',
  'ui-library': 'react-ts'
};

export class CodeSandboxService {
  private apiKey: string;
  private sdk: CodeSandbox | null;

  constructor() {
    this.apiKey = process.env.CSB_API_KEY || process.env.CODESANDBOX_API_KEY || '';
    this.sdk = this.apiKey ? new CodeSandbox(this.apiKey) : null;
  }

  async createSandbox(projectData: {
    templateId: string;
    name: string;
    description: string;
    technologies: string[];
  }) {
    const template = TEMPLATE_SLUGS[projectData.templateId];
    if (!template) {
      throw new Error(`Unknown template: ${projectData.templateId}`);
    }

    if (!this.sdk) {
      // No API key configured; skip creating a sandbox
      return null as any;
    }

    try {
      const sandbox = await (this.sdk as any).sandboxes.create({
        template,
        vm: { size: 'nano' },
        metadata: { projectName: projectData.name }
      } as any);

      // Ensure visibility is public for embedding
      try {
        await (this.sdk as any).sandboxes.update(sandbox.id, { visibility: 'public' });
      } catch (e) {
        // ignore if plan/org forbids update; embed might still work if default is public/unlisted
      }

      // Return basic links we use on the frontend
      return {
        id: sandbox.id,
        url: `https://codesandbox.io/p/sandbox/${sandbox.id}`,
        embed_url: `https://codesandbox.io/p/sandbox/${sandbox.id}?embed=1`,
        editor_url: `https://codesandbox.io/p/sandbox/${sandbox.id}`,
        preview_url: `https://codesandbox.io/p/sandbox/${sandbox.id}?embed=1&view=preview`
      };
    } catch (error) {
      console.error('CodeSandbox creation error:', error);
      return null as any;
    }
  }
}

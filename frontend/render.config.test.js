import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { parse } from 'yaml';
import { resolve } from 'path';
import { execSync } from 'child_process';

describe('render.yaml Configuration Tests', () => {
  let renderConfig;
  let frontendService;

  beforeAll(() => {
    // Read and parse the render.yaml file
    const renderYamlPath = resolve(process.cwd(), 'render.yaml');
    const yamlContent = readFileSync(renderYamlPath, 'utf8');
    renderConfig = parse(yamlContent);
    
    // Get the frontend service configuration
    frontendService = renderConfig.services?.find(
      service => service.name === 'skillsync-frontend'
    );
  });

  describe('1. Build Command Validation', () => {
    it('should have a valid buildCommand defined', () => {
      expect(frontendService).toBeDefined();
      expect(frontendService.buildCommand).toBeDefined();
      expect(typeof frontendService.buildCommand).toBe('string');
    });

    it('should include npm install in the buildCommand', () => {
      expect(frontendService.buildCommand).toContain('npm install');
    });

    it('should include npm run build in the buildCommand', () => {
      expect(frontendService.buildCommand).toContain('npm run build');
    });

    it('should successfully build the frontend application', () => {
      // This test actually runs the build command to verify it works
      // You may want to skip this in CI or run it separately as it's time-consuming
      try {
        // Extract just the build command (skip npm install for faster testing)
        execSync('npm run build', {
          cwd: process.cwd(),
          stdio: 'pipe',
          timeout: 60000 // 60 second timeout
        });
        
        // If we get here, the build succeeded
        expect(true).toBe(true);
      } catch (error) {
        // If build fails, the test should fail
        throw new Error(`Build command failed: ${error.message}`);
      }
    }, 60000); // 60 second timeout for this test
  });

  describe('2. Static Publish Path Validation', () => {
    it('should have a staticPublishPath defined', () => {
      expect(frontendService.staticPublishPath).toBeDefined();
      expect(typeof frontendService.staticPublishPath).toBe('string');
    });

    it('should point to the ./dist directory', () => {
      expect(frontendService.staticPublishPath).toBe('./dist');
    });

    it('should point to a directory that exists after build', () => {
      // This test assumes the build has been run
      // Run the build first
      try {
        execSync('npm run build', {
          cwd: process.cwd(),
          stdio: 'pipe',
          timeout: 60000
        });
      } catch (error) {
        console.warn('Build failed, skipping directory existence check');
      }

      const distPath = resolve(process.cwd(), 'dist');
      const exists = existsSync(distPath);
      
      if (!exists) {
        console.warn('dist directory does not exist. Run "npm run build" first.');
      }
      
      // This will pass if dist exists, or provide a warning if it doesn't
      expect(exists).toBe(true);
    }, 60000);

    it('should contain built assets after build', async () => {
      const distPath = resolve(process.cwd(), 'dist');
      
      if (!existsSync(distPath)) {
        // Try to build first
        try {
          execSync('npm run build', {
            cwd: process.cwd(),
            stdio: 'pipe',
            timeout: 60000
          });
        } catch (error) {
          throw new Error('Cannot verify built assets: build failed');
        }
      }

      // Check that dist directory contains files
      const fs = await import('fs');
      const files = fs.readdirSync(distPath);
      
      expect(files.length).toBeGreaterThan(0);
      
      // Typically, a Vite build should produce an index.html
      expect(files).toContain('index.html');
    }, 60000);
  });

  describe('3. Service Type Validation', () => {
    it('should have a type property defined', () => {
      expect(frontendService.type).toBeDefined();
      expect(typeof frontendService.type).toBe('string');
    });

    it('should be configured as "web" service type', () => {
      expect(frontendService.type).toBe('web');
    });

    it('should not be configured as other service types', () => {
      expect(frontendService.type).not.toBe('worker');
      expect(frontendService.type).not.toBe('cron');
      expect(frontendService.type).not.toBe('private_service');
    });
  });

  describe('4. Environment Configuration Validation', () => {
    it('should have an env property defined', () => {
      expect(frontendService.env).toBeDefined();
      expect(typeof frontendService.env).toBe('string');
    });

    it('should be set to "static" environment', () => {
      expect(frontendService.env).toBe('static');
    });

    it('should not be configured as other environment types', () => {
      expect(frontendService.env).not.toBe('docker');
      expect(frontendService.env).not.toBe('node');
      expect(frontendService.env).not.toBe('python');
      expect(frontendService.env).not.toBe('go');
      expect(frontendService.env).not.toBe('ruby');
    });
  });

  describe('Additional Configuration Validation', () => {
    it('should have a valid service name', () => {
      expect(frontendService.name).toBeDefined();
      expect(frontendService.name).toBe('skillsync-frontend');
    });

    it('should have all required fields for a static site', () => {
      expect(frontendService).toHaveProperty('type');
      expect(frontendService).toHaveProperty('name');
      expect(frontendService).toHaveProperty('env');
      expect(frontendService).toHaveProperty('buildCommand');
      expect(frontendService).toHaveProperty('staticPublishPath');
    });

    it('should have valid YAML structure', () => {
      expect(renderConfig).toBeDefined();
      expect(renderConfig.services).toBeDefined();
      expect(Array.isArray(renderConfig.services)).toBe(true);
      expect(renderConfig.services.length).toBeGreaterThan(0);
    });
  });
});

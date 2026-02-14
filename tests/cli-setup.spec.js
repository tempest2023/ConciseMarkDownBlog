/**
 * @file CLI Setup Tool UI Test
 * @description Tests the CLI setup wizard UI flow
 */
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('CLI Setup Tool', () => {
  const configPath = path.join(process.cwd(), 'src', 'config.js');
  const configBackupPath = path.join(process.cwd(), 'src', 'config.js.backup');

  test.beforeAll(() => {
    // Backup existing config if it exists
    if (fs.existsSync(configPath)) {
      fs.copyFileSync(configPath, configBackupPath);
    }
  });

  test.afterAll(() => {
    // Restore original config
    if (fs.existsSync(configBackupPath)) {
      fs.copyFileSync(configBackupPath, configPath);
      fs.unlinkSync(configBackupPath);
    }
  });

  test('setup script should be executable', () => {
    // Verify the setup script exists and is runnable
    const setupScriptPath = path.join(process.cwd(), 'scripts', 'setup.js');
    expect(fs.existsSync(setupScriptPath)).toBe(true);

    // Verify it can be imported without errors
    const setupModule = require(setupScriptPath);
    expect(setupModule.runSetup).toBeDefined();
    expect(setupModule.generateConfig).toBeDefined();
    expect(setupModule.validateUrl).toBeDefined();
    expect(setupModule.validateEmail).toBeDefined();
  });

  test('generateConfig should create valid configuration object', () => {
    const { generateConfig, THEMES } = require(path.join(process.cwd(), 'scripts', 'setup.js'));

    const mockAnswers = {
      blogTitle: 'Test Blog Title',
      authorName: 'Test Author',
      email: 'test@example.com',
      githubUsername: 'testuser',
      linkedinUrl: 'https://linkedin.com/in/testuser',
      repoUrl: 'https://github.com/testuser/blog',
      resumeUrl: 'https://example.com/resume.pdf',
      theme: 'ocean',
      features: ['about', 'blog', 'projects', 'techstack', 'links'],
      tabSize: '4'
    };

    const config = generateConfig(mockAnswers);

    // Verify basic info
    expect(config.title).toBe('Test Blog Title');
    expect(config.name).toBe('Test Author');
    expect(config.email).toBe('test@example.com');

    // Verify social links
    expect(config.social.github).toBe('https://github.com/testuser');
    expect(config.social.linkedin).toBe('https://linkedin.com/in/testuser');

    // Verify theme
    expect(config.colors).toEqual(THEMES.ocean);

    // Verify headers were generated
    expect(config.headers.length).toBeGreaterThan(0);
    expect(config.headers.some(h => h.title === 'About')).toBe(true);
    expect(config.headers.some(h => h.title === 'Blog')).toBe(true);
    expect(config.headers.some(h => h.title === 'MarkDown')).toBe(true);
  });

  test('configToJsContent should generate valid JavaScript', () => {
    const { configToJsContent, generateConfig } = require(path.join(process.cwd(), 'scripts', 'setup.js'));

    const mockAnswers = {
      blogTitle: 'Test Blog',
      authorName: 'Test Author',
      email: 'test@example.com',
      theme: 'default',
      features: ['about'],
      tabSize: '2'
    };

    const config = generateConfig(mockAnswers);
    const jsContent = configToJsContent(config);

    // Verify it's valid JavaScript-like content
    expect(jsContent).toContain('const config = {');
    expect(jsContent).toContain('export default config;');
    expect(jsContent).toContain("title: 'Test Blog'");
    expect(jsContent).toContain("name: 'Test Author'");

    // Verify it's parseable (basic check)
    expect(jsContent).not.toContain('undefined');
    expect(jsContent.length).toBeGreaterThan(100);
  });

  test('theme presets should have valid color values', () => {
    const { THEMES } = require(path.join(process.cwd(), 'scripts', 'setup.js'));

    // Verify all themes exist
    expect(Object.keys(THEMES)).toContain('default');
    expect(Object.keys(THEMES)).toContain('ocean');
    expect(Object.keys(THEMES)).toContain('forest');
    expect(Object.keys(THEMES)).toContain('berry');

    // Verify each theme has valid hex colors
    Object.values(THEMES).forEach(theme => {
      // Light mode
      expect(theme.light.background).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(theme.light.foreground).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(theme.light.gray).toMatch(/^#[0-9a-fA-F]{6}$/);

      // Dark mode
      expect(theme.dark.background).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(theme.dark.foreground).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(theme.dark.gray).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  test('setup package.json should have setup script', () => {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    expect(packageJson.scripts.setup).toBeDefined();
    expect(packageJson.scripts.setup).toBe('node scripts/setup.js');
  });
});

/**
 * @file Unit tests for CLI Setup Tool
 * @description Comprehensive test suite for setup.js
 */

const {
  validateUrl,
  validateEmail,
  validateRequired,
  generateConfig,
  configToJsContent,
  generateHeaders,
  THEMES,
  DEFAULT_CONFIG
} = require('../../scripts/setup');

// Mock fs module
jest.mock('fs');
const fs = require('fs');

describe('CLI Setup Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUrl', () => {
    it('should return true for empty string', () => {
      expect(validateUrl('')).toBe(true);
      expect(validateUrl(null)).toBe(true);
      expect(validateUrl(undefined)).toBe(true);
    });

    it('should return true for valid HTTP URL', () => {
      expect(validateUrl('https://github.com/user/repo')).toBe(true);
      expect(validateUrl('http://example.com')).toBe(true);
    });

    it('should return false for invalid URL', () => {
      expect(validateUrl('not-a-url')).toBe(false);
      expect(validateUrl('ftp://invalid')).toBe(true); // ftp is valid URL
      expect(validateUrl('just text')).toBe(false);
    });

    it('should return true for URLs with special characters', () => {
      expect(validateUrl('https://example.com/path?query=value&other=1')).toBe(true);
      expect(validateUrl('https://example.com/path#anchor')).toBe(true);
    });
  });

  describe('validateEmail', () => {
    it('should return true for empty string', () => {
      expect(validateEmail('')).toBe(true);
      expect(validateEmail(null)).toBe(true);
      expect(validateEmail(undefined)).toBe(true);
    });

    it('should return true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(validateEmail('not-an-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user@.com')).toBe(false);
      expect(validateEmail('user name@example.com')).toBe(false);
    });
  });

  describe('validateRequired', () => {
    it('should return error message for empty values', () => {
      expect(validateRequired('')).toBe('This field is required');
      expect(validateRequired(null)).toBe('This field is required');
      expect(validateRequired(undefined)).toBe('This field is required');
    });

    it('should return error message for whitespace-only values', () => {
      expect(validateRequired('   ')).toBe('This field is required');
      expect(validateRequired('\t\n')).toBe('This field is required');
    });

    it('should return true for non-empty values', () => {
      expect(validateRequired('valid')).toBe(true);
      expect(validateRequired('a')).toBe(true);
      expect(validateRequired('  valid  ')).toBe(true);
    });
  });

  describe('generateHeaders', () => {
    it('should return empty array for empty features', () => {
      const result = generateHeaders([]);
      expect(result).toEqual([{ title: 'MarkDown', type: 'article' }]);
    });

    it('should generate About header', () => {
      const result = generateHeaders(['about']);
      expect(result).toContainEqual({ title: 'About', type: 'article' });
    });

    it('should generate Blog header', () => {
      const result = generateHeaders(['blog']);
      expect(result).toContainEqual({ title: 'Blog', type: 'article' });
    });

    it('should generate Projects header with customUrl', () => {
      const result = generateHeaders(['projects']);
      expect(result).toContainEqual({ title: 'Projects', type: 'article', customUrl: 'Projects/Project' });
    });

    it('should generate Tech Stack header with customUrl', () => {
      const result = generateHeaders(['techstack']);
      expect(result).toContainEqual({ title: 'Tech Stack', type: 'article', customUrl: 'TechStack' });
    });

    it('should generate Links header', () => {
      const result = generateHeaders(['links']);
      expect(result).toContainEqual({ title: 'Links', type: 'article' });
    });

    it('should always include MarkDown header', () => {
      const result = generateHeaders(['about']);
      const markdownHeader = result.find(h => h.title === 'MarkDown');
      expect(markdownHeader).toBeDefined();
      expect(markdownHeader.type).toBe('article');
    });

    it('should generate multiple headers correctly', () => {
      const result = generateHeaders(['about', 'blog', 'projects', 'links']);
      expect(result).toHaveLength(5); // 4 + markdown
      expect(result.map(h => h.title)).toContain('About');
      expect(result.map(h => h.title)).toContain('Blog');
      expect(result.map(h => h.title)).toContain('Projects');
      expect(result.map(h => h.title)).toContain('Links');
    });

    it('should add Resume as link type', () => {
      const result = generateHeaders(['about', 'resume']);
      const resumeHeader = result.find(h => h.title === 'Resume');
      expect(resumeHeader).toBeDefined();
      expect(resumeHeader.type).toBe('link');
      expect(resumeHeader.customUrl).toBe('');
    });
  });

  describe('generateConfig', () => {
    const mockAnswers = {
      blogTitle: 'Test Blog',
      authorName: 'Test Author',
      email: 'test@example.com',
      githubUsername: 'testuser',
      linkedinUrl: 'https://linkedin.com/in/testuser',
      repoUrl: 'https://github.com/testuser/blog',
      resumeUrl: 'https://example.com/resume.pdf',
      theme: 'ocean',
      features: ['about', 'blog'],
      tabSize: '4'
    };

    it('should generate config with basic info', () => {
      const config = generateConfig(mockAnswers);
      expect(config.title).toBe('Test Blog');
      expect(config.name).toBe('Test Author');
      expect(config.email).toBe('test@example.com');
    });

    it('should generate GitHub URL from username', () => {
      const config = generateConfig(mockAnswers);
      expect(config.social.github).toBe('https://github.com/testuser');
    });

    it('should set LinkedIn URL', () => {
      const config = generateConfig(mockAnswers);
      expect(config.social.linkedin).toBe('https://linkedin.com/in/testuser');
    });

    it('should set repo and readme URLs', () => {
      const config = generateConfig(mockAnswers);
      expect(config.repo).toBe('https://github.com/testuser/blog');
      expect(config.readmeUrl).toBe('https://github.com/testuser/blog/blob/main/README.md');
    });

    it('should set resume URL', () => {
      const config = generateConfig(mockAnswers);
      expect(config.resume_url).toBe('https://example.com/resume.pdf');
    });

    it('should apply theme colors', () => {
      const config = generateConfig(mockAnswers);
      expect(config.colors).toEqual(THEMES.ocean);
    });

    it('should set tab size', () => {
      const config = generateConfig(mockAnswers);
      expect(config.markdown.tabSize).toBe(4);
    });

    it('should handle missing optional values', () => {
      const minimalAnswers = {
        blogTitle: 'Test Blog',
        authorName: 'Test Author',
        email: '',
        githubUsername: '',
        linkedinUrl: '',
        repoUrl: '',
        resumeUrl: '',
        theme: 'default',
        features: ['about'],
        tabSize: '2'
      };
      const config = generateConfig(minimalAnswers);
      expect(config.social.github).toBe('');
      expect(config.social.linkedin).toBe('');
      expect(config.repo).toBe('');
      expect(config.email).toBe('');
    });

    it('should apply default theme if theme not found', () => {
      const answers = { ...mockAnswers, theme: 'nonexistent' };
      const config = generateConfig(answers);
      expect(config.colors).toEqual(THEMES.default);
    });

    it('should maintain default values for unspecified options', () => {
      const config = generateConfig(mockAnswers);
      expect(config.debug).toBe(DEFAULT_CONFIG.debug);
      expect(config.markdown.enable).toBe(DEFAULT_CONFIG.markdown.enable);
      expect(config.themeEnable).toBe(DEFAULT_CONFIG.themeEnable);
    });
  });

  describe('configToJsContent', () => {
    it('should generate valid JavaScript content', () => {
      const config = {
        ...DEFAULT_CONFIG,
        title: 'Test Blog',
        name: 'Test Author',
        email: 'test@example.com'
      };
      const content = configToJsContent(config);

      expect(content).toContain('const config = {');
      expect(content).toContain('export default config;');
      expect(content).toContain("title: 'Test Blog'");
      expect(content).toContain("name: 'Test Author'");
    });

    it('should include proper JSDoc header', () => {
      const config = { ...DEFAULT_CONFIG };
      const content = configToJsContent(config);

      expect(content).toContain('@author');
      expect(content).toContain('@email');
      expect(content).toContain('@desc Blog Configuration');
    });

    it('should format headers array correctly', () => {
      const config = {
        ...DEFAULT_CONFIG,
        headers: [{ title: 'About', type: 'article' }]
      };
      const content = configToJsContent(config);

      expect(content).toContain('headers:');
      expect(content).toContain("title: 'About'");
      expect(content).toContain("type: 'article'");
    });

    it('should format colors object correctly', () => {
      const config = {
        ...DEFAULT_CONFIG,
        colors: THEMES.ocean
      };
      const content = configToJsContent(config);

      // Check for color values (using single quotes from JSON.stringify)
      expect(content).toContain("'background': '#f0f9ff'");
      expect(content).toContain("'foreground': '#0ea5e9'");
    });

    it('should format linkStyle correctly', () => {
      const config = { ...DEFAULT_CONFIG };
      const content = configToJsContent(config);

      expect(content).toContain('linkStyle:');
      expect(content).toContain("textDecoration: 'none'");
    });
  });

  describe('THEMES', () => {
    it('should have default theme', () => {
      expect(THEMES.default).toBeDefined();
      expect(THEMES.default.light).toBeDefined();
      expect(THEMES.default.dark).toBeDefined();
    });

    it('should have ocean theme', () => {
      expect(THEMES.ocean).toBeDefined();
      expect(THEMES.ocean.light.background).toBe('#f0f9ff');
    });

    it('should have forest theme', () => {
      expect(THEMES.forest).toBeDefined();
      expect(THEMES.forest.light.background).toBe('#f0fdf4');
    });

    it('should have berry theme', () => {
      expect(THEMES.berry).toBeDefined();
      expect(THEMES.berry.light.background).toBe('#fdf2f8');
    });

    it('each theme should have required color properties', () => {
      Object.values(THEMES).forEach(theme => {
        expect(theme.light.background).toBeDefined();
        expect(theme.light.foreground).toBeDefined();
        expect(theme.light.gray).toBeDefined();
        expect(theme.dark.background).toBeDefined();
        expect(theme.dark.foreground).toBeDefined();
        expect(theme.dark.gray).toBeDefined();
      });
    });
  });

  describe('DEFAULT_CONFIG', () => {
    it('should have required top-level properties', () => {
      expect(DEFAULT_CONFIG.debug).toBeDefined();
      expect(DEFAULT_CONFIG.title).toBeDefined();
      expect(DEFAULT_CONFIG.name).toBeDefined();
      expect(DEFAULT_CONFIG.email).toBeDefined();
      expect(DEFAULT_CONFIG.default).toBeDefined();
      expect(DEFAULT_CONFIG.headers).toBeDefined();
      expect(DEFAULT_CONFIG.markdown).toBeDefined();
      expect(DEFAULT_CONFIG.themeEnable).toBeDefined();
      expect(DEFAULT_CONFIG.colors).toBeDefined();
    });

    it('should have required markdown properties', () => {
      expect(DEFAULT_CONFIG.markdown.enable).toBeDefined();
      expect(DEFAULT_CONFIG.markdown.loading).toBeDefined();
      expect(DEFAULT_CONFIG.markdown.renderDelay).toBeDefined();
      expect(DEFAULT_CONFIG.markdown.tabSize).toBeDefined();
      expect(DEFAULT_CONFIG.markdown.linkStyle).toBeDefined();
    });

    it('should have required social properties', () => {
      expect(DEFAULT_CONFIG.social.github).toBeDefined();
      expect(DEFAULT_CONFIG.social.linkedin).toBeDefined();
    });

    it('should have headers array with items', () => {
      expect(Array.isArray(DEFAULT_CONFIG.headers)).toBe(true);
      expect(DEFAULT_CONFIG.headers.length).toBeGreaterThan(0);
    });

    it('should have default as About', () => {
      expect(DEFAULT_CONFIG.default).toBe('About');
    });
  });

  describe('createSampleArticles', () => {
    const { createSampleArticles } = require('../../scripts/setup');

    beforeEach(() => {
      jest.clearAllMocks();
      fs.existsSync.mockReset();
      fs.mkdirSync.mockReset();
      fs.writeFileSync.mockReset();
    });

    it('should create About.md when about feature is selected', () => {
      fs.existsSync.mockReturnValue(false);
      const articlesDir = '/test/articles';

      createSampleArticles(['about'], articlesDir);

      expect(fs.mkdirSync).toHaveBeenCalledWith('/test/articles', { recursive: true });
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('About.md'),
        expect.stringContaining('# About Me'),
        'utf8'
      );
    });

    it('should create Blog.md when blog feature is selected', () => {
      fs.existsSync.mockReturnValue(false);
      const articlesDir = '/test/articles';

      createSampleArticles(['blog'], articlesDir);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('Blog.md'),
        expect.stringContaining('# Blog'),
        'utf8'
      );
    });

    it('should create Projects/Project.md when projects feature is selected', () => {
      fs.existsSync.mockReturnValue(false);
      const articlesDir = '/test/articles';

      createSampleArticles(['projects'], articlesDir);

      expect(fs.mkdirSync).toHaveBeenCalledWith('/test/articles/Projects', { recursive: true });
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('Projects/Project.md'),
        expect.stringContaining('# Projects'),
        'utf8'
      );
    });

    it('should create TechStack.md when techstack feature is selected', () => {
      fs.existsSync.mockReturnValue(false);
      const articlesDir = '/test/articles';

      createSampleArticles(['techstack'], articlesDir);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('TechStack.md'),
        expect.stringContaining('# Tech Stack'),
        'utf8'
      );
    });

    it('should create Links.md when links feature is selected', () => {
      fs.existsSync.mockReturnValue(false);
      const articlesDir = '/test/articles';

      createSampleArticles(['links'], articlesDir);

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('Links.md'),
        expect.stringContaining('# Links'),
        'utf8'
      );
    });

    it('should skip existing files', () => {
      fs.existsSync.mockReturnValue(true);
      const articlesDir = '/test/articles';

      createSampleArticles(['about'], articlesDir);

      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    it('should handle multiple features at once', () => {
      fs.existsSync.mockReturnValue(false);
      const articlesDir = '/test/articles';

      createSampleArticles(['about', 'blog', 'projects'], articlesDir);

      expect(fs.writeFileSync).toHaveBeenCalledTimes(3);
    });
  });
});

/**
 * @file Config Editor Unit Tests
 * @description Unit tests for ConfigEditor utility functions
 */

import {
  escapeString,
  formatObject,
  configToJsContent,
  generateConfigFromState
} from '../components/config/configEditor';

describe('Config Editor Utils', () => {
  describe('escapeString', () => {
    it('should escape single quotes', () => {
      expect(escapeString("It's a test")).toBe("It\\'s a test");
    });

    it('should escape backslashes', () => {
      expect(escapeString('path\\to\\file')).toBe('path\\\\to\\\\file');
    });

    it('should escape both single quotes and backslashes', () => {
      expect(escapeString("It's a path\\to\\file")).toBe("It\\'s a path\\\\to\\\\file");
    });

    it('should handle non-string input', () => {
      expect(escapeString(123)).toBe(123);
      expect(escapeString(null)).toBe(null);
      expect(escapeString(undefined)).toBe(undefined);
    });

    it('should handle empty string', () => {
      expect(escapeString('')).toBe('');
    });

    it('should handle string without special chars', () => {
      expect(escapeString('Hello World')).toBe('Hello World');
    });
  });

  describe('formatObject', () => {
    it('should format a simple object', () => {
      const obj = { a: 1, b: 'test' };
      const result = formatObject(obj, 2);
      expect(result).toContain("a: 1");
      expect(result).toContain("b: 'test'");
    });

    it('should format nested objects', () => {
      const obj = { nested: { key: 'value' } };
      const result = formatObject(obj, 2);
      expect(result).toContain('nested:');
      expect(result).toContain("key: 'value'");
    });

    it('should format arrays within objects', () => {
      const obj = { items: [1, 2, 3] };
      const result = formatObject(obj, 2);
      expect(result).toContain('items:');
      expect(result).toContain('1');
      expect(result).toContain('2');
      expect(result).toContain('3');
    });

    it('should respect baseIndent', () => {
      const obj = { key: 'value' };
      const result = formatObject(obj, 4);
      // The result should have indentation starting at 4 spaces for nested lines
      const lines = result.split('\n');
      if (lines.length > 1) {
        expect(lines[1].startsWith('    ')).toBe(true);
      }
    });
  });

  describe('configToJsContent', () => {
    it('should generate valid config with all required fields', () => {
      const config = {
        debug: false,
        readmeUrl: 'https://github.com/user/repo/blob/main/README.md',
        title: 'Test Blog',
        name: 'Test Author',
        social: {
          github: 'https://github.com/user',
          linkedin: 'https://linkedin.com/in/user'
        },
        email: 'test@example.com',
        repo: 'https://github.com/user/repo',
        resume_url: 'https://example.com/resume.pdf',
        default: 'About',
        headers: [
          { title: 'About', type: 'article' },
          { title: 'Blog', type: 'article' }
        ],
        markdown: {
          enable: true,
          loading: false,
          renderDelay: 0,
          tabSize: 2,
          linkStyle: {
            textDecoration: 'none',
            color: '#0077ff'
          }
        },
        themeChange: true
      };

      const content = configToJsContent(config);

      // Check structure
      expect(content).toContain('const config = {');
      expect(content).toContain('export default config;');

      // Check fields
      expect(content).toContain("title: 'Test Blog'");
      expect(content).toContain("name: 'Test Author'");
      expect(content).toContain('debug: false');
      expect(content).toContain('themeChange: true');

      // Check headers
      expect(content).toContain("headers: [");
      expect(content).toContain("title: 'About'");
      expect(content).toContain("type: 'article'");

      // Check markdown
      expect(content).toContain('markdown: {');
      expect(content).toContain('enable: true');
    });

    it('should escape single quotes in strings', () => {
      const config = {
        debug: false,
        readmeUrl: '',
        title: "It's a Blog",
        name: "O'Brien",
        social: { github: '', linkedin: '' },
        email: '',
        repo: '',
        resume_url: '',
        default: 'About',
        headers: [],
        markdown: {
          enable: true,
          loading: false,
          renderDelay: 0,
          tabSize: 2,
          linkStyle: { textDecoration: 'none', color: '#0077ff' }
        },
        themeChange: true
      };

      const content = configToJsContent(config);

      expect(content).toContain("title: 'It\\'s a Blog'");
      expect(content).toContain("name: 'O\\'Brien'");
    });

    it('should not include colors in exported config', () => {
      const config = {
        debug: false,
        readmeUrl: '',
        title: 'Test',
        name: 'Test',
        social: { github: '', linkedin: '' },
        email: '',
        repo: '',
        resume_url: '',
        default: 'About',
        headers: [],
        markdown: {
          enable: true,
          loading: false,
          renderDelay: 0,
          tabSize: 2,
          linkStyle: { textDecoration: 'none', color: '#0077ff' }
        },
        themeChange: true
      };

      const content = configToJsContent(config);

      // Colors should not be in the exported config since they don't affect the blog
      expect(content).not.toContain('colors:');
    });
  });

  describe('generateConfigFromState', () => {
    it('should preserve customUrl for Tech Stack header', () => {
      const formState = {
        blogTitle: 'Test Blog',
        authorName: 'Test Author',
        email: '',
        githubUsername: '',
        linkedinUrl: '',
        repoUrl: '',
        resumeUrl: '',
        debug: false,
        themeChange: true,
        // Preserve existing headers with customUrl
        headers: [
          { title: 'Tech Stack', type: 'article', customUrl: 'TechStack' }
        ],
        pages: {
          about: false,
          blog: false,
          projects: false,
          techstack: true,
          links: false,
          resume: false
        },
        markdownEnable: false,
        markdownLoading: false,
        markdownRenderDelay: 0,
        markdownTabSize: 2,
        markdownLinkUnderline: false,
        markdownLinkColor: '#0077ff'
      };

      const result = generateConfigFromState(formState);

      const techStack = result.headers.find(h => h.title === 'Tech Stack');
      expect(techStack).toBeDefined();
      expect(techStack.customUrl).toBe('TechStack');
      expect(techStack.type).toBe('article');
    });

    it('should preserve customUrl for Projects header', () => {
      const formState = {
        blogTitle: 'Test Blog',
        authorName: 'Test Author',
        email: '',
        githubUsername: '',
        linkedinUrl: '',
        repoUrl: '',
        resumeUrl: '',
        debug: false,
        themeChange: true,
        headers: [
          { title: 'Projects', type: 'article', customUrl: 'Projects/Project' }
        ],
        pages: {
          about: false,
          blog: false,
          projects: true,
          techstack: false,
          links: false,
          resume: false
        },
        markdownEnable: false,
        markdownLoading: false,
        markdownRenderDelay: 0,
        markdownTabSize: 2,
        markdownLinkUnderline: false,
        markdownLinkColor: '#0077ff'
      };

      const result = generateConfigFromState(formState);

      const projects = result.headers.find(h => h.title === 'Projects');
      expect(projects).toBeDefined();
      expect(projects.customUrl).toBe('Projects/Project');
    });

    it('should preserve type and customUrl for Resume link header', () => {
      const formState = {
        blogTitle: 'Test Blog',
        authorName: 'Test Author',
        email: '',
        githubUsername: '',
        linkedinUrl: '',
        repoUrl: '',
        resumeUrl: 'https://example.com/resume.pdf',
        debug: false,
        themeChange: true,
        headers: [
          { title: 'Resume', type: 'link', customUrl: 'https://example.com/resume.pdf' }
        ],
        pages: {
          about: false,
          blog: false,
          projects: false,
          techstack: false,
          links: false,
          resume: true
        },
        markdownEnable: false,
        markdownLoading: false,
        markdownRenderDelay: 0,
        markdownTabSize: 2,
        markdownLinkUnderline: false,
        markdownLinkColor: '#0077ff'
      };

      const result = generateConfigFromState(formState);

      const resume = result.headers.find(h => h.title === 'Resume');
      expect(resume).toBeDefined();
      expect(resume.type).toBe('link');
      expect(resume.customUrl).toBe('https://example.com/resume.pdf');
    });

    it('should create new Resume header with type link when resumeUrl is provided', () => {
      const formState = {
        blogTitle: 'Test Blog',
        authorName: 'Test Author',
        email: '',
        githubUsername: '',
        linkedinUrl: '',
        repoUrl: '',
        resumeUrl: 'https://new-url.com/cv',
        debug: false,
        themeChange: true,
        headers: [],
        pages: {
          about: false,
          blog: false,
          projects: false,
          techstack: false,
          links: false,
          resume: true
        },
        markdownEnable: false,
        markdownLoading: false,
        markdownRenderDelay: 0,
        markdownTabSize: 2,
        markdownLinkUnderline: false,
        markdownLinkColor: '#0077ff'
      };

      const result = generateConfigFromState(formState);

      const resume = result.headers.find(h => h.title === 'Resume');
      expect(resume).toBeDefined();
      expect(resume.type).toBe('link');
      expect(resume.customUrl).toBe('https://new-url.com/cv');
    });

    it('should not include colors in generated config', () => {
      const formState = {
        blogTitle: 'Test Blog',
        authorName: 'Test Author',
        email: '',
        githubUsername: '',
        linkedinUrl: '',
        repoUrl: '',
        resumeUrl: '',
        debug: false,
        themeChange: true,
        headers: [],
        pages: {
          about: false,
          blog: false,
          projects: false,
          techstack: false,
          links: false,
          resume: false
        },
        markdownEnable: false,
        markdownLoading: false,
        markdownRenderDelay: 0,
        markdownTabSize: 2,
        markdownLinkUnderline: false,
        markdownLinkColor: '#0077ff'
      };

      const result = generateConfigFromState(formState);

      // Colors should not be in generated config
      expect(result.colors).toBeUndefined();
    });

    it('should generate correct social links from username', () => {
      const formState = {
        blogTitle: 'Test',
        authorName: 'Test',
        email: '',
        githubUsername: 'testuser',
        linkedinUrl: 'https://linkedin.com/in/test',
        repoUrl: '',
        resumeUrl: '',
        debug: false,
        themeChange: true,
        headers: [],
        pages: {
          about: false,
          blog: false,
          projects: false,
          techstack: false,
          links: false,
          resume: false
        },
        markdownEnable: false,
        markdownLoading: false,
        markdownRenderDelay: 0,
        markdownTabSize: 2,
        markdownLinkUnderline: false,
        markdownLinkColor: '#0077ff'
      };

      const result = generateConfigFromState(formState);

      expect(result.social.github).toBe('https://github.com/testuser');
      expect(result.social.linkedin).toBe('https://linkedin.com/in/test');
    });

    it('should generate readmeUrl from repoUrl', () => {
      const formState = {
        blogTitle: 'Test',
        authorName: 'Test',
        email: '',
        githubUsername: '',
        linkedinUrl: '',
        repoUrl: 'https://github.com/user/repo',
        resumeUrl: '',
        debug: false,
        themeChange: true,
        headers: [],
        pages: {
          about: false,
          blog: false,
          projects: false,
          techstack: false,
          links: false,
          resume: false
        },
        markdownEnable: false,
        markdownLoading: false,
        markdownRenderDelay: 0,
        markdownTabSize: 2,
        markdownLinkUnderline: false,
        markdownLinkColor: '#0077ff'
      };

      const result = generateConfigFromState(formState);

      expect(result.readmeUrl).toBe('https://github.com/user/repo/blob/main/README.md');
    });
  });
});

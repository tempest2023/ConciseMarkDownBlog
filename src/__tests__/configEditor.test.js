/**
 * @file Unit tests for ConfigEditor component
 * @description Tests for GUI config editor functionality
 */

import { generateConfigFromState, configToJsContent, escapeString } from '../components/config/ConfigEditor';

describe('ConfigEditor', () => {
  describe('generateConfigFromState', () => {
    const mockFormState = {
      blogTitle: 'Test Blog',
      authorName: 'Test Author',
      email: 'test@example.com',
      githubUsername: 'testuser',
      linkedinUrl: 'https://linkedin.com/in/testuser',
      repoUrl: 'https://github.com/testuser/blog',
      resumeUrl: 'https://example.com/resume.pdf',
      debug: false,
      themeChange: true,
      pages: {
        about: true,
        blog: true,
        projects: true,
        techstack: true,
        links: true,
        resume: true
      },
      markdownEnable: true,
      markdownLoading: false,
      markdownRenderDelay: '0',
      markdownTabSize: '2',
      markdownLinkUnderline: false,
      markdownLinkColor: '#0077ff',
      colors: {
        light: {
          background: '#ffffff',
          foreground: '#feb272',
          gray: '#212529'
        },
        dark: {
          background: '#212020',
          foreground: '#653208',
          gray: '#a9a9b3'
        }
      }
    };

    it('should generate config with basic info', () => {
      const config = generateConfigFromState(mockFormState);

      expect(config.title).toBe('Test Blog');
      expect(config.name).toBe('Test Author');
      expect(config.email).toBe('test@example.com');
    });

    it('should generate GitHub URL from username', () => {
      const config = generateConfigFromState(mockFormState);
      expect(config.social.github).toBe('https://github.com/testuser');
    });

    it('should handle empty GitHub username', () => {
      const state = { ...mockFormState, githubUsername: '' };
      const config = generateConfigFromState(state);
      expect(config.social.github).toBe('');
    });

    it('should set LinkedIn URL', () => {
      const config = generateConfigFromState(mockFormState);
      expect(config.social.linkedin).toBe('https://linkedin.com/in/testuser');
    });

    it('should set repo URL and derive readmeUrl', () => {
      const config = generateConfigFromState(mockFormState);
      expect(config.repo).toBe('https://github.com/testuser/blog');
      expect(config.readmeUrl).toBe('https://github.com/testuser/blog/blob/main/README.md');
    });

    it('should handle empty repo URL', () => {
      const state = { ...mockFormState, repoUrl: '' };
      const config = generateConfigFromState(state);
      expect(config.repo).toBe('');
      expect(config.readmeUrl).toBe('');
    });

    it('should set resume URL', () => {
      const config = generateConfigFromState(mockFormState);
      expect(config.resume_url).toBe('https://example.com/resume.pdf');
    });

    it('should generate headers based on pages', () => {
      const config = generateConfigFromState(mockFormState);

      const titles = config.headers.map(h => h.title);
      expect(titles).toContain('About');
      expect(titles).toContain('Blog');
      expect(titles).toContain('Projects');
      expect(titles).toContain('Tech Stack');
      expect(titles).toContain('Links');
      expect(titles).toContain('MarkDown');
      expect(titles).toContain('Resume');
    });

    it('should always include MarkDown header', () => {
      const state = { ...mockFormState, pages: { ...mockFormState.pages, about: false, blog: false } };
      const config = generateConfigFromState(state);

      const markdownHeader = config.headers.find(h => h.title === 'MarkDown');
      expect(markdownHeader).toBeDefined();
    });

    it('should set Projects header with customUrl', () => {
      const config = generateConfigFromState(mockFormState);
      const projectsHeader = config.headers.find(h => h.title === 'Projects');

      expect(projectsHeader).toBeDefined();
      expect(projectsHeader.customUrl).toBe('Projects/Project');
    });

    it('should set Tech Stack header with customUrl', () => {
      const config = generateConfigFromState(mockFormState);
      const techStackHeader = config.headers.find(h => h.title === 'Tech Stack');

      expect(techStackHeader).toBeDefined();
      expect(techStackHeader.customUrl).toBe('TechStack');
    });

    it('should set Resume header as link type when resume page enabled', () => {
      const config = generateConfigFromState(mockFormState);
      const resumeHeader = config.headers.find(h => h.title === 'Resume');

      expect(resumeHeader).toBeDefined();
      expect(resumeHeader.type).toBe('link');
      expect(resumeHeader.customUrl).toBe('https://example.com/resume.pdf');
    });

    it('should not include Resume header when resume page disabled', () => {
      const state = { ...mockFormState, pages: { ...mockFormState.pages, resume: false } };
      const config = generateConfigFromState(state);

      const resumeHeader = config.headers.find(h => h.title === 'Resume');
      expect(resumeHeader).toBeUndefined();
    });

    it('should not include Resume header when no resume URL', () => {
      const state = { ...mockFormState, resumeUrl: '' };
      const config = generateConfigFromState(state);

      const resumeHeader = config.headers.find(h => h.title === 'Resume');
      expect(resumeHeader).toBeUndefined();
    });

    it('should handle markdown settings', () => {
      const config = generateConfigFromState(mockFormState);

      expect(config.markdown.enable).toBe(true);
      expect(config.markdown.loading).toBe(false);
      expect(config.markdown.renderDelay).toBe(0);
      expect(config.markdown.tabSize).toBe(2);
      expect(config.markdown.linkStyle.textDecoration).toBe('none');
      expect(config.markdown.linkStyle.color).toBe('#0077ff');
    });

    it('should handle markdown link underline', () => {
      const state = { ...mockFormState, markdownLinkUnderline: true };
      const config = generateConfigFromState(state);

      expect(config.markdown.linkStyle.textDecoration).toBe('underline');
    });

    it('should handle colors', () => {
      const config = generateConfigFromState(mockFormState);

      expect(config.colors.light.background).toBe('#ffffff');
      expect(config.colors.light.foreground).toBe('#feb272');
      expect(config.colors.dark.background).toBe('#212020');
      expect(config.colors.dark.foreground).toBe('#653208');
    });

    it('should set themeChange', () => {
      const config = generateConfigFromState(mockFormState);
      expect(config.themeChange).toBe(true);
    });

    it('should set debug', () => {
      const config = generateConfigFromState(mockFormState);
      expect(config.debug).toBe(false);
    });

    it('should set default page to About', () => {
      const config = generateConfigFromState(mockFormState);
      expect(config.default).toBe('About');
    });
  });

  describe('configToJsContent', () => {
    const mockConfig = {
      debug: false,
      readmeUrl: 'https://github.com/user/repo/blob/main/README.md',
      title: 'Test Blog',
      name: 'Test Author',
      social: {
        github: 'https://github.com/testuser',
        linkedin: 'https://linkedin.com/in/testuser'
      },
      email: 'test@example.com',
      repo: 'https://github.com/testuser/blog',
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
      themeChange: true,
      colors: {
        light: { background: '#ffffff', foreground: '#feb272', gray: '#212529' },
        dark: { background: '#212020', foreground: '#653208', gray: '#a9a9b3' }
      }
    };

    it('should generate valid JavaScript content', () => {
      const content = configToJsContent(mockConfig);

      expect(content).toContain('const config = {');
      expect(content).toContain('export default config;');
    });

    it('should include JSDoc header', () => {
      const content = configToJsContent(mockConfig);

      expect(content).toContain('@author Test Author');
      expect(content).toContain('@email test@example.com');
      expect(content).toContain('@desc Blog Configuration');
    });

    it('should include basic config values', () => {
      const content = configToJsContent(mockConfig);

      expect(content).toContain("title: 'Test Blog'");
      expect(content).toContain("name: 'Test Author'");
      expect(content).toContain("email: 'test@example.com'");
    });

    it('should include social links', () => {
      const content = configToJsContent(mockConfig);

      expect(content).toContain("github: 'https://github.com/testuser'");
      expect(content).toContain("linkedin: 'https://linkedin.com/in/testuser'");
    });

    it('should include headers array', () => {
      const content = configToJsContent(mockConfig);

      expect(content).toContain('headers:');
      expect(content).toContain("title: 'About'");
      expect(content).toContain("type: 'article'");
    });

    it('should include markdown settings', () => {
      const content = configToJsContent(mockConfig);

      expect(content).toContain('markdown:');
      expect(content).toContain('enable: true');
      expect(content).toContain('tabSize: 2');
    });

    it('should include colors', () => {
      const content = configToJsContent(mockConfig);

      expect(content).toContain('colors:');
      expect(content).toContain("'background': '#ffffff'");
      expect(content).toContain("'foreground': '#feb272'");
    });

    it('should include themeChange setting', () => {
      const content = configToJsContent(mockConfig);
      expect(content).toContain('themeChange: true');
    });

    it('should handle empty values', () => {
      const emptyConfig = {
        ...mockConfig,
        email: '',
        social: { github: '', linkedin: '' }
      };
      const content = configToJsContent(emptyConfig);

      expect(content).toContain("email: ''");
      expect(content).toContain("github: ''");
    });

    it('should format dates correctly', () => {
      const content = configToJsContent(mockConfig);
      const today = new Date().toISOString().split('T')[0];

      expect(content).toContain(`@create date ${today}`);
      expect(content).toContain(`@modify date ${today}`);
    });

    it('should escape single quotes in strings', () => {
      const configWithQuotes = {
        ...mockConfig,
        title: "Tempest's Blog",
        name: "O'Brien"
      };
      const content = configToJsContent(configWithQuotes);

      // The single quote should be escaped
      expect(content).toContain("title: 'Tempest\\'s Blog'");
      expect(content).toContain("name: 'O\\'Brien'");
    });

    it('should escape backslashes in strings', () => {
      const configWithBackslash = {
        ...mockConfig,
        title: "My \\ Blog"
      };
      const content = configToJsContent(configWithBackslash);

      expect(content).toContain("title: 'My \\\\ Blog'");
    });

    it('should handle strings with both quotes and backslashes', () => {
      const configWithBoth = {
        ...mockConfig,
        title: "It's \\ amazing"
      };
      const content = configToJsContent(configWithBoth);

      expect(content).toContain("title: 'It\\'s \\\\ amazing'");
    });
  });

  describe('escapeString', () => {
    it('should return the string as is when no special characters', () => {
      expect(escapeString('Hello World')).toBe('Hello World');
      expect(escapeString('Test Blog 123')).toBe('Test Blog 123');
    });

    it('should escape single quotes', () => {
      expect(escapeString("It's a test")).toBe("It\\'s a test");
      expect(escapeString("O'Brien's Blog")).toBe("O\\'Brien\\'s Blog");
      expect(escapeString("Tempest's Blog")).toBe("Tempest\\'s Blog");
    });

    it('should escape backslashes', () => {
      expect(escapeString('C:\\path\\to\\file')).toBe('C:\\\\path\\\\to\\\\file');
      expect(escapeString('Line1\\nLine2')).toBe('Line1\\\\nLine2');
    });

    it('should escape both single quotes and backslashes', () => {
      expect(escapeString("It's \\ path")).toBe("It\\'s \\\\ path");
    });

    it('should handle empty strings', () => {
      expect(escapeString('')).toBe('');
    });

    it('should return non-string values as is', () => {
      expect(escapeString(null)).toBe(null);
      expect(escapeString(undefined)).toBe(undefined);
      expect(escapeString(123)).toBe(123);
    });
  });
});

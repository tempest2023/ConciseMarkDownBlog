/**
 * @file Config Structure Tests
 * @description Tests to verify actual config.js structure works with the blog
 */

import config from '../config';

describe('Config Structure Validation', () => {
  it('should have all required top-level properties', () => {
    expect(config.title).toBeDefined();
    expect(config.name).toBeDefined();
    expect(config.email).toBeDefined();
    expect(config.social).toBeDefined();
    expect(config.repo).toBeDefined();
    expect(config.headers).toBeDefined();
    expect(config.markdown).toBeDefined();
  });

  it('should have valid headers array', () => {
    expect(Array.isArray(config.headers)).toBe(true);
    expect(config.headers.length).toBeGreaterThan(0);

    config.headers.forEach(header => {
      expect(header.title).toBeDefined();
      expect(header.type).toBeDefined();
      expect(['article', 'link']).toContain(header.type);
    });
  });

  it('should have About as first header', () => {
    const aboutHeader = config.headers[0];
    expect(aboutHeader.title).toBe('About');
    expect(aboutHeader.type).toBe('article');
  });

  it('should have Tech Stack header with customUrl', () => {
    const techStackHeader = config.headers.find(h => h.title === 'Tech Stack');
    expect(techStackHeader).toBeDefined();
    expect(techStackHeader.type).toBe('article');
    expect(techStackHeader.customUrl).toBe('TechStack');
  });

  it('should have Projects header with customUrl', () => {
    const projectsHeader = config.headers.find(h => h.title === 'Projects');
    expect(projectsHeader).toBeDefined();
    expect(projectsHeader.type).toBe('article');
    expect(projectsHeader.customUrl).toBe('Projects/Project');
  });

  it('should have Resume as link type with customUrl', () => {
    const resumeHeader = config.headers.find(h => h.title === 'Resume');
    expect(resumeHeader).toBeDefined();
    expect(resumeHeader.type).toBe('link');
    expect(resumeHeader.customUrl).toBeDefined();
    expect(resumeHeader.customUrl).toMatch(/^https?:\/\//);
  });

  it('should have Links header', () => {
    const linksHeader = config.headers.find(h => h.title === 'Links');
    expect(linksHeader).toBeDefined();
    expect(linksHeader.type).toBe('article');
  });

  it('should have MarkDown header', () => {
    const markdownHeader = config.headers.find(h => h.title === 'MarkDown');
    expect(markdownHeader).toBeDefined();
    expect(markdownHeader.type).toBe('article');
  });

  it('should have Blog header', () => {
    const blogHeader = config.headers.find(h => h.title === 'Blog');
    expect(blogHeader).toBeDefined();
    expect(blogHeader.type).toBe('article');
  });

  it('should have valid markdown settings', () => {
    expect(config.markdown.enable).toBeDefined();
    expect(config.markdown.tabSize).toBeDefined();
    expect(config.markdown.linkStyle).toBeDefined();
    expect(config.markdown.linkStyle.textDecoration).toBeDefined();
    expect(config.markdown.linkStyle.color).toBeDefined();
  });

  it('should have themeChange boolean', () => {
    expect(typeof config.themeChange).toBe('boolean');
  });

  it('should have colors object with light and dark', () => {
    expect(config.colors).toBeDefined();
    expect(config.colors.light).toBeDefined();
    expect(config.colors.dark).toBeDefined();
    expect(config.colors.light.background).toBeDefined();
    expect(config.colors.light.foreground).toBeDefined();
    expect(config.colors.light.gray).toBeDefined();
  });
});

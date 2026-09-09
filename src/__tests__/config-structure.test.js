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

  it('prioritizes work, writing and projects without exposing utilities in the menu', () => {
    expect(config.headers.map(h => h.title)).toEqual(['About', 'Work & Research', 'Writing', 'Projects']);
    expect(config.headers.find(h => h.title === 'Work & Research').customUrl).toBe('Work');
    expect(config.headers.find(h => h.title === 'Writing').customUrl).toBe('Blog');
    expect(config.headers.find(h => h.title === 'Projects').customUrl).toBe('Projects/Project');
    expect(config.headers.find(h => h.title === 'Ask Tempest')).toBeUndefined();
  });

  it('should have valid markdown settings', () => {
    expect(config.markdown.enable).toBeDefined();
    expect(config.markdown.tabSize).toBeDefined();
    expect(config.markdown.linkStyle).toBeDefined();
    expect(config.markdown.linkStyle.textDecoration).toBeDefined();
    expect(config.markdown.linkStyle.color).toBeDefined();
  });

  it('should have themeEnable boolean', () => {
    expect(typeof config.themeEnable).toBe('boolean');
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

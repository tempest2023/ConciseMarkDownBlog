/**
 * @file Config Editor Component
 * @description GUI-based configuration editor for local development only
 */

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './configEditor.module.css';
import { hasConfigAccess } from '../../util/isLocal';
import config from '../../config';

// Theme presets
const THEMES = {
  default: {
    light: { background: '#ffffff', foreground: '#feb272', gray: '#212529' },
    dark: { background: '#212020', foreground: '#653208', gray: '#a9a9b3' }
  },
  ocean: {
    light: { background: '#f0f9ff', foreground: '#0ea5e9', gray: '#1e293b' },
    dark: { background: '#0f172a', foreground: '#38bdf8', gray: '#94a3b8' }
  },
  forest: {
    light: { background: '#f0fdf4', foreground: '#22c55e', gray: '#1e293b' },
    dark: { background: '#052e16', foreground: '#4ade80', gray: '#86efac' }
  },
  berry: {
    light: { background: '#fdf2f8', foreground: '#ec4899', gray: '#1e293b' },
    dark: { background: '#500724', foreground: '#f472b6', gray: '#fbcfe8' }
  }
};

/**
 * Parses GitHub username from URL
 * @param {string} url - GitHub URL
 * @returns {string} - Username or empty string
 */
function parseGithubUsername (url) {
  if (!url) return '';
  const match = url.match(/github\.com\/([^/]+)/);
  return match ? match[1] : '';
}

/**
 * Generates config object from form state
 * @param {Object} formState - Current form state
 * @returns {Object} - Config object
 */
export function generateConfigFromState (formState) {
  const githubUrl = formState.githubUsername
    ? `https://github.com/${formState.githubUsername}`
    : '';

  const headers = [];
  if (formState.pages.about) headers.push({ title: 'About', type: 'article' });
  if (formState.pages.blog) headers.push({ title: 'Blog', type: 'article' });
  if (formState.pages.projects) {
    headers.push({ title: 'Projects', type: 'article', customUrl: 'Projects/Project' });
  }
  if (formState.pages.techstack) {
    headers.push({ title: 'Tech Stack', type: 'article', customUrl: 'TechStack' });
  }
  if (formState.pages.links) headers.push({ title: 'Links', type: 'article' });
  headers.push({ title: 'MarkDown', type: 'article' });
  if (formState.pages.resume && formState.resumeUrl) {
    headers.push({ title: 'Resume', type: 'link', customUrl: formState.resumeUrl });
  }

  return {
    debug: formState.debug,
    readmeUrl: formState.repoUrl ? `${formState.repoUrl}/blob/main/README.md` : '',
    title: formState.blogTitle,
    name: formState.authorName,
    social: {
      github: githubUrl,
      linkedin: formState.linkedinUrl
    },
    email: formState.email,
    repo: formState.repoUrl,
    resume_url: formState.resumeUrl,
    default: 'About',
    headers,
    markdown: {
      enable: formState.markdownEnable,
      loading: formState.markdownLoading,
      renderDelay: parseInt(formState.markdownRenderDelay, 10) || 0,
      tabSize: parseInt(formState.markdownTabSize, 10) || 2,
      linkStyle: {
        textDecoration: formState.markdownLinkUnderline ? 'underline' : 'none',
        color: formState.markdownLinkColor
      }
    },
    themeChange: formState.themeChange,
    colors: {
      light: { ...formState.colors.light },
      dark: { ...formState.colors.dark }
    }
  };
}

/**
 * Escapes single quotes in a string for use in single-quoted JavaScript strings
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
export function escapeString (str) {
  if (typeof str !== 'string') return str;
  // Escape single quotes and backslashes
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/**
 * Formats an object for config output with proper indentation
 * @param {Object} obj - Object to format
 * @param {number} baseIndent - Base indentation level (spaces)
 * @returns {string} - Formatted string
 */
export function formatObject (obj, baseIndent = 2) {
  // Get the JSON representation
  const jsonStr = JSON.stringify(obj, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, "'");

  const lines = jsonStr.split('\n');
  const baseSpaces = ' '.repeat(baseIndent);

  // First line is opening brace, subsequent lines need baseIndent added
  // but we need to preserve the relative indentation of nested content
  return lines
    .map((line, index) => {
      if (index === 0) {
        // Opening brace stays as is
        return line;
      }
      // For all other lines, add baseIndent spaces
      // The line already has its own indentation from JSON.stringify (2 spaces per level)
      // We need to add baseIndent to get the correct absolute position
      return baseSpaces + line;
    })
    .join('\n');
}

/**
 * Converts config object to JavaScript file content
 * @param {Object} configObj - Config object
 * @returns {string} - JavaScript file content
 */
export function configToJsContent (configObj) {
  const colorsStr = formatObject(configObj.colors, 2);
  const headersStr = formatObject(configObj.headers, 2);
  const linkStyleStr = formatObject(configObj.markdown.linkStyle, 4);

  return `/**
 * @author ${escapeString(configObj.name)}
 * @email ${escapeString(configObj.email)}
 * @create date ${new Date().toISOString().split('T')[0]}
 * @modify date ${new Date().toISOString().split('T')[0]}
 * @desc Blog Configuration - Generated by GUI Config Editor
 */
const config = {
  debug: ${configObj.debug},
  // github readme url
  readmeUrl: '${escapeString(configObj.readmeUrl)}',
  // blog title, on left top of the page
  title: '${escapeString(configObj.title)}',
  // author name
  name: '${escapeString(configObj.name)}',
  // social links, on bottom of the page
  social: {
    github: '${escapeString(configObj.social.github)}',
    linkedin: '${escapeString(configObj.social.linkedin)}'
  },
  email: '${escapeString(configObj.email)}',
  repo: '${escapeString(configObj.repo)}',
  resume_url: '${escapeString(configObj.resume_url)}',
  // default content shown on the main page, /src/articles/[config.default].md
  default: '${escapeString(configObj.default)}',
  headers: ${headersStr},
  // markdown settings
  markdown: {
    // set it false to disable markdown editor
    enable: ${configObj.markdown.enable},
    // set it true to enable loading animation in refreshing markdown preview.
    loading: ${configObj.markdown.loading},
    // delay time for refreshing markdown preview
    renderDelay: ${configObj.markdown.renderDelay},
    // tab size for markdown editor
    tabSize: ${configObj.markdown.tabSize},
    // the links in markdown does not have underlines, set it true to enable underline
    linkStyle: ${linkStyleStr}
  },
  themeChange: ${configObj.themeChange},
  colors: ${colorsStr}
}

export default config;
`;
}

/**
 * Initializes form state from existing config
 * @returns {Object} - Initial form state
 */
function getInitialFormState () {
  const githubUsername = parseGithubUsername(config.social?.github);

  const pages = {
    about: config.headers?.some(h => h.title === 'About') || true,
    blog: config.headers?.some(h => h.title === 'Blog') || false,
    projects: config.headers?.some(h => h.title === 'Projects') || false,
    techstack: config.headers?.some(h => h.title === 'Tech Stack') || false,
    links: config.headers?.some(h => h.title === 'Links') || false,
    resume: config.headers?.some(h => h.title === 'Resume') || false
  };

  return {
    blogTitle: config.title || '',
    authorName: config.name || '',
    email: config.email || '',
    githubUsername,
    linkedinUrl: config.social?.linkedin || '',
    repoUrl: config.repo || '',
    resumeUrl: config.resume_url || '',
    debug: config.debug || false,
    themeChange: config.themeChange !== false,
    themePreset: 'custom',
    colors: {
      light: { ...config.colors?.light } || { background: '#ffffff', foreground: '#feb272', gray: '#212529' },
      dark: { ...config.colors?.dark } || { background: '#212020', foreground: '#653208', gray: '#a9a9b3' }
    },
    pages,
    markdownEnable: config.markdown?.enable !== false,
    markdownLoading: config.markdown?.loading || false,
    markdownRenderDelay: config.markdown?.renderDelay || 0,
    markdownTabSize: config.markdown?.tabSize || 2,
    markdownLinkUnderline: config.markdown?.linkStyle?.textDecoration === 'underline',
    markdownLinkColor: config.markdown?.linkStyle?.color || '#0077ff'
  };
}

// Tab components
const TabGeneral = ({ formState, setFormState }) => (
  <div className={styles['tab-content']}>
    <h2>General Settings</h2>

    <div className={styles['form-group']}>
      <label htmlFor="blogTitle">Blog Title *</label>
      <input
        type="text"
        id="blogTitle"
        value={formState.blogTitle}
        onChange={(e) => setFormState(prev => ({ ...prev, blogTitle: e.target.value }))}
        placeholder="My Awesome Blog"
        required
      />
      <small>Displayed in the header and browser tab</small>
    </div>

    <div className={styles['form-group']}>
      <label htmlFor="authorName">Author Name *</label>
      <input
        type="text"
        id="authorName"
        value={formState.authorName}
        onChange={(e) => setFormState(prev => ({ ...prev, authorName: e.target.value }))}
        placeholder="John Doe"
        required
      />
    </div>

    <div className={styles['form-group']}>
      <label htmlFor="email">Email Address</label>
      <input
        type="email"
        id="email"
        value={formState.email}
        onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
        placeholder="john@example.com"
      />
    </div>

    <div className={styles['form-group']}>
      <label htmlFor="repoUrl">GitHub Repository URL</label>
      <input
        type="url"
        id="repoUrl"
        value={formState.repoUrl}
        onChange={(e) => setFormState(prev => ({ ...prev, repoUrl: e.target.value }))}
        placeholder="https://github.com/username/repo"
      />
      <small>Used to generate README and issue links</small>
    </div>
  </div>
);

const TabSocial = ({ formState, setFormState }) => (
  <div className={styles['tab-content']}>
    <h2>Social Links</h2>

    <div className={styles['form-group']}>
      <label htmlFor="githubUsername">GitHub Username</label>
      <input
        type="text"
        id="githubUsername"
        value={formState.githubUsername}
        onChange={(e) => setFormState(prev => ({ ...prev, githubUsername: e.target.value }))}
        placeholder="username"
      />
    </div>

    <div className={styles['form-group']}>
      <label htmlFor="linkedinUrl">LinkedIn URL</label>
      <input
        type="url"
        id="linkedinUrl"
        value={formState.linkedinUrl}
        onChange={(e) => setFormState(prev => ({ ...prev, linkedinUrl: e.target.value }))}
        placeholder="https://linkedin.com/in/username"
      />
    </div>

    <div className={styles['form-group']}>
      <label htmlFor="resumeUrl">Resume/CV URL</label>
      <input
        type="url"
        id="resumeUrl"
        value={formState.resumeUrl}
        onChange={(e) => setFormState(prev => ({ ...prev, resumeUrl: e.target.value }))}
        placeholder="https://example.com/resume.pdf"
      />
      <small>Add a Resume link to navigation</small>
    </div>
  </div>
);

const TabPages = ({ formState, setFormState }) => {
  const togglePage = (page) => {
    setFormState(prev => ({
      ...prev,
      pages: { ...prev.pages, [page]: !prev.pages[page] }
    }));
  };

  return (
    <div className={styles['tab-content']}>
      <h2>Page Configuration</h2>
      <p>Select which pages to include in your navigation:</p>

      <div className={styles['form-group']}>
        <div className={styles['checkbox-group']}>
          <label>
            <input
              type="checkbox"
              checked={formState.pages.about}
              onChange={() => togglePage('about')}
            />
            About (Home page)
          </label>
        </div>

        <div className={styles['checkbox-group']}>
          <label>
            <input
              type="checkbox"
              checked={formState.pages.blog}
              onChange={() => togglePage('blog')}
            />
            Blog
          </label>
        </div>

        <div className={styles['checkbox-group']}>
          <label>
            <input
              type="checkbox"
              checked={formState.pages.projects}
              onChange={() => togglePage('projects')}
            />
            Projects
          </label>
        </div>

        <div className={styles['checkbox-group']}>
          <label>
            <input
              type="checkbox"
              checked={formState.pages.techstack}
              onChange={() => togglePage('techstack')}
            />
            Tech Stack
          </label>
        </div>

        <div className={styles['checkbox-group']}>
          <label>
            <input
              type="checkbox"
              checked={formState.pages.links}
              onChange={() => togglePage('links')}
            />
            Links
          </label>
        </div>

        <div className={styles['checkbox-group']}>
          <label>
            <input
              type="checkbox"
              checked={formState.pages.resume}
              onChange={() => togglePage('resume')}
            />
            Resume Link (requires Resume URL)
          </label>
        </div>
      </div>

      <div className={styles['form-group']}>
        <div className={styles['checkbox-group']}>
          <label>
            <input
              type="checkbox"
              checked={formState.markdownEnable}
              onChange={() => setFormState(prev => ({ ...prev, markdownEnable: !prev.markdownEnable }))}
            />
            Enable Markdown Editor
          </label>
          <small>The Markdown editor allows writing and previewing markdown</small>
        </div>
      </div>
    </div>
  );
};

const TabTheme = ({ formState, setFormState }) => {
  const applyThemePreset = (presetKey) => {
    const preset = THEMES[presetKey];
    if (preset) {
      setFormState(prev => ({
        ...prev,
        themePreset: presetKey,
        colors: {
          light: { ...preset.light },
          dark: { ...preset.dark }
        }
      }));
    }
  };

  const updateColor = (mode, key, value) => {
    setFormState(prev => ({
      ...prev,
      themePreset: 'custom',
      colors: {
        ...prev.colors,
        [mode]: {
          ...prev.colors[mode],
          [key]: value
        }
      }
    }));
  };

  return (
    <div className={styles['tab-content']}>
      <h2>Theme Settings</h2>

      <div className={styles['form-group']}>
        <div className={styles['checkbox-group']}>
          <label>
            <input
              type="checkbox"
              checked={formState.themeChange}
              onChange={() => setFormState(prev => ({ ...prev, themeChange: !prev.themeChange }))}
            />
            Enable Theme Switcher (Light/Dark mode toggle)
          </label>
        </div>
      </div>

      <div className={styles['form-group']}>
        <label htmlFor="themePreset">Theme Preset</label>
        <select
          id="themePreset"
          value={formState.themePreset}
          onChange={(e) => applyThemePreset(e.target.value)}
        >
          <option value="custom">Custom</option>
          <option value="default">Default (Warm Orange)</option>
          <option value="ocean">Ocean (Blue)</option>
          <option value="forest">Forest (Green)</option>
          <option value="berry">Berry (Pink)</option>
        </select>
      </div>

      <div className={styles['color-section']}>
        <h3>Light Mode Colors</h3>
        <div className={styles['color-grid']}>
          {['background', 'foreground', 'gray'].map(key => (
            <div key={`light-${key}`} className={styles['color-input']}>
              <label htmlFor={`light-${key}`}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type="color"
                id={`light-${key}`}
                value={formState.colors.light[key]}
                onChange={(e) => updateColor('light', key, e.target.value)}
              />
              <input
                type="text"
                value={formState.colors.light[key]}
                onChange={(e) => updateColor('light', key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles['color-section']}>
        <h3>Dark Mode Colors</h3>
        <div className={styles['color-grid']}>
          {['background', 'foreground', 'gray'].map(key => (
            <div key={`dark-${key}`} className={styles['color-input']}>
              <label htmlFor={`dark-${key}`}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type="color"
                id={`dark-${key}`}
                value={formState.colors.dark[key]}
                onChange={(e) => updateColor('dark', key, e.target.value)}
              />
              <input
                type="text"
                value={formState.colors.dark[key]}
                onChange={(e) => updateColor('dark', key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

TabGeneral.propTypes = {
  formState: PropTypes.object.isRequired,
  setFormState: PropTypes.func.isRequired
};

TabSocial.propTypes = {
  formState: PropTypes.object.isRequired,
  setFormState: PropTypes.func.isRequired
};

TabPages.propTypes = {
  formState: PropTypes.object.isRequired,
  setFormState: PropTypes.func.isRequired
};

TabTheme.propTypes = {
  formState: PropTypes.object.isRequired,
  setFormState: PropTypes.func.isRequired
};

// Export Modal Component
function ExportModal ({ configContent, onClose, onDownload, onCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
        <div className={styles['modal-header']}>
          <h2>Export Configuration</h2>
          <button className={styles['modal-close']} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles['modal-body']}>
          <div className={styles['export-actions']}>
            <button className={styles['btn-primary']} onClick={onDownload}>
              Download config.js
            </button>
            <button className={styles['btn-secondary']} onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
          <div className={styles['export-preview']}>
            <code>
              <pre>{configContent}</pre>
            </code>
          </div>
          <p className={styles['access-note']}>
            Copy this content to your <code>src/config.js</code> file to apply the changes.
          </p>
        </div>
      </div>
    </div>
  );
}

ExportModal.propTypes = {
  configContent: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired
};

// Main Config Editor Component
export default function ConfigEditor () {
  const [hasAccess, setHasAccess] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [formState, setFormState] = useState(getInitialFormState());
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    setHasAccess(hasConfigAccess());
  }, []);

  const handleExport = useCallback(() => {
    setShowExport(true);
  }, []);

  const handleDownload = useCallback(() => {
    const config = generateConfigFromState(formState);
    const content = configToJsContent(config);
    const blob = new Blob([content], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [formState]);

  const handleCopy = useCallback(() => {
    const config = generateConfigFromState(formState);
    const content = configToJsContent(config);
    navigator.clipboard.writeText(content);
  }, [formState]);

  const handleReset = useCallback(() => {
    if (window.confirm('Reset all settings to current saved values?')) {
      setFormState(getInitialFormState());
    }
  }, []);

  if (hasAccess === null) {
    return (
      <div className={styles.loading}>
        <p>Checking access...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className={styles['access-denied']}>
        <div className={styles['access-denied-content']}>
          <h1>Access Denied</h1>
          <p>
            The configuration editor is only accessible from a local development environment.
          </p>
          <code className={styles['access-hint']}>npm start</code>
          <p className={styles['access-note']}>
            Visitors to your published blog cannot access this page.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General', component: TabGeneral },
    { id: 'social', label: 'Social', component: TabSocial },
    { id: 'pages', label: 'Pages', component: TabPages },
    { id: 'theme', label: 'Theme', component: TabTheme }
  ];

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || TabGeneral;

  return (
    <div className={styles['config-editor-container']}>
      <div className={styles['config-editor-header']}>
        <h1>Blog Configuration</h1>
        <p>Edit your blog settings. Changes will be exported as a config.js file.</p>
      </div>

      <div className={styles['config-editor-tabs']}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ActiveComponent formState={formState} setFormState={setFormState} />

      <div className={styles['config-editor-actions']}>
        <button className={styles['btn-primary']} onClick={handleExport}>
          Export Configuration
        </button>
        <button className={styles['btn-secondary']} onClick={handleReset}>
          Reset to Saved
        </button>
      </div>

      {showExport && (
        <ExportModal
          configContent={configToJsContent(generateConfigFromState(formState))}
          onClose={() => setShowExport(false)}
          onDownload={handleDownload}
          onCopy={handleCopy}
        />
      )}
    </div>
  );
}

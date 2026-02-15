/**
 * @file CLI Setup Tool
 * @description Interactive setup wizard for ConciseMarkDownBlog
 * Helps new users configure their blog with a friendly TUI
 */

const prompts = require('prompts');
const fs = require('fs');
const path = require('path');

// Theme presets
const THEMES = {
  default: {
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
  },
  ocean: {
    light: {
      background: '#f0f9ff',
      foreground: '#0ea5e9',
      gray: '#1e293b'
    },
    dark: {
      background: '#0f172a',
      foreground: '#38bdf8',
      gray: '#94a3b8'
    }
  },
  forest: {
    light: {
      background: '#f0fdf4',
      foreground: '#22c55e',
      gray: '#1e293b'
    },
    dark: {
      background: '#052e16',
      foreground: '#4ade80',
      gray: '#86efac'
    }
  },
  berry: {
    light: {
      background: '#fdf2f8',
      foreground: '#ec4899',
      gray: '#1e293b'
    },
    dark: {
      background: '#500724',
      foreground: '#f472b6',
      gray: '#fbcfe8'
    }
  }
};

// Default config template
const DEFAULT_CONFIG = {
  debug: false,
  readmeUrl: '',
  title: '',
  name: '',
  social: {
    github: '',
    linkedin: ''
  },
  email: '',
  repo: '',
  resume_url: '',
  default: 'About',
  headers: [
    { title: 'About', type: 'article' },
    { title: 'Blog', type: 'article' },
    { title: 'Projects', type: 'article' },
    { title: 'MarkDown', type: 'article' }
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
  themeEnable: true,
  colors: THEMES.default
};

/**
 * Validates a URL string
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid URL or empty
 */
function validateUrl(url) {
  if (!url || url.trim() === '') return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email or empty
 */
function validateEmail(email) {
  if (!email || email.trim() === '') return true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates that a value is not empty
 * @param {string} value - Value to validate
 * @returns {boolean|string} - True if valid, error message if not
 */
function validateRequired(value) {
  if (!value || value.trim() === '') {
    return 'This field is required';
  }
  return true;
}

/**
 * Generates a config object from user responses
 * @param {Object} answers - User responses from prompts
 * @returns {Object} - Generated config object
 */
function generateConfig(answers) {
  const config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

  // Basic info
  config.title = answers.blogTitle;
  config.name = answers.authorName;
  config.email = answers.email || '';

  // Social links
  if (answers.githubUsername) {
    config.social.github = `https://github.com/${answers.githubUsername}`;
  }
  if (answers.linkedinUrl) {
    config.social.linkedin = answers.linkedinUrl;
  }

  // Repo URL
  if (answers.repoUrl) {
    config.repo = answers.repoUrl;
    config.readmeUrl = `${answers.repoUrl}/blob/main/README.md`;
  }

  // Theme configuration
  config.themeEnable = answers.theme === 'both';
  config.colors = answers.theme === 'dark' ? {
    light: THEMES.default.dark,
    dark: THEMES.default.dark
  } : THEMES.default;

  // Default headers
  config.headers = [
    { title: 'About', type: 'article' },
    { title: 'Blog', type: 'article' },
    { title: 'Projects', type: 'article' },
    { title: 'MarkDown', type: 'article' }
  ];

  return config;
}

/**
 * Generates header configuration based on selected features
 * @param {string[]} features - Selected features
 * @returns {Array} - Header configuration array
 */
function generateHeaders(features) {
  const headers = [];

  if (features.includes('about')) {
    headers.push({ title: 'About', type: 'article' });
  }
  if (features.includes('blog')) {
    headers.push({ title: 'Blog', type: 'article' });
  }
  if (features.includes('projects')) {
    headers.push({ title: 'Projects', type: 'article', customUrl: 'Projects/Project' });
  }
  if (features.includes('techstack')) {
    headers.push({ title: 'Tech Stack', type: 'article', customUrl: 'TechStack' });
  }
  if (features.includes('links')) {
    headers.push({ title: 'Links', type: 'article' });
  }

  // Always add Markdown editor if enabled
  headers.push({ title: 'MarkDown', type: 'article' });

  // Add Resume link if URL provided
  if (features.includes('resume')) {
    headers.push({
      title: 'Resume',
      type: 'link',
      customUrl: '' // Will be filled later
    });
  }

  return headers;
}

/**
 * Converts config object to JavaScript file content
 * @param {Object} config - Config object
 * @returns {string} - JavaScript file content
 */
function configToJsContent(config) {
  const colorsStr = JSON.stringify(config.colors, null, 2).replace(/"/g, "'");
  const headersStr = JSON.stringify(config.headers, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, "'");
  const linkStyleStr = JSON.stringify(config.markdown.linkStyle, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, "'");

  return `/**
 * @author ${config.name}
 * @email ${config.email}
 * @create date ${new Date().toISOString().split('T')[0]}
 * @modify date ${new Date().toISOString().split('T')[0]}
 * @desc Blog Configuration - Generated by CLI Setup Tool
 */
const config = {
  debug: ${config.debug},
  // github readme url
  readmeUrl: '${config.readmeUrl}',
  // blog title, on left top of the page
  title: '${config.title}',
  // author name
  name: '${config.name}',
  // social links, on bottom of the page
  social: {
    github: '${config.social.github}',
    linkedin: '${config.social.linkedin}'
  },
  email: '${config.email}',
  repo: '${config.repo}',
  resume_url: '${config.resume_url}',
  // default content shown on the main page, /src/articles/[config.default].md
  default: '${config.default}',
  headers: ${headersStr},
  // markdown settings
  markdown: {
    // set it false to disable markdown editor
    enable: ${config.markdown.enable},
    // set it true to enable loading animation in refreshing markdown preview.
    loading: ${config.markdown.loading},
    // delay time for refreshing markdown preview
    renderDelay: ${config.markdown.renderDelay},
    // tab size for markdown editor
    tabSize: ${config.markdown.tabSize},
    // the links in markdown does not have underlines, set it true to enable underline
    linkStyle: ${linkStyleStr}
  },
  themeEnable: ${config.themeEnable},
  colors: ${colorsStr}
}

export default config;
`;
}

/**
 * Creates sample articles if they don't exist
 * @param {string} articlesDir - Articles directory path
 */
function createSampleArticles(articlesDir) {
  const samples = [
    {
      filename: 'About.md',
      content: `# About Me

Welcome to my blog! This page was generated by the CLI setup tool.

## Who Am I

Write a brief introduction about yourself here.

## What I Do

Describe your work, interests, and passions.

## Get In Touch

Feel free to reach out to me!
`
    },
    {
      filename: 'Blog.md',
      content: `# Blog

Welcome to my blog section!

## Recent Posts

- [Coming Soon](/?page=Blog)

Stay tuned for more content.
`
    },
    {
      filename: 'Projects/Project.md',
      content: `# Projects

Here are some of my projects.

## Featured Project

### Project Name

Description of your project.

- **Tech Stack:** React, Node.js, etc.
- **GitHub:** [Link to repo]
- **Live Demo:** [Link to demo]
`
    }
  ];

  samples.forEach(({ filename, content }) => {
    const filePath = path.join(articlesDir, filename);
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  Created: src/articles/${filename}`);
    } else {
      console.log(`  Skipped: src/articles/${filename} (already exists)`);
    }
  });
}

/**
 * Main setup function
 * @returns {Promise<Object>} - Setup result
 */
async function runSetup() {
  console.log('\n🚀 Welcome to ConciseMarkDownBlog Setup!\n');
  console.log('This wizard will help you quickly configure your new blog.\n');
  console.log('For advanced configuration (colors, headers, markdown settings),\n');
  console.log('you can use the GUI config editor after setup.\n');

  const questions = [
    {
      type: 'text',
      name: 'blogTitle',
      message: 'What is your blog title?',
      validate: validateRequired
    },
    {
      type: 'text',
      name: 'authorName',
      message: 'What is your name (author)?',
      validate: validateRequired
    },
    {
      type: 'text',
      name: 'email',
      message: 'What is your email address? (optional)',
      validate: (value) => validateEmail(value) || 'Please enter a valid email address'
    },
    {
      type: 'text',
      name: 'githubUsername',
      message: 'What is your GitHub username? (optional)'
    },
    {
      type: 'text',
      name: 'linkedinUrl',
      message: 'What is your LinkedIn URL? (optional)',
      validate: (value) => validateUrl(value) || 'Please enter a valid URL'
    },
    {
      type: 'text',
      name: 'repoUrl',
      message: 'What is your GitHub repository URL? (optional)',
      validate: (value) => validateUrl(value) || 'Please enter a valid URL',
      hint: 'e.g., https://github.com/username/repo'
    },
    {
      type: 'select',
      name: 'theme',
      message: 'Choose a theme preference:',
      choices: [
        { title: 'Light', value: 'light' },
        { title: 'Dark', value: 'dark' },
        { title: 'Both (with toggle)', value: 'both' }
      ],
      initial: 2
    }
  ];

  const answers = await prompts(questions, {
    onCancel: () => {
      console.log('\n\n❌ Setup cancelled. No changes were made.\n');
      process.exit(0);
    }
  });

  // Generate config
  const config = generateConfig(answers);
  const configContent = configToJsContent(config);

  // Write config file
  const configPath = path.join(process.cwd(), 'src', 'config.js');

  console.log('\n📁 Writing configuration...');
  fs.writeFileSync(configPath, configContent, 'utf8');
  console.log('  ✓ Created: src/config.js');

  // Create sample articles
  console.log('\n📝 Creating sample articles...');
  const articlesDir = path.join(process.cwd(), 'src', 'articles');
  createSampleArticles(articlesDir);

  console.log('\n✅ Setup complete!\n');
  console.log('Next steps:');
  console.log('  1. Run "npm start" to preview your blog locally');
  console.log('  2. Open http://localhost:3000/?page=config for GUI config editor');
  console.log('     (You can customize colors, headers, markdown settings there)');
  console.log('  3. Edit files in src/articles/ to add your content');
  console.log('  4. Deploy using GitHub Pages or Vercel\n');
  console.log('💡 Tip: Use the GUI config editor to:');
  console.log('     - Customize theme colors');
  console.log('     - Add/remove navigation headers');
  console.log('     - Configure markdown editor settings');
  console.log('     - Add social links and resume URL\n');

  return {
    success: true,
    config,
    answers
  };
}

// Run setup if this file is executed directly
if (require.main === module) {
  runSetup().catch((error) => {
    console.error('\n❌ Error during setup:', error.message);
    process.exit(1);
  });
}

module.exports = {
  runSetup,
  generateConfig,
  configToJsContent,
  validateUrl,
  validateEmail,
  validateRequired,
  generateHeaders,
  createSampleArticles,
  THEMES,
  DEFAULT_CONFIG
};

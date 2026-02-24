/**
 * Blog Configuration
 *
 * Customize this file to make the blog your own.
 * You can also use the interactive setup: npm run setup
 * Or the GUI editor: http://localhost:3000/?page=config
 */
const config = {
  debug: false,
  // github readme url
  readmeUrl: '',
  // blog title, on left top of the page
  title: 'My Blog',
  // author name
  name: 'Your Name',
  // social links, on bottom of the page
  social: {
    github: '',
    linkedin: ''
  },
  email: '',
  repo: '',
  resume_url: '',
  // default content shown on the main page, /src/articles/[config.default].md
  default: 'About',
  headers: [
    {
      title: 'About',
      type: 'article'
    },
    {
      title: 'Blog',
      type: 'article'
    },
    {
      title: 'Projects',
      type: 'article',
      customUrl: 'Projects/Project'
    },
    {
      title: 'MarkDown',
      type: 'article'
    }
  ],
  // markdown settings
  markdown: {
    // set it false to disable markdown editor
    enable: true,
    // set it true to enable loading animation in refreshing markdown preview.
    loading: false,
    // delay time for refreshing markdown preview
    renderDelay: 0,
    // tab size for markdown editor
    tabSize: 4,
    // the links in markdown does not have underlines, set it true to enable underline
    linkStyle: {
      textDecoration: 'none',
      color: '#0077ff'
    }
  },
  // show theme switch button in the header, default to true
  themeEnable: true,
  // show footer with social links and copyright, default to true
  footer: true,
  colors: {
    light: {
      background: '#ffffff',
      foreground: '#0077ff',
      gray: '#6c757d',
      text: '#212529',
      border: '#dee2e6',
      cardBg: '#f8f9fa'
    },
    dark: {
      background: '#212529',
      foreground: '#0d6efd',
      gray: '#adb5bd',
      text: '#f8f9fa',
      border: '#495057',
      cardBg: '#343a40'
    }
  }
}

export default config;

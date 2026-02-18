# Technical Framework

Understanding the technologies powering ConciseMarkDownBlog.

## Architecture Overview

```
┌─────────────────┐
│   React App     │
│  (Single Page)  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐  ┌──▼────┐
│Config │  │Markdown│
│  JS   │  │ Files  │
└───────┘  └────────┘
```

## Core Technologies

### React

- **Version**: 18.x
- **Purpose**: UI component library
- **Features Used**:
  - Functional components with hooks
  - Context API for theme management
  - Redux Toolkit for state management

### Create React App

Build tooling and development environment:

- Webpack for bundling
- Babel for transpilation
- Development server with hot reload
- Production build optimization

### Markdown Processing

**react-markdown**
- Renders markdown as React components
- Supports GitHub Flavored Markdown
- Extensible with plugins

**remark-gfm**
- Adds GitHub Flavored Markdown support
- Tables, task lists, strikethrough

**react-mathjax**
- Renders LaTeX math formulas

### State Management

**Redux Toolkit**
- Centralized state management
- Navigation history tracking
- Page state management

### Styling

**CSS Modules**
- Component-scoped styles
- Prevents class name collisions

**Bootstrap 5**
- Responsive grid system
- UI components
- Utility classes

**Bootstrap Icons**
- Icon font library

### Build & Deploy

**GitHub Actions**
- Automated CI/CD pipeline
- Builds on every push to main
- Deploys to GitHub Pages

## File Structure

```
src/
├── components/          # React components
│   ├── Article.jsx     # Article page renderer
│   ├── Header.jsx      # Navigation header
│   ├── Footer.jsx      # Social links footer
│   ├── ThemeProvider.jsx # Theme context
│   ├── editor/         # Markdown editor
│   │   ├── Editor.jsx
│   │   ├── MarkDownTextarea.jsx
│   │   └── MarkDownPreview.jsx
│   └── config/         # Config editor
│       └── ConfigEditor.jsx
├── articles/           # Markdown content
├── styles/             # CSS modules
├── util/               # Utility functions
├── config.js           # Blog configuration
└── App.js             # Main application
```

## Dynamic Loading

### Markdown Context

Uses webpack's `require.context` to load all markdown files:

```javascript
const articlesContext = require.context(
  './articles',
  true,
  /\.md$/
);
```

This creates a mapping of all `.md` files that can be dynamically imported.

### Route Handling

URL parameters determine which markdown file to load:

```
/?page=About        → loads /src/articles/About.md
/?page=Blog/Post    → loads /src/articles/Blog/Post.md
```

## Configuration System

The blog is driven by `/src/config.js`:

```javascript
const config = {
  title: 'Blog Title',
  headers: [...],      // Navigation
  colors: {...},       // Theme colors
  markdown: {...},     // Editor settings
  social: {...}        // Social links
};
```

Changes to config are hot-reloaded in development.

## Performance Optimizations

1. **Code Splitting**
   - Markdown loaded on demand
   - Components lazy-loaded where possible

2. **Static Generation**
   - Build-time markdown processing
   - No server runtime required

3. **Asset Optimization**
   - Images served from CDN
   - CSS/JS minified in production

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Development Tools

### ESLint

Code linting with React and JSX rules:

```bash
npm run lint
npm run lint:fix
```

### Testing

**Jest** - Unit testing framework
**Playwright** - E2E testing

```bash
npm test          # Unit tests
npm run test:e2e  # E2E tests
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Development server |
| `npm run build` | Production build |
| `npm test` | Run tests |
| `npm run setup` | CLI setup wizard |

---

For setup instructions, see [Deployment Guide](deployment.md).

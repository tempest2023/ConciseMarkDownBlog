# Configuration Guide

Configure your blog by editing `/src/config.js` or using the GUI Config Editor.

## Table of Contents

- [Quick Setup](#quick-setup)
- [Configuration Options](#configuration-options)
- [Navigation (Header) Config](#navigation-header-config)
- [Page Configuration](#page-configuration)
- [Markdown Editor Settings](#markdown-editor-settings)
- [Theme Configuration](#theme-configuration)
- [Reserved Names](#reserved-names)
- [Internal Navigation](#internal-navigation)
- [Images and Media](#images-and-media)

## Quick Setup

### Option 1: TUI Setup (Recommended for New Users)

Run the interactive CLI setup wizard:

```bash
npm run setup
```

This will guide you through basic configuration and create sample articles.

### Option 2: GUI Config Editor

Start the development server and open the config editor:

```bash
npm start
# Open http://localhost:3000/?page=config
```

The GUI editor provides:
- Visual theme customization with color pickers
- Easy header/navigation management
- Live preview of changes
- Export configuration as `config.js`

### Option 3: Manual Edit

Edit `/src/config.js` directly:

```javascript
const config = {
  title: 'My Blog',
  name: 'Your Name',
  email: 'your@email.com',
  // ... more options
};
```

## Configuration Options

### Basic Info

| Option | Type | Description |
|--------|------|-------------|
| `title` | string | Blog title shown in navbar and browser tab |
| `name` | string | Author name shown in footer |
| `email` | string | Contact email (optional) |
| `default` | string | Default page to show (e.g., 'About') |

### Social Links

| Option | Type | Description |
|--------|------|-------------|
| `social.github` | string | GitHub profile URL |
| `social.linkedin` | string | LinkedIn profile URL |
| `resume_url` | string | Resume/CV URL (optional) |
| `repo` | string | Repository URL for "View Source" link |

### Features

| Option | Type | Description |
|--------|------|-------------|
| `themeEnable` | boolean | Enable/disable theme toggle button |
| `footer` | boolean | Show/hide footer with social links |
| `markdown.enable` | boolean | Enable/disable built-in markdown editor |
| `markdown.tabSize` | number | Tab size for editor (2 or 4) |
| `markdown.renderDelay` | number | Delay before preview updates (ms) |

## Navigation (Header) Config

Define navigation items in the `headers` array:

```javascript
headers: [
  { title: 'About', type: 'article' },
  { title: 'Blog', type: 'article' },
  { title: 'Projects', type: 'article', customUrl: 'Projects/Project' },
  { title: 'Resume', type: 'link', customUrl: 'https://your-resume.com' }
]
```

### Header Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `title` | string | Yes | Display text and default path |
| `type` | string | Yes | `'article'` or `'link'` |
| `customUrl` | string | No | Custom path for articles, URL for links |

### Path Resolution

For `type: 'article'`:
- Without `customUrl`: loads `/src/articles/{title}.md`
- With `customUrl`: loads `/src/articles/{customUrl}.md`

Examples:

```javascript
// Loads: /src/articles/About.md
{ title: 'About', type: 'article' }

// Loads: /src/articles/Projects/Project.md
{ title: 'Projects', type: 'article', customUrl: 'Projects/Project' }

// External link
{ title: 'GitHub', type: 'link', customUrl: 'https://github.com/username' }

// Internal link with parameters
{ title: 'Demo', type: 'link', customUrl: '/?page=Demo.md' }
```

## Page Configuration

### Creating New Pages

1. Create a Markdown file in `/src/articles/`:
   ```bash
   touch src/articles/MyPage.md
   ```

2. Add to `headers` in config:
   ```javascript
   { title: 'MyPage', type: 'article' }
   ```

### Using Folders

Organize content with folders:

```
src/articles/
├── About.md
├── Blog.md
└── Projects/
    ├── Project1.md
    └── Project2.md
```

Config:
```javascript
{ title: 'Projects', type: 'article', customUrl: 'Projects/Project1' }
```

## Markdown Editor Settings

The built-in markdown editor (`/?page=markdown`) supports:

| Setting | Default | Description |
|---------|---------|-------------|
| `enable` | `true` | Show/hide markdown editor page |
| `loading` | `false` | Show loading animation on preview |
| `renderDelay` | `0` | Debounce delay for preview (ms) |
| `tabSize` | `2` | Number of spaces for tab |

Example:
```javascript
markdown: {
  enable: true,
  loading: false,
  renderDelay: 300,  // Wait 300ms after typing before updating preview
  tabSize: 2,
  linkStyle: {
    textDecoration: 'none',
    color: '#0077ff'
  }
}
```

## Theme Configuration

### Built-in Themes

Choose from 4 preset themes:

- `default` - Warm orange
- `ocean` - Blue tones
- `forest` - Green tones
- `berry` - Pink tones

### Custom Colors

Define custom colors for light and dark modes:

```javascript
colors: {
  light: {
    background: '#ffffff',
    foreground: '#feb272',
    gray: '#212529'
  },
  dark: {
    background: '#212529',
    foreground: '#feb272',
    gray: '#a9a9b3'
  }
}
```

### Theme Toggle

Enable the theme switcher button:

```javascript
themeEnable: true  // Shows sun/moon toggle in header
```

## Reserved Names

Cannot use as page titles or in URLs:

- `Markdown` (case-insensitive) - Reserved for markdown editor
- `Config` - Reserved for config editor

## Internal Navigation

### Linking to Other Pages

Use URL parameters with `page` key:

```markdown
[My Project](/?page=Projects/project1.md)
```

This loads `/src/articles/Projects/project1.md`.

Extra parameters are preserved:

```markdown
[My Project](/?page=Projects/demo.md&highlight=section)
```

### External Links

External URLs work directly:

```markdown
https://github.com/username
```

## Images and Media

### External Hosting (Recommended)

Upload images to cloud storage and use direct links:

```markdown
![Alt text](https://your-image-url.com/image.png)
```

Recommended services:
- [Google Drive](https://www.google.com/drive/)
- [OneDrive](https://www.microsoft.com/en-us/microsoft-365/onedrive)
- [SM.MS](https://sm.ms/)

### Local Images

Place images in `/src/articles/` and reference with absolute paths:

```markdown
![Local Image](/src/articles/images/photo.png)
```

Supported formats: SVG, PNG, JPG, GIF, JPEG, MP4, MP3, AVI, OGG

### Base64 Images

For small images, you can use base64 encoding:

```markdown
![Base64 Image](data:image/png;base64,iVBORw0KGgo...)
```

---

For more help, see:
- [Updating Content](updating-content.md) - How to add and update blog posts
- [Editor Guide](editor.md) - Using the built-in markdown editor

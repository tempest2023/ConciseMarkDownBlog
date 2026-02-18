# Markdown Editor Guide

The built-in markdown editor provides a live preview environment for writing and testing your blog posts.

## Accessing the Editor

Navigate to `/?page=markdown` or click **MarkDown** in the navigation.

Example: `http://localhost:3000/?page=markdown`

## Features

### Live Preview

- **Split-screen layout** - Editor on left, preview on right
- **Real-time updates** - See changes as you type
- **Exact rendering** - Preview matches your blog's styling

### Supported Markdown

- [x] GitHub Flavored Markdown
  - Headers (H1-H6)
  - **Bold**, _italic_, ~~strikethrough~~
  - [Links](https://example.com)
  - Lists (ordered/unordered) and task lists
  - Images
  - Footnotes
  - Code blocks with syntax highlighting
  - LaTeX math formulas
  - Tables
- [x] Typora-style block quotes
- [x] Horizontal dividers for H1/H2

### Editor Settings

Configure in `/src/config.js`:

```javascript
markdown: {
  enable: true,        // Enable/disable editor
  loading: false,      // Show loading animation
  renderDelay: 0,      // Debounce delay (milliseconds)
  tabSize: 2,          // Tab indentation (2 or 4 spaces)
  linkStyle: {
    textDecoration: 'none',
    color: '#0077ff'
  }
}
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Indent line |
| `Shift+Tab` | Unindent line |
| `Ctrl/Cmd + A` | Select all |
| `Ctrl/Cmd + C` | Copy |
| `Ctrl/Cmd + V` | Paste |

## Use Cases

### Drafting Blog Posts

1. Open the editor
2. Write your content with live preview
3. Copy the markdown when satisfied
4. Save to `/src/articles/YourPost.md`
5. Add to navigation in config

### Testing Formatting

- Verify complex markdown renders correctly
- Test table formatting
- Preview math formulas
- Check image alignment

### Content Migration

- Paste content from other editors
- Convert formatting to markdown
- Preview before publishing

## Editor Modes

### Article Flip Button

Each article page has a flip button (top-right corner) that toggles between:

- **Preview Mode** - Rendered markdown view
- **Edit Mode** - Raw markdown with live preview

This allows quick edits to existing articles without opening the full editor.

## Future Features

Planned enhancements:

- [ ] Auto-save & recover
- [ ] Export to markdown file
- [ ] Export to PDF
- [ ] Notion-style block editor
- [ ] Video embed support (YouTube, Bilibili)
- [ ] Data tables with sorting

## Tips

### Performance

- Set `renderDelay: 300` for large documents
- Reduces CPU usage while typing
- Still shows preview after you pause

### Images

Use external image URLs for best performance:

```markdown
![Alt text](https://your-cdn.com/image.png)
```

### Code Blocks

Specify language for syntax highlighting:

```javascript
const greeting = "Hello World";
console.log(greeting);
```

---

For configuration options, see [Configuration Guide](configuration.md).

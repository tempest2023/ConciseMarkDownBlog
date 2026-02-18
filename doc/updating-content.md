# Updating Blog Content

Add, edit, and manage your blog posts and pages.

## Table of Contents

- [Adding New Articles](#adding-new-articles)
- [Updating Existing Content](#updating-existing-content)
- [Organizing with Folders](#organizing-with-folders)
- [Publishing Changes](#publishing-changes)
- [Best Practices](#best-practices)

## Adding New Articles

### Step 1: Create Markdown File

Create a new `.md` file in `/src/articles/`:

```bash
touch src/articles/My-New-Post.md
```

### Step 2: Write Content

Add markdown content:

```markdown
# My New Post

Published: 2024-01-15

## Introduction

Your content here...

## Main Content

- Point 1
- Point 2
- Point 3

## Conclusion

Thanks for reading!
```

### Step 3: Add to Navigation

Edit `/src/config.js` to add to headers:

```javascript
headers: [
  { title: 'About', type: 'article' },
  { title: 'Blog', type: 'article' },
  { title: 'My New Post', type: 'article' }  // Add this
]
```

### Step 4: Test Locally

```bash
npm start
```

Navigate to your new page to verify it works.

### Step 5: Deploy

```bash
git add .
git commit -m "Add new post: My New Post"
git push
```

## Updating Existing Content

### Quick Edit

1. Edit the markdown file
2. Test locally with `npm start`
3. Commit and push

### Using the Editor

1. Navigate to the article on your local site
2. Click the flip button (top-right) to enter edit mode
3. Make changes with live preview
4. Copy updated content back to the file
5. Commit and push

## Organizing with Folders

Create a folder structure for better organization:

```
src/articles/
├── About.md
├── Blog.md
├── blog/
│   ├── 2024-01-post-1.md
│   ├── 2024-02-post-2.md
│   └── 2024-03-post-3.md
└── projects/
    ├── project-1.md
    └── project-2.md
```

Update config with custom URLs:

```javascript
headers: [
  { title: 'About', type: 'article' },
  { title: 'Blog', type: 'article', customUrl: 'blog/2024-03-post-3' },
  { title: 'Projects', type: 'article', customUrl: 'projects/project-1' }
]
```

## Publishing Changes

### Automatic Deployment (GitHub Pages)

Every push to `main` automatically deploys:

```bash
git add .
git commit -m "Update blog content"
git push origin main
```

Wait 3-5 minutes for the build and deployment.

### Manual Deployment (Vercel)

Vercel deploys automatically on every push:

```bash
git push
```

Or deploy manually:

```bash
vercel --prod
```

## Best Practices

### File Naming

- Use descriptive names: `react-hooks-guide.md` not `post1.md`
- Use kebab-case for multi-word names
- Include dates for time-sensitive content: `2024-01-tutorial.md`

### Content Structure

- Start with H1 (`# Title`)
- Use H2 (`## Section`) for main sections
- Include a date or version info
- Add links to related content

### Images

- Host images externally (GitHub, Cloudinary, etc.)
- Use descriptive alt text
- Optimize images before uploading

```markdown
![Diagram showing React component lifecycle](https://example.com/react-lifecycle.png)
```

### Internal Links

Link to other pages using the `page` parameter:

```markdown
[Read my previous post](/?page=blog/previous-post.md)
```

### Version Control

- Commit related changes together
- Write clear commit messages
- Use branches for major changes

```bash
git checkout -b new-feature-post
# make changes
git add .
git commit -m "Add comprehensive guide on feature X"
git push -u origin new-feature-post
# Create pull request
```

## Notion Integration

Export Notion documents as Markdown:

1. In Notion, click **...** → **Export**
2. Choose **Markdown & CSV**
3. Extract the downloaded zip
4. Move `.md` files to `/src/articles/`
5. Clean up any Notion-specific formatting
6. Update config.js with new pages

---

For more information, see:
- [Configuration Guide](configuration.md) - Configuring navigation
- [Editor Guide](editor.md) - Using the markdown editor

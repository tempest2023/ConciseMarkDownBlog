# Concise MarkDown Blog

![demo](./demo.png)

Build your own blog in 5 minutes with Markdown. No server needed. Free hosting.

## Features

- Write in Markdown — focus on content, not code
- Customizable themes — light/dark mode with color presets
- TUI Setup Wizard — interactive CLI for quick configuration
- GUI Config Editor — visual editor for settings (local only)
- One-click deploy — GitHub Pages or Vercel
- Mobile responsive
- Completely free

## Quick Start

### 1. Create Your Blog

Click **"Use this template"** on GitHub to create your own repository, or clone directly:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git my-blog
cd my-blog
```

### 2. Configure

**Interactive Setup (Recommended):**

```bash
npm install
npm run setup
```

**Or use GUI Editor:**

```bash
npm start
# Open http://localhost:3000/?page=config
```

**Or edit manually:** [`src/config.js`](./src/config.js)

### 3. Replace Tutorial Content

This template comes with tutorial pages that teach you how to use the blog. Replace them with your own content:

| File | Purpose |
|------|---------|
| `src/articles/About.md` | Your about page |
| `src/articles/Blog.md` | Blog post index with links to posts |
| `src/articles/Projects/Project.md` | Your project showcase |
| `src/articles/Blogs/` | Your blog posts, organized in folders |
| `src/config.js` | Blog title, name, social links, navigation |

Check out `src/articles/Blogs/GettingStarted/MyFirstPost.md` for a sample blog post demonstrating all supported Markdown features.

### 4. Deploy

**GitHub Pages (Free):**

```bash
git add .
git commit -m "Initial blog setup"
git push
```

Then enable Pages in repository Settings > Pages > Deploy from branch `gh-pages`.

**Vercel (Easier):**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F623059008%2FConciseMarkDownBlog)

See [Deployment Guide](doc/deployment.md) for detailed instructions.

## Documentation

| Topic | Description |
|-------|-------------|
| [Configuration](doc/configuration.md) | Complete config reference, navigation setup, themes |
| [Deployment](doc/deployment.md) | GitHub Pages and Vercel deployment guides |
| [Updating Content](doc/updating-content.md) | Add and edit blog posts |
| [Editor Guide](doc/editor.md) | Built-in markdown editor features |
| [Tech Stack](doc/tech-stack.md) | Architecture and technologies used |

## Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Why This Blog?

- **No Server Required** — Static site, host anywhere for free
- **Easy Updates** — Write Markdown, git push, done
- **Full Control** — Own your content, custom domain support
- **Developer Friendly** — React-based, easily extensible

## Support

- [Report issues](https://github.com/623059008/ConciseMarkDownBlog/issues)
- [Request features](https://github.com/623059008/ConciseMarkDownBlog/issues)

## License

[MIT](LICENSE)

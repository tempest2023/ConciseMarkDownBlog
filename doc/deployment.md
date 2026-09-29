# Deployment Guide

Deploy the static blog and AI API together on Vercel. See [production setup](vercel-production.md) for this site's project settings, limits, and domain.

## Table of Contents

- [Vercel](#vercel)
- [Troubleshooting](#troubleshooting)

## Vercel

Vercel publishes the static pages and runs `/api/chat` from the same origin. Configure the server-side environment variables in [production setup](vercel-production.md) before enabling the AI agent.

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftempest2023%2FConciseMarkDownBlog)

1. Click the button above
2. Sign in with GitHub (create account if needed)
3. Vercel will:
   - Fork the repository to your account
   - Create a new project
   - Deploy automatically
4. Your blog will be live at `your-project.vercel.app`

### Manual Deploy

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login and deploy:
   ```bash
   vercel login
   vercel
   ```

3. For production deployment:
   ```bash
   vercel --prod
   ```

### Features

- **Preview Deployments** - Every pull request gets its own preview URL
- **Analytics** - Built-in traffic analytics
- **Edge Network** - Global CDN for fast loading
- **Custom Domains** - Easy DNS configuration

## Troubleshooting

### Vercel

**Build fails:**
- Check Vercel dashboard for build logs
- Verify Node.js version compatibility

**Custom domain issues:**
- DNS propagation can take 24-48 hours
- Verify CNAME/A records are correct

---

For help with configuration, see [Configuration Guide](configuration.md).

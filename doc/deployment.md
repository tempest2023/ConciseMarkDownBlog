# Deployment Guide

Deploy your blog for free using GitHub Pages or Vercel.

## Table of Contents

- [GitHub Pages](#github-pages)
- [Vercel](#vercel)
- [Comparison](#comparison)

## GitHub Pages

Free hosting directly from your GitHub repository with automatic deployments.

### Setup Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial blog setup"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages** (in left sidebar)
   - Under "Build and deployment":
     - Source: **Deploy from a branch**
     - Branch: **gh-pages** /root
   - Click **Save**

3. **Wait for deployment**
   - GitHub Actions will automatically build and deploy
   - This takes 3-5 minutes
   - Your blog will be available at `https://username.github.io/repo-name`

### Custom Domain (Optional)

1. Add a `CNAME` file to your repository root:
   ```
   www.yourdomain.com
   ```

2. Configure DNS with your domain provider:
   - CNAME record: `www` → `username.github.io`
   - A records for apex domain pointing to GitHub Pages IPs

3. Enable HTTPS in repository Settings → Pages

### Automatic Deployments

Every push to `main` branch triggers automatic deployment:

1. GitHub Actions workflow runs
2. Builds the React app
3. Deploys to `gh-pages` branch
4. Updates live site

## Vercel

One-click deployment with zero configuration.

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F623059008%2FConciseMarkDownBlog)

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

## Comparison

| Feature | GitHub Pages | Vercel |
|---------|--------------|--------|
| Price | Free | Free |
| HTTPS | ✓ | ✓ |
| Custom Domain | ✓ | ✓ |
| CDN | Basic | Global Edge Network |
| Preview Deployments | ✗ | ✓ |
| Analytics | ✗ | ✓ |
| Setup Complexity | Medium | One Click |
| Git Integration | Automatic | Automatic |

## Troubleshooting

### GitHub Pages

**Build fails:**
- Check Actions tab for error logs
- Ensure `homepage` in package.json matches your repo

**404 errors:**
- Verify `gh-pages` branch exists
- Check repository is public (required for free GitHub Pages)

**Changes not appearing:**
- Clear browser cache
- Wait 5-10 minutes for CDN refresh

### Vercel

**Build fails:**
- Check Vercel dashboard for build logs
- Verify Node.js version compatibility

**Custom domain issues:**
- DNS propagation can take 24-48 hours
- Verify CNAME/A records are correct

---

For help with configuration, see [Configuration Guide](configuration.md).

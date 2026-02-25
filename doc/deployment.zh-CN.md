# 部署指南

使用 GitHub Pages 或 Vercel 免费部署你的博客。

## 目录

- [GitHub Pages](#github-pages)
- [Vercel](#vercel)
- [对比](#对比)

## GitHub Pages

直接从你的 GitHub 仓库免费托管，支持自动部署。

### 设置步骤

1. **将代码推送到 GitHub**

   ```bash
   git add .
   git commit -m "初始博客设置"
   git push origin main
   ```

2. **启用 GitHub Pages**

   - 在 GitHub 上打开你的仓库
   - 点击 **设置** → **Pages**（在左侧边栏）
   - 在 "构建和部署" 下：
     - 源：**从分支部署**
     - 分支：**gh-pages** /root
   - 点击 **保存**

3. **等待部署**
   - GitHub Actions 将自动构建和部署
   - 这需要 3-5 分钟
   - 你的博客将在 `https://username.github.io/repo-name` 可用

### 自定义域名（可选）

1. 在仓库根目录添加 `CNAME` 文件：

   ```
   www.yourdomain.com
   ```

2. 使用你的域名提供商配置 DNS：

   - CNAME 记录：`www` → `username.github.io`
   - A 记录指向 GitHub Pages IP

3. 在仓库设置 → Pages 中启用 HTTPS

### 自动部署

每次推送到 `main` 分支都会触发自动部署：

1. GitHub Actions 工作流运行
2. 构建 React 应用
3. 部署到 `gh-pages` 分支
4. 更新实时站点

## Vercel

一键部署，零配置。

### 一键部署

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F623059008%2FConciseMarkDownBlog)

1. 点击上面的按钮
2. 使用 GitHub 登录（如需要则创建账户）
3. Vercel 将：
   - 将仓库 fork 到你的账户
   - 创建新项目
   - 自动部署
4. 你的博客将在 `your-project.vercel.app` 上线

### 手动部署

1. 安装 Vercel CLI：

   ```bash
   npm i -g vercel
   ```

2. 登录并部署：

   ```bash
   vercel login
   vercel
   ```

3. 用于生产部署：
   ```bash
   vercel --prod
   ```

### 功能特性

- **预览部署** - 每个拉取请求都有自己的预览 URL
- **分析** - 内置流量分析
- **边缘网络** - 全球 CDN 快速加载
- **自定义域名** - 简单的 DNS 配置

## 对比

| 功能       | GitHub Pages | Vercel       |
| ---------- | ------------ | ------------ |
| 价格       | 免费         | 免费         |
| HTTPS      | ✓            | ✓            |
| 自定义域名 | ✓            | ✓            |
| CDN        | 基础         | 全球边缘网络 |
| 预览部署   | ✗            | ✓            |
| 分析       | ✗            | ✓            |
| 设置复杂度 | 中等         | 一键         |
| Git 集成   | 自动         | 自动         |

## 故障排除

### GitHub Pages

**构建失败：**

- 检查 Actions 标签页中的错误日志
- 确保 package.json 中的 `homepage` 与你的仓库匹配

**404 错误：**

- 验证 `gh-pages` 分支是否存在
- 检查仓库是否为公开（免费 GitHub Pages 必需）

**更改未显示：**

- 清除浏览器缓存
- 等待 5-10 分钟让 CDN 刷新

### Vercel

**构建失败：**

- 检查 Vercel 仪表板中的构建日志
- 验证 Node.js 版本兼容性

**自定义域名问题：**

- DNS 传播可能需要 24-48 小时
- 验证 CNAME/A 记录是否正确

---

配置帮助请参阅[配置指南](configuration.zh-CN.md)。

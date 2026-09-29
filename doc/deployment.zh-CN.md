# 部署指南

在 Vercel 同时部署静态博客和 AI 接口。本网站的项目设置、限流和域名见[生产部署说明](vercel-production.md)。

## 目录

- [Vercel](#vercel)
- [故障排除](#故障排除)

## Vercel

Vercel 发布静态页面，并在同一域名下运行 `/api/chat`。启用 AI Agent 前，需按[生产部署说明](vercel-production.md)设置服务端环境变量。

### 一键部署

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftempest2023%2FConciseMarkDownBlog)

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

## 故障排除

### Vercel

**构建失败：**

- 检查 Vercel 仪表板中的构建日志
- 验证 Node.js 版本兼容性

**自定义域名问题：**

- DNS 传播可能需要 24-48 小时
- 验证 CNAME/A 记录是否正确

---

配置帮助请参阅[配置指南](configuration.zh-CN.md)。

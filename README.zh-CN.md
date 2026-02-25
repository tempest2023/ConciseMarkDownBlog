# 简洁 Markdown 博客

[![PayPal][badge_paypal_donate]][paypal-donations]

<a href="https://www.buymeacoffee.com/tempes666" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png" alt="Buy Me A Coffee"></a>

![演示](./demo.png)

使用 Markdown 在 5 分钟内搭建你的个人博客。无需服务器，免费托管。

## ✨ 功能特性

- 📝 **Markdown 写作** - 专注于内容，而非代码
- 🎨 **可定制主题** - 支持亮色/暗色模式和配色预设
- ⚙️ **TUI 设置向导** - 交互式 CLI 快速配置
- 🖥️ **GUI 配置编辑器** - 可视化设置编辑器（仅本地）
- 🚀 **一键部署** - 即时部署到 GitHub Pages 或 Vercel
- 📱 **移动响应式** - 适配所有设备
- 🆓 **完全免费** - 无托管费用

## 🚀 快速开始

### 1. 创建你的博客

**选项 A：使用模板分支（推荐）**

克隆带有干净教程内容的 `template` 分支：

```bash
git clone -b template https://github.com/623059008/ConciseMarkDownBlog.git my-blog
cd my-blog
git checkout -b main
git push -u origin main
```

**选项 B：克隆主分支**

```bash
git clone https://github.com/623059008/ConciseMarkDownBlog.git my-blog
cd my-blog
```

### 2. 配置

**交互式设置（推荐）：**

```bash
npm install
npm run setup
```

**或使用 GUI 编辑器：**

```bash
npm start
# 打开 http://localhost:3000/?page=config
```

**或手动编辑：** [`src/config.js`](./src/config.js)

### 3. 添加内容

在 [`src/articles/`](./src/articles/) 中创建 Markdown 文件：

```bash
echo "# 你好世界\n\n我的第一篇文章！" > src/articles/Hello.md
```

更新配置中的 `headers` 以添加导航。

### 4. 部署

**GitHub Pages（免费）：**

```bash
git add .
git commit -m "初始博客设置"
git push
```

然后在仓库设置 → Pages → 从分支 `gh-pages` 部署。

**Vercel（更简单）：**

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F623059008%2FConciseMarkDownBlog)

详细说明请参阅[部署指南](doc/deployment.zh-CN.md)。

## 📚 文档

| 主题                                      | 说明                            |
| ----------------------------------------- | ------------------------------- |
| [配置](doc/configuration.zh-CN.md)        | 完整配置参考、导航设置、主题    |
| [部署](doc/deployment.zh-CN.md)           | GitHub Pages 和 Vercel 部署指南 |
| [更新内容](doc/updating-content.zh-CN.md) | 添加和编辑博客文章              |
| [编辑器指南](doc/editor.zh-CN.md)         | 内置 Markdown 编辑器功能        |
| [技术栈](doc/tech-stack.zh-CN.md)         | 架构和使用的技术                |

## 🛠️ 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 生产构建
npm run build

# 运行测试
npm test
npm run test:e2e
```

## 🎯 为什么选择这个博客？

- **无需服务器** - 静态网站，随处免费托管
- **轻松更新** - 编写 Markdown，git push，完成
- **完全掌控** - 拥有自己的内容，支持自定义域名
- **开发者友好** - 基于 React，易于扩展
- **兼容 Notion** - 将 Notion 文档导出为 Markdown

## 🙋 支持

- ⭐ 给这个仓库点赞
- 🐛 [报告问题](https://github.com/tempest2023/ConciseMarkDownBlog/issues)
- 💡 [请求功能](https://github.com/tempest2023/ConciseMarkDownBlog/issues)
- ☕ [请我喝咖啡](https://www.buymeacoffee.com/tempes666)

## 📜 许可

[MIT](LICENSE) © [Tempest](https://tempest.fun/)

[badge_paypal_donate]: https://ionicabizau.github.io/badges/paypal_donate.svg
[paypal-donations]: https://www.paypal.com/paypalme/TaoTempest

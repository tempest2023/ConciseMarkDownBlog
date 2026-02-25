# 技术框架

了解 ConciseMarkDownBlog 背后的技术。

## 架构概览

```
┌─────────────────┐
│   React 应用    │
│  （单页应用）    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐  ┌──▼────┐
│ 配置  │  │Markdown│
│  JS   │  │ 文件   │
└───────┘  └────────┘
```

## 核心技术

### React

- **版本**：18.x
- **用途**：UI 组件库
- **使用的功能**：
  - 带 hooks 的函数组件
  - 用于主题管理的 Context API
  - 用于状态管理的 Redux Toolkit

### Create React App

构建工具和开发环境：

- 用于打包的 Webpack
- 用于转译的 Babel
- 带热重载的开发服务器
- 生产构建优化

### Markdown 处理

**react-markdown**

- 将 Markdown 渲染为 React 组件
- 支持 GitHub 风格 Markdown
- 可扩展插件

**remark-gfm**

- 添加 GitHub 风格 Markdown 支持
- 表格、任务列表、删除线

**react-mathjax**

- 渲染 LaTeX 数学公式

### 状态管理

**Redux Toolkit**

- 集中式状态管理
- 导航历史跟踪
- 页面状态管理

### 样式

**CSS Modules**

- 组件作用域样式
- 防止类名冲突

**Bootstrap 5**

- 响应式网格系统
- UI 组件
- 工具类

**Bootstrap Icons**

- 图标字体库

### 构建和部署

**GitHub Actions**

- 自动化 CI/CD 流水线
- 每次推送到 main 时构建
- 部署到 GitHub Pages

## 文件结构

```
src/
├── components/          # React 组件
│   ├── Article.jsx     # 文章页面渲染器
│   ├── Header.jsx      # 导航头部
│   ├── Footer.jsx      # 社交链接页脚
│   ├── ThemeProvider.jsx # 主题上下文
│   ├── editor/         # Markdown 编辑器
│   │   ├── Editor.jsx
│   │   ├── MarkDownTextarea.jsx
│   │   └── MarkDownPreview.jsx
│   └── config/         # 配置编辑器
│       └── ConfigEditor.jsx
├── articles/           # Markdown 内容
├── styles/             # CSS 模块
├── util/               # 工具函数
├── config.js           # 博客配置
└── App.js             # 主应用程序
```

## 动态加载

### Markdown 上下文

使用 webpack 的 `require.context` 加载所有 Markdown 文件：

```javascript
const articlesContext = require.context('./articles', true, /\.md$/);
```

这创建了可动态导入的所有 `.md` 文件的映射。

### 路由处理

URL 参数决定加载哪个 Markdown 文件：

```
/?page=About        → 加载 /src/articles/About.md
/?page=Blog/Post    → 加载 /src/articles/Blog/Post.md
```

## 配置系统

博客由 `/src/config.js` 驱动：

```javascript
const config = {
  title: '博客标题',
  headers: [...],      // 导航
  colors: {...},       // 主题颜色
  markdown: {...},     // 编辑器设置
  social: {...}        // 社交链接
};
```

配置更改在开发中支持热重载。

## 性能优化

1. **代码分割**

   - 按需加载 Markdown
   - 尽可能懒加载组件

2. **静态生成**

   - 构建时 Markdown 处理
   - 无需服务器运行时

3. **资源优化**
   - 来自 CDN 的图片
   - 生产环境压缩 CSS/JS

## 浏览器支持

- Chrome/Edge（最新 2 个版本）
- Firefox（最新 2 个版本）
- Safari（最新 2 个版本）
- 移动浏览器（iOS Safari、Chrome Android）

## 开发工具

### ESLint

使用 React 和 JSX 规则进行代码检查：

```bash
npm run lint
npm run lint:fix
```

### 测试

**Jest** - 单元测试框架
**Playwright** - E2E 测试

```bash
npm test          # 单元测试
npm run test:e2e  # E2E 测试
```

### 脚本

| 命令            | 说明         |
| --------------- | ------------ |
| `npm start`     | 开发服务器   |
| `npm run build` | 生产构建     |
| `npm test`      | 运行测试     |
| `npm run setup` | CLI 设置向导 |

---

设置说明请参阅[部署指南](deployment.zh-CN.md)。

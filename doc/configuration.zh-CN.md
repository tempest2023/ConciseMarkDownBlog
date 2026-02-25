# 配置指南

通过编辑 `/src/config.js` 或使用 GUI 配置编辑器来配置你的博客。

## 目录

- [快速设置](#快速设置)
- [配置选项](#配置选项)
- [导航（头部）配置](#导航头部配置)
- [页面配置](#页面配置)
- [Markdown 编辑器设置](#markdown-编辑器设置)
- [主题配置](#主题配置)
- [保留名称](#保留名称)
- [内部导航](#内部导航)
- [图片和媒体](#图片和媒体)

## 快速设置

### 选项 1：TUI 设置（新用户推荐）

运行交互式 CLI 设置向导：

```bash
npm run setup
```

这将引导你完成基本配置并创建示例文章。

### 选项 2：GUI 配置编辑器

启动开发服务器并打开配置编辑器：

```bash
npm start
# 打开 http://localhost:3000/?page=config
```

GUI 编辑器提供：

- 带颜色选择器的可视化主题定制
- 简单的头部/导航管理
- 更改实时预览
- 导出配置为 `config.js`

### 选项 3：手动编辑

直接编辑 `/src/config.js`：

```javascript
const config = {
  title: '我的博客',
  name: '你的名字',
  email: 'your@email.com',
  // ... 更多选项
};
```

## 配置选项

### 基本信息

| 选项      | 类型   | 说明                                 |
| --------- | ------ | ------------------------------------ |
| `title`   | string | 在导航栏和浏览器标签中显示的博客标题 |
| `name`    | string | 在页脚中显示的作者姓名               |
| `email`   | string | 联系邮箱（可选）                     |
| `default` | string | 默认显示页面（例如 'About'）         |

### 社交链接

| 选项              | 类型   | 说明                      |
| ----------------- | ------ | ------------------------- |
| `social.github`   | string | GitHub 个人主页 URL       |
| `social.linkedin` | string | LinkedIn 个人主页 URL     |
| `resume_url`      | string | 简历/CV URL（可选）       |
| `repo`            | string | "查看源码" 链接的仓库 URL |

### 功能特性

| 选项                   | 类型    | 说明                          |
| ---------------------- | ------- | ----------------------------- |
| `themeEnable`          | boolean | 启用/禁用主题切换按钮         |
| `footer`               | boolean | 显示/隐藏带有社交链接的页脚   |
| `markdown.enable`      | boolean | 启用/禁用内置 Markdown 编辑器 |
| `markdown.tabSize`     | number  | 编辑器的制表符大小（2 或 4）  |
| `markdown.renderDelay` | number  | 预览更新前的延迟（毫秒）      |

## 导航（头部）配置

在 `headers` 数组中定义导航项：

```javascript
headers: [
  { title: '关于', type: 'article' },
  { title: '博客', type: 'article' },
  { title: '项目', type: 'article', customUrl: 'Projects/Project' },
  { title: '简历', type: 'link', customUrl: 'https://your-resume.com' },
];
```

### 头部属性

| 属性        | 类型   | 必需 | 说明                         |
| ----------- | ------ | ---- | ---------------------------- |
| `title`     | string | 是   | 显示文本和默认路径           |
| `type`      | string | 是   | `'article'` 或 `'link'`      |
| `customUrl` | string | 否   | 文章的自定义路径，链接的 URL |

### 路径解析

对于 `type: 'article'`：

- 不带 `customUrl`：加载 `/src/articles/{title}.md`
- 带 `customUrl`：加载 `/src/articles/{customUrl}.md`

示例：

```javascript
// 加载：/src/articles/About.md
{ title: '关于', type: 'article' }

// 加载：/src/articles/Projects/Project.md
{ title: '项目', type: 'article', customUrl: 'Projects/Project' }

// 外部链接
{ title: 'GitHub', type: 'link', customUrl: 'https://github.com/username' }

// 带参数的内部链接
{ title: '演示', type: 'link', customUrl: '/?page=Demo.md' }
```

## 页面配置

### 创建新页面

1. 在 `/src/articles/` 中创建 Markdown 文件：

   ```bash
   touch src/articles/MyPage.md
   ```

2. 添加到配置中的 `headers`：
   ```javascript
   { title: 'MyPage', type: 'article' }
   ```

### 使用文件夹

使用文件夹组织内容：

```
src/articles/
├── About.md
├── Blog.md
└── Projects/
    ├── Project1.md
    └── Project2.md
```

配置：

```javascript
{ title: '项目', type: 'article', customUrl: 'Projects/Project1' }
```

## Markdown 编辑器设置

内置 Markdown 编辑器（`/?page=markdown`）支持：

| 设置          | 默认值  | 说明                          |
| ------------- | ------- | ----------------------------- |
| `enable`      | `true`  | 显示/隐藏 Markdown 编辑器页面 |
| `loading`     | `false` | 预览时显示加载动画            |
| `renderDelay` | `0`     | 预览的防抖延迟（毫秒）        |
| `tabSize`     | `2`     | 制表符的空格数                |

示例：

```javascript
markdown: {
  enable: true,
  loading: false,
  renderDelay: 300,  // 输入后等待 300ms 再更新预览
  tabSize: 2,
  linkStyle: {
    textDecoration: 'none',
    color: '#0077ff'
  }
}
```

## 主题配置

### 内置主题

从 4 个预设主题中选择：

- `default` - 暖橙色
- `ocean` - 蓝色调
- `forest` - 绿色调
- `berry` - 粉色调

### 自定义颜色

为亮色和暗色模式定义自定义颜色：

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

### 主题切换

启用主题切换按钮：

```javascript
themeEnable: true; // 在头部显示太阳/月亮切换按钮
```

## 保留名称

不能用作页面标题或 URL：

- `Markdown`（不区分大小写）- 保留给 Markdown 编辑器
- `Config` - 保留给配置编辑器

## 内部导航

### 链接到其他页面

使用带 `page` 键的 URL 参数：

```markdown
[我的项目](/?page=Projects/project1.md)
```

这将加载 `/src/articles/Projects/project1.md`。

额外参数会被保留：

```markdown
[我的项目](/?page=Projects/demo.md&highlight=section)
```

### 外部链接

外部 URL 直接生效：

```markdown
https://github.com/username
```

## 图片和媒体

### 外部托管（推荐）

将图片上传到云存储并使用直接链接：

```markdown
![替代文本](https://your-image-url.com/image.png)
```

推荐服务：

- [Google Drive](https://www.google.com/drive/)
- [OneDrive](https://www.microsoft.com/en-us/microsoft-365/onedrive)
- [SM.MS](https://sm.ms/)

### 本地图片

将图片放在 `/src/articles/` 中并使用绝对路径引用：

```markdown
![本地图片](/src/articles/images/photo.png)
```

支持的格式：SVG、PNG、JPG、GIF、JPEG、MP4、MP3、AVI、OGG

### Base64 图片

对于小图片，你可以使用 base64 编码：

```markdown
![Base64 图片](data:image/png;base64,iVBORw0KGgo...)
```

---

更多帮助，请参阅：

- [更新内容](updating-content.zh-CN.md) - 如何添加和更新博客文章
- [编辑器指南](editor.zh-CN.md) - 使用内置 Markdown 编辑器

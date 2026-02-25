# 更新博客内容

添加、编辑和管理你的博客文章和页面。

## 目录

- [添加新文章](#添加新文章)
- [更新现有内容](#更新现有内容)
- [使用文件夹组织](#使用文件夹组织)
- [发布更改](#发布更改)
- [最佳实践](#最佳实践)

## 添加新文章

### 第 1 步：创建 Markdown 文件

在 `/src/articles/` 中创建新的 `.md` 文件：

```bash
touch src/articles/我的新文章.md
```

### 第 2 步：编写内容

添加 Markdown 内容：

```markdown
# 我的新文章

发布日期：2024-01-15

## 介绍

你的内容在这里...

## 主要内容

- 要点 1
- 要点 2
- 要点 3

## 结论

感谢阅读！
```

### 第 3 步：添加到导航

编辑 `/src/config.js` 以添加到头部：

```javascript
headers: [
  { title: '关于', type: 'article' },
  { title: '博客', type: 'article' },
  { title: '我的新文章', type: 'article' }, // 添加此项
];
```

### 第 4 步：本地测试

```bash
npm start
```

导航到你的新页面以验证它是否正常工作。

### 第 5 步：部署

```bash
git add .
git commit -m "添加新文章：我的新文章"
git push
```

## 更新现有内容

### 快速编辑

1. 编辑 Markdown 文件
2. 使用 `npm start` 在本地测试
3. 提交并推送

### 使用编辑器

1. 导航到本地站点上的文章
2. 点击翻转按钮（右上角）进入编辑模式
3. 使用实时预览进行更改
4. 将更新后的内容复制回文件
5. 提交并推送

## 使用文件夹组织

创建文件夹结构以更好地组织：

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

使用自定义 URL 更新配置：

```javascript
headers: [
  { title: '关于', type: 'article' },
  { title: '博客', type: 'article', customUrl: 'blog/2024-03-post-3' },
  { title: '项目', type: 'article', customUrl: 'projects/project-1' },
];
```

## 发布更改

### 自动部署（GitHub Pages）

每次推送到 `main` 都会自动部署：

```bash
git add .
git commit -m "更新博客内容"
git push origin main
```

等待 3-5 分钟进行构建和部署。

### 手动部署（Vercel）

Vercel 在每次推送时自动部署：

```bash
git push
```

或手动部署：

```bash
vercel --prod
```

## 最佳实践

### 文件命名

- 使用描述性名称：`react-hooks-guide.md` 而不是 `post1.md`
- 多词名称使用短横线连接（kebab-case）
- 为时效性内容包含日期：`2024-01-tutorial.md`

### 内容结构

- 以 H1（`# 标题`）开头
- 使用 H2（`## 章节`）作为主要章节
- 包含日期或版本信息
- 添加相关内容的链接

### 图片

- 外部托管图片（GitHub、Cloudinary 等）
- 使用描述性的替代文本
- 上传前优化图片

```markdown
![显示 React 组件生命周期的图表](https://example.com/react-lifecycle.png)
```

### 内部链接

使用 `page` 参数链接到其他页面：

```markdown
[阅读我的上一篇文章](/?page=blog/previous-post.md)
```

### 版本控制

- 一起提交相关更改
- 编写清晰的提交信息
- 为重大更改使用分支

```bash
git checkout -b new-feature-post
# 进行更改
git add .
git commit -m "添加关于功能 X 的综合指南"
git push -u origin new-feature-post
# 创建拉取请求
```

## Notion 集成

将 Notion 文档导出为 Markdown：

1. 在 Notion 中，点击 **...** → **导出**
2. 选择 **Markdown 和 CSV**
3. 解压下载的 zip 文件
4. 将 `.md` 文件移动到 `/src/articles/`
5. 清理任何 Notion 特定的格式
6. 用新页面更新 config.js

---

更多信息请参阅：

- [配置指南](configuration.zh-CN.md) - 配置导航
- [编辑器指南](editor.zh-CN.md) - 使用 Markdown 编辑器

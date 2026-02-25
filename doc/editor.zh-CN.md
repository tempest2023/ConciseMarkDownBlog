# Markdown 编辑器指南

内置 Markdown 编辑器为编写和测试博客文章提供实时预览环境。

## 访问编辑器

导航到 `/?page=markdown` 或点击导航中的 **MarkDown**。

示例：`http://localhost:3000/?page=markdown`

## 功能特性

### 实时预览

- **分屏布局** - 左侧编辑器，右侧预览
- **实时更新** - 输入时查看更改
- **精确渲染** - 预览与你的博客样式匹配

### 支持的 Markdown

- [x] GitHub 风格 Markdown
  - 标题（H1-H6）
  - **粗体**、_斜体_、~~删除线~~
  - [链接](https://example.com)
  - 列表（有序/无序）和任务列表
  - 图片
  - 脚注
  - 带语法高亮的代码块
  - LaTeX 数学公式
  - 表格
- [x] Typora 风格引用块
- [x] H1/H2 的水平分隔线

### 编辑器设置

在 `/src/config.js` 中配置：

```javascript
markdown: {
  enable: true,        // 启用/禁用编辑器
  loading: false,      // 显示加载动画
  renderDelay: 0,      // 防抖延迟（毫秒）
  tabSize: 2,          // 制表符缩进（2 或 4 个空格）
  linkStyle: {
    textDecoration: 'none',
    color: '#0077ff'
  }
}
```

### 键盘快捷键

| 快捷键         | 操作       |
| -------------- | ---------- |
| `Tab`          | 缩进行     |
| `Shift+Tab`    | 取消缩进行 |
| `Ctrl/Cmd + A` | 全选       |
| `Ctrl/Cmd + C` | 复制       |
| `Ctrl/Cmd + V` | 粘贴       |

## 使用场景

### 起草博客文章

1. 打开编辑器
2. 使用实时预览编写内容
3. 满意后复制 Markdown
4. 保存到 `/src/articles/YourPost.md`
5. 在配置中添加导航

### 测试格式

- 验证复杂 Markdown 是否正确渲染
- 测试表格格式
- 预览数学公式
- 检查图片对齐

### 内容迁移

- 从其他编辑器粘贴内容
- 将格式转换为 Markdown
- 发布前预览

## 编辑器模式

### 文章翻转按钮

每篇文章页面都有一个翻转按钮（右上角），可在以下模式间切换：

- **预览模式** - 渲染的 Markdown 视图
- **编辑模式** - 带实时预览的原始 Markdown

这允许无需打开完整编辑器即可快速编辑现有文章。

## 未来功能

计划中的增强功能：

- [ ] 自动保存和恢复
- [ ] 导出为 Markdown 文件
- [ ] 导出为 PDF
- [ ] Notion 风格块编辑器
- [ ] 视频嵌入支持（YouTube、Bilibili）
- [ ] 带排序的数据表

## 技巧

### 性能

- 为大型文档设置 `renderDelay: 300`
- 减少输入时的 CPU 使用
- 暂停后仍显示预览

### 图片

使用外部图片 URL 以获得最佳性能：

```markdown
![替代文本](https://your-cdn.com/image.png)
```

### 代码块

指定语言以获得语法高亮：

```javascript
const greeting = 'Hello World';
console.log(greeting);
```

---

配置选项请参阅[配置指南](configuration.zh-CN.md)。

# L-Mini Tools · 导航页

一个简洁、美观的静态导航页，用于展示小工具、娱乐内容以及团队成员信息。支持深色模式、移动端适配、一键复制联系方式，并内置工具详情弹窗。

## ✨ 特性

- **工具导航**：番茄钟、ECG · 心电监护，点击卡片弹出详细介绍。
- **娱乐分类**：预留占位，方便日后扩展。
- **成员展示**：6 个成员卡片，点击弹出成员详情，包含头像、角色、介绍、联系方式（QQ、手机号、邮箱、抖音号），均可一键复制。
- **开发软件跳转**：成员详情内可快速跳转到对应工具卡片。
- **深色模式**：跟随系统自动切换浅色 / 深色主题。
- **移动端适配**：响应式布局，触控优化，手机体验良好。
- **一键复制**：所有联系方式卡片点击即可复制到剪贴板，并弹出 Toast 提示。
- **纯静态**：无需后端，仅 HTML + CSS + JavaScript，开箱即用。

## 📁 文件结构

```
.
├── index.html          # 主页面
├── style.css           # 样式表
├── script.js           # 交互逻辑
├── A1.png              # 番茄钟图标/图片
├── A2.png              # ECG · 心电监护图标/图片
├── A3.jpg              # 成员 1 头像
├── A4.jpg              # 成员 2 头像
└── README.md           # 项目说明
```

> 若需要新增成员头像，请按 `A5.jpg`、`A6.jpg` 命名并放入根目录，然后在 `index.html` 中对应位置引用。

## 🚀 快速开始

1. **下载或克隆仓库**
   ```bash
   git clone https://github.com/lpjsw114514-ui/RlErce.git
   ```
2. **准备图片资源**
   将 `A1.png`、`A2.png`、`A3.jpg`、`A4.jpg` 放到与 `index.html` 同级的目录中。
3. **打开页面**
   直接用浏览器打开 `index.html` 即可，或使用任意静态服务器（如 `python -m http.server`）。

> 推荐使用 Chrome / Edge 等现代浏览器，以获得完整功能与最佳体验。

## 🛠️ 自定义指南

### 修改工具卡片
- 在 `index.html` 中找到 `<div class="tools-grid">`，按现有格式增删卡片。
- 卡片图片修改 `src` 属性，标题和描述在 `.tool-info` 中调整。
- 对应弹窗内容位于页面底部的 `<div class="modal-overlay" id="tomato-modal">` 和 `id="ecg-modal"` 中。

### 修改成员信息
- 成员卡片：在 `<div class="members-grid">` 中修改或复制 `.member-card`。
- 成员详情弹窗：在页面底部找到 `id="member-modal-X"`，修改头像、名称、角色、联系方式、介绍等。
- 联系方式的可复制文本由 `data-copy` 属性控制，修改该属性值即可更新复制内容。
- 成员 2 的模态框中已包含“抖音号”字段，如需修改，请定位到 `member-modal-2`。

### 修改底部联系方式
- 在 `<div class="footer-info">` 中修改 `data-copy` 与显示文本。

### 调整主题色
- 所有颜色通过 `style.css` 中的 CSS 变量控制，修改 `:root` 和 `@media (prefers-color-scheme: dark)` 下的变量即可全局换色。

## 📱 浏览器兼容性

| 浏览器 | 支持情况 |
|--------|----------|
| Chrome / Edge | ✅ 完全支持 |
| Safari | ✅ 基本支持（复制功能可能需要用户手势） |
| Firefox | ✅ 基本支持 |
| 移动端浏览器 | ✅ 已适配 |

> 深色模式依赖 `prefers-color-scheme`，现代浏览器均支持。

## 🤝 贡献

欢迎提交 Issue 或 Pull Request 来完善这个导航页。如果你有好的工具推荐或设计建议，也欢迎交流。

## 📞 联系方式

- **QQ 交流群**：1125056067
- **GitHub**：https://github.com/lpjsw114514-ui/
- **开发者邮箱**：hail@hotmail.com

## 📄 许可证

本项目采用 MIT 许可证，详情请见 [LICENSE](LICENSE) 文件（若未添加，可自行创建）。

---

**L-Mini Tools** · 小巧实用的工具与娱乐导航

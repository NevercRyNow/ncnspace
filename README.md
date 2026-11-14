# NCNSPACE — official website

自包含的静态官网：无构建步骤、无第三方脚本、无外部字体、无 Cookies。
页面围绕 `SPACE / CONTROL / FREEDOM` 三个概念组织。当前版本有意使用**从 Compose 源码结构提取的绘制式理想简图**，不展示旧的项目截图；产品实拍/录屏素材留到后续替换。

## 本地预览

```bash
cd ncnspace/ncn-space/site
python3 -m http.server 4173
# http://127.0.0.1:4173
```

当前工作区已有一个预览服务运行在 `http://127.0.0.1:4173/`。

**线上站点：** https://nevercrynow.github.io/ncnspace/  
**线上仓库：** https://github.com/NevercRyNow/ncnspace

线上仓库只包含官网静态文件（根目录即 `index.html`），不包含 Android 工程。

## 页面结构

| # | 区块 | 锚点 |
| --- | --- | --- |
| 01 | Hero · BEYOND THE SCREEN. | `#overview` |
| 02 | Philosophy · A DIFFERENT WAY TO COMPUTE. | `#features` |
| 03 | Desktop Experience · YOUR DESKTOP, REIMAGINED. | `#experience` |
| 04 | Beyond the Screen · ONE DEVICE. MORE SPACE. | `#beyond` |
| 05 | Control · CONTROL WITHOUT LIMITS. | `#control` |
| 06 | Visual Language · PRECISION IN EVERY DETAIL. | `#visual` |
| 07 | Development · BUILT WITH PURPOSE. | `#development` |
| 08 | Final · YOUR DEVICE. YOUR SPACE. YOUR WAY. | `#download` |

导航：Overview / Features / Experience / Development / Liquid Glass / GitHub，外加 Download。
语言：默认中文，可切换 English；选择写入 localStorage。  
宽屏（≥1500px）额外显示左侧章节导轨；顶部有 1px 滚动进度线。

## 目录

```text
site/
├── index.html                    # 单页官网
├── styles.css                    # 设计 tokens + 区块样式 + v3 电影感滚动 / 简图 / 响应式
├── main.js                       # 菜单 / 章节导航 / 滚动进度 / Sticky Experience / 触控板 / 材质 / 复制
├── ARCHITECTURE.md               # 现有架构审查、集成方案、风险与限制
├── THIRD_PARTY_NOTICES.md        # Liquid Glass 参考项目 / 上游许可证说明
├── engine/                       # 独立 WebGL2 Liquid Glass Engine + 完整 shader
│   ├── engine.js
│   ├── components.js
│   ├── materials.js
│   ├── spring.js
│   ├── gl-utils.js
│   └── shaders/
├── liquid-glass-lab/             # /liquid-glass-lab/ 交互实验室
│   ├── index.html
│   ├── lab.css
│   └── lab.js
├── manifest.webmanifest          # 添加到主屏幕
├── NOTICE.md                     # 字体 / 商标 / 素材署名
├── robots.txt
├── 404.html
├── .nojekyll
├── download/
│   ├── NCNSPACE-1.0.0-android.apk
│   └── NCNSPACE-1.0.0-android.apk.sha256
└── assets/
    ├── film.mp4                  # 30 秒无声概念片，720p / H.264 / 3.9 MB
    ├── fonts/                    # Manrope 400 / 600（本地）
    └── img/                      # 产品截图、控制截图、微距裁切、图标、海报、OG
```

## v3 / v4 升级点

- 默认中文语言层：导航、章节标题、按钮、状态与主要文案可切换 English；默认 `zh-CN`。
- 制作人名单：`Only 郑壹鸣`，位于页脚 Credits。

- **首页宣传片**：Hero 之后是内嵌 30 秒无声概念片，进入视口自动静音播放，原生 controls 可暂停 / 全屏 / 拖拽；不再用弹窗。
- **Sticky Experience**：手机理想简图固定在视口内，随 3 个章节切换 Shell / Library / Themes，滚动时交叉淡入。
- **章节导轨 + 滚动进度**：宽屏左侧 01–08 导轨，当前区块高亮；顶部进度线跟随页面。
- **绘制式 Visual Language**：Dock / 图标 / 折射 / 壁纸 / 窗口五张 inline SVG 简图，可悬停微缩放；不依赖旧截图。
- **结构重排**：Experience 从两段长图文改为一个 sticky 舞台，页面更短、更有节奏。
- **JS 重写**：菜单、导航状态、Sticky 章节、触控板、材质开关、复制哈希统一为一个无依赖脚本。
- `prefers-reduced-motion` 下关闭入场 / 遮罩 / 过渡动画。

### v4 — WebGL2 Liquid Glass Engine

- 独立的 `engine/`：场景 FBO、可分离高斯模糊、scissored 2-blit 多层玻璃合成、
  SDF 折射 / 色散 / 边缘高光 / 内外阴影、DPR、质量档位、弹簧按压、GPU 释放。
- Visual Language 的材质卡改为真实的 WebGL 画布：背景场景先渲染到 FBO，玻璃读取
  累积场景，不读取正在写入的 framebuffer。
- `liquid-glass-lab/`：5 个可拖动玻璃组件、4 种材质、实时参数、背景切换、深浅主题、
  High / Balanced / Performance / Mobile Saver。
- WebGL2 不可用或强制 `?glass=off` / `?fallback=1` 时，显示明确的 CSS fallback；
  不把 CSS 透明效果说成实时折射。
- 参考项目的实际许可证是 **AGPL-3.0**（不是任务描述中的 Apache-2.0）；本项目**没有复制**
  AGPL 源码，而是使用原创建模/渲染实现。上游 Apache-2.0 设计来源已署名，详见
  [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md) 与 [`engine/README.md`](engine/README.md)。

## 产品事实（页面同步）

| 项 | 值 |
| --- | --- |
| 版本 | 1.0.0 |
| 最低系统 | Android 8.0+ / API 26 |
| 安装包 | 12.2 MB（12,810,601 bytes） |
| SHA-256 | `b0bea9fe6dd43e8dc0a4a0bf725a289d08f27006472cb186125d1f03cbc005d2` |
| 框架 | Kotlin · Compose Multiplatform |
| 网络访问 | 无 `INTERNET` 权限 |
| 主题 / 壁纸 | 6 / 5 |
| 包名 | `com.nevercrynow.ncnspace` |

APK 的原始文件来自 `../dist/android/NcnSpace-1.0.0-release.apk`。替换 APK 时，同步：

1. `index.html` 中 `[data-hash]` 的 SHA-256；
2. `download/*.sha256`；
3. 下载区与 hero 中的 `12.2 MB` 文案；
4. 本文件的事实表。

## 真实状态（页面不夸大）

- Launcher / Dock / Library：已验证。
- Desktop Mode / Workspaces：可工作的 prototype，不是完整的自由窗口桌面。
- External display：模拟显示已验证；物理 USB-C / HDMI 输出仍未真机验证。
- Virtual windows：root 路径已验证；Shizuku 授权与低帧率预览的限制已写在页面里。
- Gamepad：D-pad 焦点与持久化已验证；物理手柄仍待测试。
- Play Store：未上架。
- OpenGL ES 3.0：只用于设备 GPU 能力探针；渲染仍是 Compose / Skia，不宣称自定义 GL 渲染后端。

## 素材与性能

- 当前页面不引用 `assets/img/*` 的产品截图；Hero / Experience / Beyond / Control / Visual 均为 inline SVG 简图。
- `assets/img/` 中的旧素材保留在原处，供后续替换，不在页面上出现。
- 简图的布局、颜色和文案来自 Compose 源码与产品文档，不是把旧截图描一遍。
- 图标：`../branding/ncn-icon-1024.png` 的 64 / 180 / 512 版本（品牌图标仍使用）。
- 影片：`../../ncnspace-promo/NCNSPACE-30s-1080p30.mp4`，网页内转码为 720p。
- 字体：项目自带 Manrope（`../design/src/commonMain/composeResources/font/`），SIL OFL 1.1。

当前页面没有产品 `<img>` 引用；首屏只加载 CSS/JS/SVG/字体。旧 JPEG 保留在目录中但不会被请求。站内没有外部图片、iframe 或第三方字体。

## 部署到 GitHub Pages

仓库已包含 `.github/workflows/pages.yml`：

1. 推送 `site/**` 到 `main`，或在 Actions 里手动运行 **Deploy NCNSPACE site to GitHub Pages**。
2. 在 GitHub 仓库 **Settings → Pages** 中选择 **Source: GitHub Actions**。
3. 线上地址为 `https://<user>.github.io/<repo>/`。

所有站内路径都是相对路径（`assets/...`、`download/...`、`styles.css`），因此项目页的子路径部署
不需要改 base path。`404.html` 在 artifact 根目录，GitHub Pages 会直接使用。
导航和结尾的 GitHub 链接当前指向 `https://github.com/NevercRyNow/ncnspace`；canonical 与 OG URL
指向 `https://nevercrynow.github.io/ncnspace/`。如果换账号 / 自定义域名，请全局替换这些 URL。

手动部署也可以：把整个 `site/` 目录原样上传到任意静态托管。建议给 APK 设置
`Content-Type: application/vnd.android.package-archive`，给 `/assets/*` 设置长缓存。

## 编辑提示

- 文案：`index.html`。顺序是 Hero → Philosophy → Experience → Beyond → Control → Visual → Development → Final。
- 颜色 / 间距：`styles.css` 顶部 `:root`；v3 的 Sticky Experience、导轨与简图样式在文件末尾。
- 动效：`reveal`、`prefers-reduced-motion` 与 `main.js` 的观察器；
  `data-experience` 是 Sticky Experience，`data-touchpad` 是触控板演示，`data-glass` 是材质演示，
  `data-exp-shot` 是 Experience 简图切层。
- 改 CSS / JS 后递增 `index.html` 里的 `?v=...`，避免 GitHub Pages / 浏览器缓存旧文件。
- 画廊改为 Visual Language 的微距卡；保持 `1120 / 2436` 竖屏、`1200 / 540` 宽屏比例，避免 `object-fit` 裁切。
- Hero、章节、触控板与简图仍是原生 CSS / JS；Liquid Glass 画布是独立的 WebGL2 模块，
  不依赖 3D 库或第三方动画库。Shader 通过 `fetch()` 加载，没有构建步骤。
- 改 engine / shader 后把 `index.html` 与 `liquid-glass-lab/index.html` 中相关 `?v=` 一起递增。

## 本机检查

- 390 / 820 / 1180 / 1600 宽度：无横向溢出，导航、章节导轨与标题不裁切。
- 移动菜单打开 / 关闭、焦点归还、Escape、链接跳转已验证。
- 首页宣传片自动播放 / 暂停、隐私弹窗、SHA-256 复制、减少透明效果开关已验证。
- Sticky Experience 的 3 个章节切换、章节导轨与滚动进度已验证。
- SVG 简图在 1180 / 1024 / 412 宽度下无横向溢出；当前页面产品 `<img>` 数量为 0。
- WebGL2：主站材质台 live，lab 5 个玻璃面，拖动 / 滑块 / 材质 / 主题 / 质量档位已验证。
- 强制 fallback：`?glass=off`（主站）与 `?fallback=1`（lab）显示 CSS fallback 状态。
- 首屏图片、字体、CSP、manifest、404 页面均返回 200。
- 默认中文与 English 切换、语言持久化、制作人名单已验证。

### 兼容性说明

本轮只在当前 Workbench 的 WebKit/WebGL2 环境做了真实渲染与交互测试，未在真实
Chrome / Edge / Android / iOS 设备上跑完整矩阵。无 WebGL2 时走明确 fallback；建议上线前
补一轮真机矩阵。

# NCNSPACE — GitHub Pages 部署包

NCNSPACE 官网的独立可部署版本：`index.html` 在根目录，无构建步骤，直接由 GitHub Pages 提供。

- 线上站点：https://zym-cpu.github.io/ncnspace/
- Liquid Glass Lab：https://zym-cpu.github.io/ncnspace/liquid-glass-lab/
- 仓库：https://github.com/zym-cpu/ncnspace

## 语言与制作人

- 默认语言：中文（`zh-CN`）；顶部导航可切换 **English**，选择写入 localStorage。
- 制作人：**Only 郑壹鸣**（页脚 Credits）。

## v4 内容

- WebGL2 Liquid Glass Engine：场景 FBO、可分离高斯模糊、scissored 2-blit 多层合成、
  SDF 折射 / 色散 / 边缘高光 / 内外阴影、DPR、质量档位、按压弹簧、资源释放。
- 官网顶部导航、Hero 两个 CTA 是真实 WebGL2 玻璃胶囊；Visual Language 材质台与 Lab 使用真实折射。
- 当前 Hero / Experience / Beyond / Control / Visual 使用 **source-derived SVG 简图**，
  页面不渲染旧产品截图；旧 images 保留在 `assets/img/` 供后续替换。
- 4 套材质：Obsidian、Titanium、Ice、Crystal，共用同一套 shader。
- 可复用描述式组件：Panel / Button / Navbar / Dock / Dialog / Card / Toggle / Slider / Pill。
- 独立实验室 `liquid-glass-lab/`：5 个可拖动玻璃面、实时参数、背景切换、深浅主题、质量档位。
- WebGL2 不可用或 `?glass=off` / `?fallback=1`：明确的 CSS fallback 状态，不冒充实时折射。
- 参考项目实际许可证为 AGPL-3.0，本项目未复制其源码；上游 Apache-2.0 设计来源已署名。
  详见 `THIRD_PARTY_NOTICES.md`、`ARCHITECTURE.md`、`engine/README.md`。

## 本地预览

```bash
cd ncnspace-site
python3 -m http.server 4173
# http://127.0.0.1:4173/
# http://127.0.0.1:4173/liquid-glass-lab/
```

## 部署

仓库已带 `.github/workflows/pages.yml`，推送 `main` 后自动部署。Pages Source 选择
**GitHub Actions**。站内路径全部相对，项目页子路径不需要改 base path。

## 产品事实

| 项 | 值 |
| --- | --- |
| 版本 | 1.0.0 |
| 最低系统 | Android 8.0+ / API 26 |
| 安装包 | 12.2 MB |
| SHA-256 | `b0bea9fe6dd43e8dc0a4a0bf725a289d08f27006472cb186125d1f03cbc005d2` |
| 框架 | Kotlin · Compose Multiplatform |
| 网络访问 | 无 `INTERNET` 权限 |

APK 在 `download/NCNSPACE-1.0.0-android.apk`，直接下载；页面没有第三方脚本、字体或分析。

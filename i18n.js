(() => {
  'use strict';

  const ZH = {
    // chrome
    'Overview': '概览', 'Features': '特性', 'Experience': '体验', 'Development': '开发',
    'Liquid Glass': '液态玻璃', 'Download': '下载', 'Philosophy': '理念', 'Beyond': '跨屏',
    'Control': '控制', 'Visual': '视觉', 'Final': '终章', 'Lab ↗': '实验室 ↗',
    'Explore NCNSPACE': '探索 NCNSPACE', 'Explore GitHub': '探索 GitHub',
    'Watch the 30s film': '观看 30 秒概念片', 'Platform': '平台', 'Build': '版本', 'Privacy': '隐私',
    'A new desktop experience, built for Android.': '为 Android 打造的全新桌面体验。',
    'Your Device. Your Space. Your Way.': '你的设备。你的空间。你的方式。',
    'NCNSPACE / ANDROID DESKTOP ENVIRONMENT': 'NCNSPACE / ANDROID 桌面环境',
    'Android Desktop Environment · by NeverCryNow': 'Android 桌面环境 · by NeverCryNow',
    'DESKTOP MODE / SCHEMATIC': '桌面模式 / 简图', 'ONE SPACE / TWO FORMS': '一个空间 / 两种形态',
    '77 APPS · 12 GAMES': '77 个应用 · 12 个游戏', 'SCROLL': '向下滚动',
    'SPACE': '空间', 'CONTROL': '控制', 'FREEDOM': '自由', 'LOCAL-FIRST': '本地优先',
    'PHILOSOPHY': '理念', 'DESKTOP EXPERIENCE': '桌面体验', 'THE SHELL / 01': '桌面外壳 / 01',
    'SOURCE-DERIVED SCHEMATIC': '源文件推导简图', '02 / THE LIBRARY': '02 / 应用库',
    '03 / THEMES & MATERIAL': '03 / 主题与材质', 'THEMES': '主题', 'WALLPAPERS': '壁纸', 'DENSITY': '密度',
    'BEYOND THE SCREEN': '超越屏幕', 'WITHOUT LIMITS.': '不设限。', 'PRECISION IN': '精准见于',
    'EVERY DETAIL.': '每一处细节。', 'BUILT WITH': '为', 'PURPOSE.': '目的而建。',
    'THE NEXT SCREEN': '下一块屏幕', 'YOUR DEVICE.': '你的设备。', 'YOUR SPACE.': '你的空间。',
    'YOUR WAY.': '你的方式。', 'The desktop experience is evolving.': '桌面体验，正在进化。',
    'Download APK': '下载 APK', 'Explore on GitHub': '在 GitHub 上探索', 'INSTALL / 03 STEPS': '安装 / 3 步',
    'Copy': '复制', 'Open Liquid Glass Lab →': '打开液态玻璃实验室 →', 'OPEN LAB ↗': '打开实验室 ↗',
    'REFRACTION': '折射', 'BLUR': '模糊', 'CHROMATIC': '色散', 'HIGHLIGHT': '高光', 'OPACITY': '不透明度',
    'RADIUS': '圆角', 'CURVATURE': '曲率', 'QUALITY': '质量', 'BACKGROUND': '背景', 'TARGET SURFACE': '目标表面',
    'MATERIAL': '材质', 'REALTIME UNIFORMS': '实时参数', 'CONTROL SURFACE': '控制面板',
    'Spatial': '空间', 'Desktop': '桌面', 'Library': '应用库', 'Light': '浅色',
    'LIGHT FIELD': '浅色场', 'DARK FIELD': '深色场', 'RESET SURFACES': '重置表面',
    'High quality': '高质量', 'Balanced': '均衡', 'Performance': '性能', 'Mobile saver': '移动端省电',
    'REAL DEVICE CAPTURE': '真实设备拍摄', 'IDEAL INPUT MAP / NO DEVICE CAPTURE': '理想输入映射 / 无设备拍摄',
    'FOCUS RING / A': '焦点环 / A', 'VIRTUAL DISPLAY #26': '虚拟显示 #26', 'ROOT / LIVE PREVIEW': 'ROOT / 实时预览',
    'MINIMIZE': '最小化', 'MAXIMIZE': '最大化', 'BACK': '返回', 'CLOSE': '关闭',
    'Always within reach': '始终触手可及', 'Ideal app geometry': '理想应用几何', 'Refraction, not decoration': '折射，而非装饰',
    'Five bundled presets': '五张内置壁纸', 'Window geometry': '窗口几何', 'STACK / ACTUAL BUILD': '技术栈 / 实际构建',
    'STATUS / HONEST': '状态 / 诚实', 'VERSION': '版本', 'PLATFORM': '平台', 'BUILD': '构建', 'PACKAGE': '包名',
    'THEMES / WALLPAPERS': '主题 / 壁纸', 'NETWORK': '网络', 'NO INTERNET PERMISSION': '无 INTERNET 权限',
    'Liquid Glass Lab': '液态玻璃实验室', 'Type: Manrope · SIL OFL 1.1': '字体：Manrope · SIL OFL 1.1',
    'PRODUCTION / 制作人': '制作人',
    'A DIFFERENT': '一种不同的', 'WAY TO COMPUTE.': '计算方式。',
    'YOUR DESKTOP,': '你的桌面，', 'REIMAGINED.': '重新想象。',
    'ONE DEVICE.': '一台设备。', 'MORE SPACE.': '更多空间。', 'ONE DEVICE / MORE SPACE': '一台设备 / 更多空间',
    'VISUAL LANGUAGE': '视觉语言', 'THE LIBRARY / 02': '应用库 / 02', 'THEMES / 03': '主题 / 03',
    'ONE SURFACE / 4 → 8 COLUMNS': '一个界面 / 4 → 8 列', 'POINTER': '指针', 'FOCUS': '焦点',
    '1 FINGER / 2 STICKS / 0 FRICTION': '单指 / 双摇杆 / 零摩擦', 'HANDHELD': '手持', 'EXTENDED': '扩展',
    'MOVE': '移动', 'TAP': '轻点', 'DRAG': '拖动', 'TOUCH SURFACE': '触控表面', 'LIVE / 01': '实时 / 01',
    'MOVE · SCROLL · TAP · DRAG': '移动 · 滚动 · 轻点 · 拖动', '1 FINGER / POINTER': '单指 / 指针',
    '2 FINGERS / SCROLL': '双指 / 滚动', 'D-PAD / FOCUS': 'D-PAD / 焦点', 'A / CONFIRM': 'A / 确认',
    'B / BACK': 'B / 返回', 'LIVE REFRACTION': '实时折射', 'BLUR 24': '模糊 24', 'DPR AUTO': 'DPR 自动',
    'IDLE / ON DEMAND': '空闲 / 按需', 'PHONE / TOUCHPAD': '手机 / 触控板',
    '01 / PHONE TOUCHPAD': '01 / 手机触控板', '02 / GAMEPAD CONTROL': '02 / 手柄控制',
    '03 / WINDOW INTERACTION': '03 / 窗口交互',
    'LIQUID GLASS': '液态玻璃', 'TYPE': '字体', 'DEVELOPMENT': '开发', 'LOCAL-FIRST': '本地优先',
    'Local-first': '本地优先', '01 / THE SHELL': '01 / 桌面外壳', 'Desktop Mode · 横屏 / 宽屏自适应': '桌面模式 · 横屏 / 宽屏自适应',
    'A FILM BY NEVERCRYNOW': 'NEVERCRYNOW 作品', 'NOTE': '备注', 'PRIVACY': '隐私', 'LAST UPDATED / 2026.11': '最后更新 / 2026.11',
  };

  const EN = {
    '跳到主要内容': 'Skip to content',
    '突破屏幕边界，让 Android 拥有更自由的桌面体验。': 'Break the boundaries of the screen and give Android a freer desktop experience.',
    'NCNSPACE 把菜单栏、Dock、应用库、桌面模式与外接屏，重新组织成同一套空间。不是把手机界面横过来，而是让 Android 真正拥有一个桌面。': 'NCNSPACE reorganizes the menu bar, Dock, app library, desktop mode and external display into one spatial system. It is not the phone UI stretched sideways; it gives Android a real desktop.',
    '本地优先': 'Local-first',
    'NCNSPACE 不模仿某一个桌面。它从空间、控制与自由三个词出发，重新安排 Android 的每一寸界面。': 'NCNSPACE does not imitate a particular desktop. It starts from space, control and freedom, and rearranges every inch of Android.',
    '桌面不是一页图标，也不是把屏幕横过来。它是一套关于位置、层级与动作的秩序。': 'A desktop is not a page of icons, nor a phone turned sideways. It is an order of position, hierarchy and motion.',
    '空间': 'Space', '布局列数': 'Columns', '主题': 'Themes', '网络访问': 'Network',
    '重新定义 Android 桌面空间。': 'Redefining Android desktop space.',
    '菜单栏、Dock、应用库与工作区共享同一套度量。内容一直画到屏幕底部，又从 Dock 背后穿过去。': 'Menu bar, Dock, app library and workspaces share one set of metrics. Content runs to the bottom edge and passes behind the Dock.',
    '让手机、触控板与手柄成为自然的控制方式。': 'Make the phone, touchpad and gamepad natural ways to control the space.',
    '单指移动光标，双指滚动，D-pad 移动焦点。输入方式在变，焦点环与反馈始终一致。': 'One finger moves the cursor, two fingers scroll, D-pad moves focus. Input changes; the focus ring and feedback stay consistent.',
    '让设备在不同屏幕和场景中自由延伸。': 'Let the device extend freely across screens and contexts.',
    '手机、外接显示器与虚拟窗口，不是彼此复制。每块屏有自己的布局，也有自己的用途。': 'Phone, external display and virtual windows are not copies of one another. Each screen has its own layout and purpose.',
    '菜单栏、Dock、Finder 式应用库、工作区与六套主题。不是一组主题包，而是一套从头算起的桌面秩序。': 'Menu bar, Dock, Finder-style app library, workspaces and six themes. Not a theme pack, but a desktop order calculated from scratch.',
    '一眼就知道，': 'You know at a glance:', '这是一个桌面。': 'this is a desktop.',
    '顶部菜单栏读取真实时间、电量与网络；Dock 上是真实存在的应用；内容画到屏幕底部，又从 Dock 背后穿过去。': 'The top bar reads real time, battery and network; the Dock contains real apps; content runs to the bottom and passes behind the Dock.',
    '菜单栏 / 实时状态': 'Menu bar / live status', '浮动的 Dock / 真实启动': 'Floating Dock / real launch',
    '竖向 4 列 · 横向 8 列': '4 portrait columns · 8 landscape columns',
    '89 个应用，': '89 apps,', '不该是一堵墙。': 'should not be a wall.',
    'Finder 式应用库：搜索、分类、排序、收藏、最近使用、隐藏应用。图标来自系统，封面可以自己换。': 'Finder-style app library: search, categories, sorting, favorites, recents and hidden apps. Icons come from the system; covers can be replaced.',
    '搜索 / 筛选 / 排序': 'Search / filter / sort', '收藏与最近使用': 'Favorites and recents',
    '自定义封面与名称': 'Custom covers and names', '六套主题，': 'Six themes,', '同一套秩序。': 'one order.',
    'macOS Light / Dark、Midnight、Graphite、Minimal 与 Custom。切换时整个界面交叉淡入，布局不重排。': 'macOS Light / Dark, Midnight, Graphite, Minimal and Custom. Switching cross-fades the whole interface without reflow.',
    '6 套主题 / 5 张壁纸': '6 themes / 5 wallpapers', '亮壁纸自动加 scrim': 'Automatic scrim on light wallpapers',
    '随 APK 打包，不需要文件访问或网络': 'Bundled with the APK; no file or network access',
    '竖屏到横屏，同一套 LayoutMetrics': 'Portrait to landscape with the same LayoutMetrics',
    '接入外接显示后，NCNSPACE 用 Android 的 Presentation 输出一套独立桌面，不是把手机画面放大。手机留在手里，继续做触控板、键盘和遥控器。': 'When an external display is connected, NCNSPACE uses Android Presentation to output an independent desktop — not a magnified phone. The phone stays in your hand as touchpad, keyboard and remote.',
    'Desktop Mode · 横屏 / 宽屏自适应': 'Desktop Mode · landscape / wide adaptive',
    '模拟显示已验证 · 物理输出仍在内测': 'Simulated display verified · physical output still in beta',
    '扩展，不是镜像': 'Extend, don\'t mirror', '大屏拥有自己的桌面与布局，手机留在 Launcher Mode，两块屏幕各自工作。': 'The big screen has its own desktop and layout; the phone stays in Launcher Mode. Two screens work independently.',
    '比例自己算': 'Aspect ratios calculated', '16:9、21:9 与宽屏布局共用一套密度推导，不把手机 UI 直接拉伸。': '16:9, 21:9 and wide layouts share one density derivation; the phone UI is not stretched.',
    '输入留在手里': 'Input stays in your hand', '内置触摸板、键盘与手柄导航，让手机成为大屏的输入设备，而不是另一块屏。': 'Built-in touchpad, keyboard and gamepad navigation make the phone an input device for the big screen, not another screen.',
    '外接屏物理输出、OEM 投屏协议与 Android TV 仍待真机验证；页面不把模拟显示写成已完成。': 'Physical external output, OEM casting protocols and Android TV still need device verification; the page does not claim simulated output as finished.',
    '控制不应该被屏幕尺寸限制。手机、手柄与光标，各自有自己的动作，但都指向同一个焦点。': 'Control should not be limited by screen size. Phone, gamepad and cursor each have their own gestures but point to the same focus.',
    '手机，': 'The phone,', '就是触控板。': 'is the touchpad.', '单指移动光标，双指滚动，轻点确认，按住拖动。手机留在手里，大屏继续工作。': 'One finger moves the cursor, two fingers scroll, tap to confirm, press and drag. The phone stays in your hand while the big screen works.',
    '摇杆，': 'The stick,', '也是光标。': 'is also a cursor.', '左摇杆移动光标，D-pad 移动焦点，A 确认，B 返回。焦点环始终可见，长时间使用不需要伸手去够屏幕。': 'Left stick moves the cursor, D-pad moves focus, A confirms, B goes back. The focus ring is always visible; no need to reach for the screen.',
    'D-pad 焦点与持久化已验证；物理手柄仍待真机测试。': 'D-pad focus and persistence verified; physical controller still awaiting device test.',
    '真实应用，': 'Real apps,', '画进窗口。': 'drawn into windows.', '最小化、最大化、返回、关闭。真实 Android 应用运行在隐藏的 virtual display 上，再画进一张 macOS 风格窗口。': 'Minimize, maximize, back, close. Real Android apps run on a hidden virtual display and are drawn into a macOS-style window.',
    '需要 root 或 Shizuku；当前为低帧率预览。自由拖拽、缩放与吸附仍待实现。': 'Requires root or Shizuku; current preview is low frame rate. Free drag, resize and snapping are still pending.',
    '导航和浮层使用折射、模糊与静态边缘高光；内容区保持实色。亮色壁纸上自动加一层 scrim，文字永远读得清。Android 13+ 使用 AGSL Runtime Shader；低性能与“减少透明效果”时退回实色。': 'Navigation and overlays use refraction, blur and static edge highlights; content stays solid. Light wallpapers get an automatic scrim so text remains readable. Android 13+ uses AGSL Runtime Shader; low-performance and Reduce Transparency fall back to solid.',
    '24 — 34 dp，仅在功能层': '24–34 dp, functional layers only', '静态，≤ 0.22 不透明度': 'Static, ≤ 0.22 opacity',
    'Manrope / 系统中文': 'Manrope / system Chinese', '内容在前，': 'Content first,', '材质在后。': 'material second.',
    '减少透明效果': 'Reduce transparency', '只列出真实使用的技术，也只标记真实完成的状态。NCNSPACE 是一个 Android 原生项目，不把计划中的能力写成已完成。': 'Only the stack actually used, and only statuses actually reached. NCNSPACE is a native Android project; planned capabilities are not written as finished.',
    'OpenGL ES 3.0 只用于设备 GPU 能力探针；当前渲染仍是 Compose / Skia，不宣称自定义 GL 渲染后端。': 'OpenGL ES 3.0 is used only for the device GPU capability probe; rendering remains Compose / Skia. No custom GL render backend is claimed.',
    '状态来自项目文档与真机 / 模拟器记录。物理外接屏、Shizuku 授权与物理手柄仍未验证。': 'Status comes from project docs and device/emulator records. Physical external display, Shizuku authorization and physical gamepad remain unverified.',
    '无 INTERNET 权限': 'No INTERNET permission', '桌面体验，正在进化。': 'The desktop experience is evolving.',
    '未上架 Play Store · 不需要 root 即可使用主要功能': 'Not on Play Store · main features work without root',
    '下载 APK 到设备。': 'Download the APK to your device.', '在系统设置中允许当前来源安装未知应用。': 'Allow installs from this source in system settings.',
    '打开 NCNSPACE，按提示设为默认桌面。': 'Open NCNSPACE and set it as the default desktop.',
    '复制': 'Copy', '复制失败': 'Copy failed', '独立作品，与 Apple、Google 无关联。Android 是 Google LLC 的商标；macOS 是 Apple Inc. 的商标。': 'Independent work, not affiliated with Apple or Google. Android is a trademark of Google LLC; macOS is a trademark of Apple Inc.',
    '隐私说明': 'Privacy', '本站不加载第三方脚本、字体或分析服务。': 'This site loads no third-party scripts, fonts or analytics.',
    '你的浏览器不支持视频播放。': 'Your browser does not support video playback.',
    '30 秒无声概念片 · 1280 × 720 · 30 fps': '30-second silent concept film · 1280 × 720 · 30 fps',
    '没有账号，也没有追踪。': 'No accounts. No tracking.',
    '这个网站是静态页面：没有 Cookies、没有分析脚本、没有广告像素，也没有第三方字体。它只从同一台服务器加载页面、图片、字体和安装包。': 'This is a static site: no cookies, analytics, ad pixels or third-party fonts. It loads the page, images, fonts and APK from the same server.',
    'NCNSPACE 应用本身本地优先。它没有申请 INTERNET 权限，不上传应用列表、使用记录或个人信息，也没有云端同步。': 'The NCNSPACE app is local-first. It does not request INTERNET permission, upload app lists, usage history or personal data, and has no cloud sync.',
    '虚拟窗口与投屏使用 Android 本地的 virtual display、Presentation 与 MediaProjection API，数据不离开设备。': 'Virtual windows and casting use Android local VirtualDisplay, Presentation and MediaProjection APIs; data does not leave the device.',
    '制作人': 'Producer', '最后更新 / 2026.11': 'Last updated / 2026.11',
  };

  const normalize = (value) => value.trim().replace(/\s+/g, ' ');
  const originalText = new WeakMap();

  function shouldSkip(node) {
    const parent = node.parentElement;
    if (!parent) return true;
    if (parent.closest('svg, script, style, [data-no-i18n], [data-lang-switch], [data-glass-status], [data-glass-fps], [data-glass-dpr], [data-exp-kicker]')) return true;
    return false;
  }

  function apply(lang) {
    const dictionary = lang === 'en' ? EN : ZH;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (shouldSkip(node)) continue;
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      const original = originalText.get(node);
      const key = normalize(original);
      const translation = dictionary[key];
      if (!translation) {
        node.nodeValue = original;
        continue;
      }
      const leading = original.match(/^\s*/)[0];
      const trailing = original.match(/\s*$/)[0];
      node.nodeValue = leading + translation + trailing;
    }

    document.documentElement.dataset.lang = lang;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-lang]').forEach((button) => {
      const active = button.getAttribute('data-lang') === lang;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    try { localStorage.setItem('ncn-lang', lang); } catch (error) { /* private mode */ }
  }

  const urlLang = new URLSearchParams(location.search).get('lang');
  let stored = 'zh';
  try { stored = localStorage.getItem('ncn-lang') || 'zh'; } catch (error) { /* private mode */ }
  const initial = urlLang === 'en' || urlLang === 'zh' ? urlLang : (stored === 'en' ? 'en' : 'zh');

  document.querySelectorAll('[data-lang]').forEach((button) => {
    button.addEventListener('click', () => apply(button.getAttribute('data-lang')));
  });
  apply(initial);
  document.addEventListener('ncn-language', (event) => apply(event.detail === 'en' ? 'en' : 'zh'));
})();

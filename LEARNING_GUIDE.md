# Playwright 学习指南

这份指南将带你系统地学习 Playwright。我们将通过三个真实的示例场景，从基础到进阶，覆盖最常用的功能。

## 1. 核心概念

在使用 Playwright 之前，了解这三个层级很重要：
- **Browser (浏览器)**: 比如 Chromium, Firefox, WebKit 的实力。通常脚本开始时启动一个。
- **Context (上下文)**: 相当于浏览器的“隐身模式”窗口。它是隔离的，互不影响（比如 cookie 不共享）。
- **Page (页面)**: 单个标签页。大多数操作都在这里进行。

## 2. 常用命令速查

在终端运行这些命令（确保你已经安装了依赖）：

```bash
# 运行所有测试
npx playwright test

# 运行特定文件
npx playwright test tests/01_basics.spec.ts

# 带界面运行（这是最直观的调试方式！）
npx playwright test --ui

# 生成代码（录制操作，神器！）
npx playwright codegen example.com
```

## 3. 核心 API 与 常用参数

### 定位元素 (Locators)
Playwright 推荐使用用户可见的语义进行定位，而不是死板的 CSS/XPath。
- `page.getByRole('button', { name: 'Submit' })` (最推荐)
- `page.getByText('Welcome')`
- `page.getByPlaceholder('Enter email')`
- `page.locator('.my-class')` (传统 CSS 选择器)

### 操作 (Actions)
- `await locator.click()`
- `await locator.fill('hello')`
- `await locator.check()`
- `await locator.selectOption('value')`

### 断言 (Assertions)
Playwright 的断言会由自动重试机制，直到条件满足或超时。
- `await expect(locator).toBeVisible()`
- `await expect(locator).toHaveText('Success')`
- `await expect(page).toHaveURL(/dashboard/)`

---

## 4. 实战练习

我已经为你准备了三个循序渐进的脚本，请查看 `tests/` 目录：

### 练习 1: 基础入门 (`tests/01_basics.spec.ts`)
**目标网站**: `https://example.com`
**学习点**:
- 访问页面
- 检查标题
- 简单的元素断言

### 练习 2: 表单与交互 (`tests/02_interaction.spec.ts`)
**目标网站**: `https://demo.playwright.dev/todomvc`
**学习点**:
- 输入文本 (`fill`, `press`)
- 点击 (`click`)
- 获取元素列表 (`count`)
- 过滤元素 (`filter`)

### 练习 3: 模拟真实电商/复杂场景 (`tests/03_advanced_search.spec.ts`)
**目标网站**: `https://www.bing.com` (或者 Google)
**学习点**:
- 处理搜索框
- 等待结果加载
- 获取列表数据 (Scraping)

### 终极技巧：专用自动化浏览器 (最推荐)

这是最专业且用户体验最好的方案。我们为您创建一个专门用于跑脚本的 Chrome 配置（Profile）。您只需要登录一次，以后永久有效。

**第一步：打开专用浏览器登录**
运行以下命令：
```bash
npm run open-profile
```
1. 这是一个完全独立的 Chrome 窗口。
2. 在里面登录 GitHub 或其他任何网站。
3. 登录完成后，**关闭窗口**。
(您的登录信息已自动保存在项目目录下的 `chrome_user_data` 文件夹中)

**第二步：运行脚本**
运行我为您准备的专用脚本：
```bash
npx playwright test tests/06_persistent.spec.ts
```
您会发现，脚本启动的浏览器**自动就是登录状态**！

### 方案三（您要求的）：使用当前打开的 Chrome 用户 + 新建 Tab

如果您希望完全使用当前的主力 Chrome，并且不希望频繁关闭重启。
**唯一要求**：您以后启动 Chrome 时，需要使用我提供的脚本（它只是给 Chrome 加了一个 `--remote-debugging-port` 参数，其他完全一样）。

**Setup (仅需做一次)**:
1. 退出所有 Chrome。
2. 运行：`npm run launch-chrome`
   (这会打开您的 Chrome。以后您就保留着这个窗口正常上网即可)

**Run Code**:
随时运行：
```bash
npm run test-connect
```
*   这会立即在您的 Chrome 里**新建一个标签页**。
*   利用您当前的 Cookies/登录状态执行任务。
*   执行完自动断开，不影响您继续上网。

---
## 常用命令汇总

- **方案一 (专用浏览器)**: `npm run open-profile` -> `npx playwright test tests/06_persistent.spec.ts`
- **方案三 (当前浏览器)**: `npm run launch-chrome` -> `npm run test-connect`

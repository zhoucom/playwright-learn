import { test, expect, chromium } from '@playwright/test';
import path from 'path';

// 注意：持久化上下文不能使用默认的 page fixture，我们需要手动启动 browser context
// 所以这里我们不解构 context 或 page，而是直接在 test 体内创建

// @ts-ignore
test('Persistent Profile: Auto-Login', async () => {
    let context;
    let isConnected = false;

    try {
        // 尝试连接到已存在的浏览器 (由 open_profile.js 启动)
        const browser = await chromium.connectOverCDP('http://localhost:9222');
        context = browser.contexts()[0];
        console.log('SUCCESS: Connected to existing browser session via CDP.');
        isConnected = true;
    } catch (e) {
        console.log('NOTE: Could not connect to existing session (port 9222), launching new persistent context...');

        // 1. 指向同一个用户数据目录
        const userDataDir = path.join(__dirname, '../chrome_user_data');
        console.log(`Loading user profile from: ${userDataDir}`);

        // 2. 启动浏览器 (必须与 open_profile.js 使用相同的参数配置)
        context = await chromium.launchPersistentContext(userDataDir, {
            headless: false,       // 演示时通常开启界面
            channel: 'chrome',     // 确保与手动登录时使用的浏览器一致
        });
    }

    // 3. 获取页面
    const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

    // 4. 判断是否在 GitHub 页面
    const currentUrl = page.url();
    if (currentUrl.includes('github.com')) {
        console.log(`Already on GitHub (${currentUrl}), skipping navigation.`);
    } else {
        console.log(`Current URL is ${currentUrl}, navigating to https://github.com/`);
        await page.goto('https://github.com/');
    }

    // 5. 执行搜索操作
    console.log('Performing search for "playwright"...');

    // GitHub 的搜索栏通常有一个按钮触发，或者直接是输入框
    // 尝试点击搜索按钮 (适配 GitHub 新版 UI)
    const searchButton = page.getByRole('button', { name: 'Search or jump to...' });
    if (await searchButton.isVisible()) {
        await searchButton.click();
    } else {
        // 或者是移动端视图/旧版视图，可能直接有 input
        console.log('Search button not found, trying shortcut "/"...');
        await page.keyboard.press('/');
    }

    // 等待搜索框出现
    // 使用 :visible 伪类确保只选中当前可见的那个输入框
    const searchInput = page.locator('#query-builder-test:visible').or(page.getByRole('combobox', { name: 'Search' }).locator('visible=true')).first();
    await expect(searchInput).toBeVisible();

    await searchInput.fill('playwright');
    await searchInput.press('Enter');

    // 简单验证搜索结果页面
    await expect(page).toHaveURL(/.*q=playwright.*/);
    console.log('Search submit successful.');

    // 6. 结束后处理
    if (!isConnected) {
        // 如果是我们自己启动的，为了演示效果也不关闭
        console.log('Test finished. Context created by test. Keeping it open as per request.');
        // await context.close(); 
    } else {
        console.log('Test finished. Connected to shared session. Keeping it open.');
    }
});

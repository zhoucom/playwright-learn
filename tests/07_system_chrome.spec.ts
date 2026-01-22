import { test, chromium } from '@playwright/test';
import path from 'path';

test('Use System Chrome Profile (Mac Default)', async () => {
    // 1. 指向 Mac 默认的 Chrome 用户数据目录
    // 警告：运行此脚本前，必须完全关闭 Chrome！
    const systemUserDataDir = path.join(process.env.HOME!, 'Library/Application Support/Google/Chrome');

    console.log(`Trying to launch system Chrome from: ${systemUserDataDir}`);
    console.log('NOTE: If this fails, please make sure you have fully QUIT Chrome (Cmd+Q).');

    let context;
    try {
        context = await chromium.launchPersistentContext(systemUserDataDir, {
            headless: false,
            channel: 'chrome',
            args: ['--no-first-run'],
            // 移除 ignoreDefaultArgs，这往往导致 automation 无法控制页面
            // 虽然这会显示 "Chrome is being controlled..."，但这是为了让脚本能工作
            // ignoreDefaultArgs: ['--enable-automation'], 
        });
    } catch (error) {
        if (error.message.includes('Target page, context or browser has been closed') || error.message.includes('SingletonLock')) {
            console.error('\n🔴🔴🔴 ERROR: Chrome is already running! 🔴🔴🔴');
            console.error('To use the System Profile, you MUST Quit Chrome completely (Cmd+Q) first.\n');
        }
        throw error;
    }

    // 2. 获取页面 (智能版)
    // 即使是新建的 context，Chrome 也可能恢复之前的标签页，或者有插件页
    // 我们尝试找到第一个不是插件的常规页面
    let page = context.pages().find(p => !p.url().startsWith('chrome-extension://') && p.url() !== 'about:blank');

    if (!page) {
        page = await context.newPage();
    }

    // 确保页面在前台
    await page.bringToFront();

    // 3. 访问你的目标网站（这里会自动带上你的所有登录信息）
    console.log('Navigating to GitHub...');
    await page.goto('https://github.com');

    // 验证登录
    const signInButton = page.getByRole('link', { name: /Sign in/i });
    try {
        if (await signInButton.isVisible({ timeout: 5000 })) {
            console.log('You are NOT logged in on your system Chrome either?');
        } else {
            console.log('SUCCESS: Using System Chrome login!');
        }
    } catch (e) {
        // 没找到 sign in 也是一种成功
        console.log('SUCCESS: Using System Chrome login! (Sign-in button not found)');
    }

    // 保持浏览器开启以便观察
    await page.waitForTimeout(3000);

    // 演示结束后不需要关闭 Context，否则会强制关闭用户的窗口
    // 在真实自动化中，你可能希望保留或者关闭
    // await context.close(); 
});

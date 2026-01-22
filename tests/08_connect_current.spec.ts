import { test, chromium } from '@playwright/test';

// @ts-ignore
test('Connect to Active Chrome and Open New Tab', async () => {
    // 1. 连接到本地 9222 端口 (需要 Chrome 开启 --remote-debugging-port=9222)
    console.log('Connecting to existing Chrome on port 9222...');

    let browser;
    try {
        browser = await chromium.connectOverCDP('http://localhost:9222');
    } catch (e) {
        console.error('\n❌ 连接失败！请确保您已经运行了 ./scripts/launch_debug_chrome.sh 或者手动开启了 Chrome 调试端口。\n');
        throw e;
    }

    // 2. 获取当前的 Context (你的 Chrome 只有一个 Default context)
    const defaultContext = browser.contexts()[0];

    if (!defaultContext) {
        throw new Error('Default context not found. Is Chrome running?');
    }

    // 3. ⭐️ 关键点：在当前 Chrome 中新建一个标签页
    // 这样既不会干扰你现在看的页面，又能利用你的登录状态
    const page = await defaultContext.newPage();

    // 4. 开始自动化任务
    console.log('Navigating to GitHub in new tab...');
    await page.goto('https://github.com');

    // 验证登录
    // 如果你本来就登录了，这里应该能直接看到 dashboard
    const title = await page.title();
    console.log(`Current Page Title: ${title}`);

    // 5. 保持页面开启
    // 注意：不要 browser.close()，否则会把整个 Chrome 关掉！
    // 仅断开连接
    await browser.close();
    console.log('Script finished. Chrome remains open.');
});

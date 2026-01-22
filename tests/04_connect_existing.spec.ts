import { test, chromium, expect } from '@playwright/test';

// @ts-ignore
test('Connect to existing Chrome instance', async () => {
    // 1. 连接到已经在运行的 Chrome
    // 注意：你必须先通过特定命令启动 Chrome，开启远程调试端口 9222
    // macOS 命令:
    // /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

    const browser = await chromium.connectOverCDP('http://localhost:9222');

    // 2. 获取当前上下文
    // 这里我们使用 defaultContext，它包含了你的登录状态、Cookie 等
    const context = browser.contexts()[0];

    // 3. 在当前浏览器中创建一个新标签页
    const page = await context.newPage();

    // 4. 你的操作
    await page.goto('https://github.com');

    // 打印一下，确认是否获取到了你的登录状态（如果 Github 已登录）
    // 仅作演示，不直接断言，因为取决于你本地状态
    const title = await page.title();
    console.log(`Current page title: ${title}`);

    // 5. 注意：不要用于 browser.close()，否则会关闭你真实的浏览器！
    // 只需要关闭页面
    await page.close();

    // 断开连接
    await browser.close();
});

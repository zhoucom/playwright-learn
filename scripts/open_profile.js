const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

(async () => {
    // 1. 定义用户数据目录 (在项目根目录下创建一个 chrome_user_data 文件夹)
    const userDataDir = path.join(__dirname, '../chrome_user_data');

    // 确保目录存在
    if (!fs.existsSync(userDataDir)) {
        fs.mkdirSync(userDataDir);
    }

    console.log(`正在启动专用浏览器...`);
    console.log(`用户数据目录 (Cookie/登录信息将保存在这里): ${userDataDir}`);
    console.log(`请在这个浏览器窗口中登录您的账号。关闭窗口后，登录信息会被自动保存。`);

    // 2. 启动持久化上下文
    const context = await chromium.launchPersistentContext(userDataDir, {
        headless: false,       // 必须有界面
        channel: 'chrome',     // 使用本机 Chrome（如果没有安装，可以用 'msedge' 或默认 chromium）
        args: [
            '--no-first-run',
            '--remote-debugging-port=9222' // 开启远程调试端口
        ],
    });

    // 3. 打开一个空页面
    const pages = context.pages();
    const page = pages.length > 0 ? pages[0] : await context.newPage();

    await page.goto('https://github.com');

    // 注意：这里我们故意不调用 browser.close()
    // 这样脚本结束后，浏览器依然会保持打开，直到用户手动关闭它
    // 为了防止 Node 进程退出导致浏览器关闭（取决于 launch 实现），我们保持进程挂起
    console.log('Press Ctrl+C to exit and close the browser...');
    await new Promise(() => { }); // 永久等待
})();

import { test, expect } from '@playwright/test';

// 使用 test.use 可以在当前文件中覆盖全局配置
// 这里我们告诉 Playwright 使用刚才保存的 'auth.json'
// 如果文件不存在，脚本会失败，所以我们加一个简单的检查（或者直接运行）

test.use({ storageState: 'auth.json' });

// @ts-ignore
test('Reuse Login State: Access GitHub Profile', async ({ page }) => {
    // 1. 直接访问需要登录的页面
    // 如果 auth.json 生效，我们应该已经是登录状态了
    await page.goto('https://github.com/');

    // 2. 验证登录状态
    // 比如检查页面上是否出现了用户的头像，或者 "Dashboard" 字样
    // 这取决于你登录的网站

    // 这是一个通用的验证：打印当前 URL 看看是不是被重定向到了 /login
    console.log(`Current URL: ${page.url()}`);

    // 尝试寻找用户菜单或头像 (GitHub 左上角或右上角)
    // 注意：未登录时通常会有 "Sign in" 按钮
    const signInButton = page.getByRole('link', { name: /Sign in/i });

    // 如果找不到 "Sign in" 按钮，说明我们很可能已经登录了
    if (await signInButton.isVisible()) {
        console.log('Detected "Sign in" button. You might NOT be logged in.');
    } else {
        console.log('No "Sign in" button found. You are likely logged in!');
    }

    // 你可以在这里继续写你的业务逻辑...
});

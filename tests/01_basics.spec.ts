import { test, expect } from '@playwright/test';

test('Basic: Visit Example Domain', async ({ page }) => {
    // 1. 访问页面
    // goto 是最常用的导航命令
    await page.goto('https://example.com');

    // 2. 检查标题
    // expect 是断言库，toHaveTitle 检查页面标题
    // 使用正则表达式 /Example Domain/ 进行模糊匹配
    await expect(page).toHaveTitle(/Example Domain/);

    // 3. 检查页面元素
    // getByRole 是一种无障碍友好的定位方式，推荐优先使用
    // 这里查找一个 name 为 'More information' 的链接
    const link = page.getByRole('link', { name: 'More information' });

    // 断言该链接可见
    await expect(link).toBeVisible();

    // 4. 执行交互：点击
    await link.click();

    // 5. 验证导航后的 URL
    await expect(page).toHaveURL(/iana.org/);
});

import { test, expect } from '@playwright/test';

test('Advanced: Search and List Results', async ({ page }) => {
    // 1. 访问 Bing
    await page.goto('https://www.bing.com');

    // *注意*: 大型网站通常有 Cookie 弹窗，脚本可能需要处理它。
    // 简单的做法是忽略或尝试点击接受（这里为了演示简单，假设无弹窗或直接操作）

    // 2. 使用 CSS Selector 定位搜索框
    // Bing 的搜索框 ID 很久以来都是 'sb_form_q'
    const searchBox = page.locator('#sb_form_q');

    // 3. 搜索内容
    await searchBox.fill('Playwright automation');
    await searchBox.press('Enter');

    // 4. 等待结果
    // 这种等待通常是隐式的（通过 expect），但有时我们需要等待特定元素出现
    // .b_algo 是 Bing 搜索结果项的通用类名
    const firstResult = page.locator('.b_algo').first();

    await expect(firstResult).toBeVisible();

    // 5. 获取并打印文本 (Scraping 场景)
    // textContent() 获取纯文本
    const title = await firstResult.locator('h2').textContent();
    console.log('First result title:', title);

    // 验证结果中包含我们搜索的关键词
    await expect(firstResult).toContainText('Playwright');
});

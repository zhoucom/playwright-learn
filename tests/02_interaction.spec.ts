import { test, expect } from '@playwright/test';

test('Interaction: Todo List Manager', async ({ page }) => {
    // 1. 访问 TodoMVC 示例应用
    await page.goto('https://demo.playwright.dev/todomvc');

    // 定位输入框：使用 placeholder 属性定位
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // 2. 输入内容并回车
    // fill: 填充文本
    // press: 模拟键盘按键
    await newTodo.fill('购买牛奶');
    await newTodo.press('Enter');

    await newTodo.fill('遛狗');
    await newTodo.press('Enter');

    // 3. 验证列表项
    // getByTestId 是 Playwright 推荐的测试专用 ID，但在该 demo 网站中可能没有配置
    // 这里我们使用 getByRole('listitem') 或者是结合文本过滤

    // 检查是否有 2 个待办事项
    // locator 可以找到多个元素，count() 返回数量
    await expect(page.locator('.view label')).toHaveCount(2);

    // 4. 完成一个任务
    // 找到包含文本 '购买牛奶' 的列表项，然后在其内部找到 checkbox 并点击
    // filter: 用于从多个结果中筛选
    await page.locator('li')
        .filter({ hasText: '购买牛奶' })
        .getByRole('checkbox')
        .check();

    // 5. 验证状态
    // 检查该任务是否有 completed 类名
    await expect(page.locator('li').filter({ hasText: '购买牛奶' }))
        .toHaveClass(/completed/);
});

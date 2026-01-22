#!/bin/bash

# 定义 Chrome 路径
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

echo "正在尝试关闭现有的 Chrome..."
pkill -f "Google Chrome"

echo "正在以调试模式启动 Chrome (端口 9222)..."
echo "请保持此窗口运行，不要关闭。"

"$CHROME_PATH" --remote-debugging-port=9222 --no-first-run

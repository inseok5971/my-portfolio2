#!/bin/bash
cd "$(dirname "$0")"
echo "🏠 [내 집 마련 시뮬레이션 게임]을 웹 브라우저에서 실행합니다..."
open -a "Google Chrome" index.html 2>/dev/null || open index.html
osascript -e 'tell application "Google Chrome" to activate' 2>/dev/null || true

#!/usr/bin/env bash
#
# install-hooks.sh — 把版控的 git hooks 安裝到 .git/hooks
#
# .git/hooks 不隨 git 版控，所以在 install 階段自動裝：
#   - 前端：package.json 的 "prepare"（yarn/npm install 後自動跑）
#   - 後端：composer.json 的 post-autoload-dump（composer install 後自動跑）
#
# 非 git 環境（例如 CI checkout 後、或還沒 git init）會安靜跳過。

set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(git -C "$HERE" rev-parse --show-toplevel 2>/dev/null || true)"
[ -n "$ROOT" ] || exit 0
HOOK_DIR="$ROOT/.git/hooks"
[ -d "$HOOK_DIR" ] || exit 0

cp "$HERE/hooks/pre-push" "$HOOK_DIR/pre-push"
chmod +x "$HOOK_DIR/pre-push"
echo "✅ git pre-push hook 已安裝（字型授權檢查）"

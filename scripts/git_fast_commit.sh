#!/bin/bash
echo "這腳本是為了快速 push, 加速開發使用而已"
cd "../" || exit

# 檢查是否有輸入參數，如果有就使用參數作為 commit 訊息，否則使用預設的 "Update"
if [ $# -eq 0 ]; then
    commit_message="Update"
else
    commit_message="$1"
fi

git add -A
git commit -m "$commit_message"

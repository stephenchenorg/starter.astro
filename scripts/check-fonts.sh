#!/usr/bin/env bash
#
# check-fonts.sh — 掃描專案是否使用「商業付費字型」
#
# 用法:
#   bash check-fonts.sh [目標目錄]      # 預設當前目錄
#
# 結束碼:
#   0 = 乾淨（沒發現付費字型）
#   1 = 發現疑似付費字型（CI 會據此擋下；pre-push hook 只警告不擋）
#
# 豁免: 若某行的付費字型名是「刻意保留且已緩解」（例如同名 @font-face override
#       指向 self-host 免費字型），在該行加註解標記  font-license-ok  即會被略過。
#
# 這是 check-font-license skill 的可執行版；CI / pre-push hook / 手動檢查共用同一支。

set -uo pipefail

ROOT="${1:-.}"
EXCLUDE='--exclude-dir=node_modules --exclude-dir=vendor --exclude-dir=.git --exclude-dir=dist --exclude-dir=.output --exclude-dir=.nuxt --exclude-dir=.astro --exclude-dir=storage'

# 掃描目錄（存在才掃，涵蓋 Astro/Nuxt/Vue/Laravel）
DIRS=()
for d in src public assets resources components app layouts styles pages; do
  [ -d "$ROOT/$d" ] && DIRS+=("$ROOT/$d")
done
[ ${#DIRS[@]} -eq 0 ] && DIRS=("$ROOT")

# 商業付費字型 / 付費 icon font 名稱
PAID_NAMES='RM Mono|RMMono|PP Neue Montreal|PPNeueMontreal|Gotham|GothamHTF|Circular Std|Circular XX|Gilroy|Proxima Nova|Graphik|Söhne|Suisse Int|Neue Haas|Founders Grotesk|Maison Neue|GT Walsheim|GT America|GT Sectra|TT Norms|Aeonik|Reckless|Monument Extended|LineIcons ?Pro|Font ?Awesome ?Pro|fontawesome-pro'

found=0

section() { printf '\n\033[1m%s\033[0m\n' "$1"; }
filter_ok() { grep -viE 'font-license-ok'; }   # 濾掉刻意豁免的行

echo "🔎 字型授權檢查：$ROOT"

# ── 1) Webflow CDN 字型檔 hotlink（高信度：直接抓付費字型檔）────────────
hits=$(grep -rniE "website-files\.com[^\"' ]*\.(woff2?|otf|ttf|eot)" $EXCLUDE "${DIRS[@]}" 2>/dev/null | filter_ok)
if [ -n "$hits" ]; then
  section "🔴 Webflow CDN 付費字型檔 hotlink"; echo "$hits"; found=1
fi

# ── 2) 付費字型平台（Adobe Fonts/Typekit、MyFonts、Fonts.com、Hoefler）──
hits=$(grep -rniE "use\.typekit\.net|myfonts\.com|fonts\.com|cloud\.typography" $EXCLUDE "${DIRS[@]}" 2>/dev/null | filter_ok)
if [ -n "$hits" ]; then
  section "🔴 付費字型平台載入"; echo "$hits"; found=1
fi

# ── 3) 付費字型名，但只在字型語境（@font-face / font-family / src url 字型檔）─
font_ctx=$(grep -rniE "@font-face|font-family|\.(woff2?|otf|ttf|eot)" $EXCLUDE "${DIRS[@]}" 2>/dev/null)
hits=$(echo "$font_ctx" | grep -iE "$PAID_NAMES" | filter_ok)
if [ -n "$hits" ]; then
  section "🔴 疑似付費字型名（請人工複查 context）"; echo "$hits"; found=1
fi

# ── 4) self-host 付費字型檔（檔名帶字型名）──────────────────────────────
hits=$(find "${DIRS[@]}" -type f \( -iname '*.woff' -o -iname '*.woff2' -o -iname '*.otf' -o -iname '*.ttf' -o -iname '*.eot' \) 2>/dev/null \
        | grep -iE "$PAID_NAMES")
if [ -n "$hits" ]; then
  section "🔴 self-host 付費字型檔"; echo "$hits"; found=1
fi

echo ""
if [ "$found" -eq 1 ]; then
  echo "❌ 發現疑似商業付費字型。請確認授權，或改用免費替代（無襯線→Inter、等寬→JetBrains Mono、icon→Font Awesome Free）。"
  echo "   刻意保留且已緩解的行，可在該行加註解  font-license-ok  豁免。"
  exit 1
fi
echo "✅ 未發現商業付費字型。"
exit 0

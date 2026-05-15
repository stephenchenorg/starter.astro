# 設計參考

因為每個專案設計文件不一樣，所以額外放在：[README_DESIGN.md](README_DESIGN.md)

# Astro 前端

> Start a new project: `npx degit stephenchenorg/stater.astro --mode=git <my-project>`

- 正式網址:
- 測試網址:

## 安裝(初始化)

『如果沒安裝 yarn 』專案依賴 Node.js 22.x 版本和 Yarn 1.22.22 版本，如果沒有的話使用以下指令安裝 Yarn：

```bash
npm install -g yarn
```

複製 `.env.example` 為 `.env` 並設定環境變數：

```bash
cp .env.example .env
```


安裝依賴：

```bash
yarn
yarn dev
```

需要設定 `SECRET_KEY_BASE` 環境變數，是 Astro Cookie Session 要使用的加密金鑰，可以使用以下指令生成：

```bash
openssl rand -hex 64
```

## 本地模擬環境

模擬 Staging 環境指令：

```bash
yarn dev --mode staging
```

模擬 Production 環境指令：

```bash
yarn dev --mode production
```

## 程式碼檢查（Linting）

```bash
yarn lint
```

自動修正程式碼檢查問題：

```bash
yarn lint --fix
```

## 部署

Staging 環境編譯指令：

```bash
yarn build --mode staging
```

Production 環境編譯指令：

```bash
yarn build --mode production
```

## SEO 與爬蟲控制

### 環境判斷邏輯

本專案使用 `import.meta.env.MODE` 判斷環境，而非 `import.meta.env.DEV`：

| 指令 | MODE | DEV | 說明 |
|------|------|-----|------|
| `yarn dev` | development | true | 本地開發 |
| `yarn build --mode staging` | staging | false | 測試環境部署 |
| `yarn build --mode production` | production | false | 正式環境部署 |

**重要**：`DEV` 只在 `yarn dev` 時為 `true`，部署後永遠是 `false`。因此使用 `MODE === 'production'` 來判斷是否為正式環境。

### 非 Production 環境保護

當 `MODE !== 'production'` 時（包含本地開發、staging 等），自動啟用以下保護：

| 保護機制 | 說明 |
|---------|------|
| **robots.txt** | 回傳 `Disallow: /` 阻擋爬蟲爬取 |
| **noindex meta tag** | `<meta name="robots" content="noindex, nofollow">` |
| **SEO/OG tags 不輸出** | 不輸出 canonical、description、OG 標籤 |
| **Analytics 不載入** | GA4、GTM、LINE Tag、Clarity、FB Pixel 都不載入 |

### 維護頁面（Coming Soon）

`public/coming-soon.html` 是獨立的靜態維護頁面，可搭配 Nginx 在網站上線前使用。

#### Nginx 設定範例

```nginx
server {
    server_name example.com;
    root /var/www/project/public;

    # Google Search Console 驗證檔案（如有需要）
    location = /googleXXXXXXXXXX.html {
        try_files $uri =404;
    }

    # robots.txt 阻擋爬蟲
    location = /robots.txt {
        add_header Content-Type text/plain;
        return 200 "User-agent: *\nDisallow: /\n";
    }

    # 所有請求導向維護頁面
    location / {
        try_files /coming-soon.html =404;
    }

    # SSL 設定...
}
```

#### 正式上線切換

正式上線時，將 Nginx 設定改回 proxy 到 Astro：

```nginx
location / {
    proxy_pass http://localhost:4321;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

### 移除 Google 已索引內容

如果網站已被 Google 索引，需手動請求移除：

1. 前往 [Google Search Console](https://search.google.com/search-console)
2. 驗證網站所有權（可使用 HTML 檔案驗證，放置於 `public/` 目錄）
3. 左側選單 → **移除**
4. 點擊 **新要求** → 輸入要移除的網址
5. 等待 24-48 小時處理

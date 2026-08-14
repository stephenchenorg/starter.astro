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

## API 網域設定（內外網分流）

前端呼叫後端 API 時，會依照「是誰在發出請求」自動決定要走公開網域還是內網，不用手動切換。新加入的人只要搞懂兩個環境變數的差異就好：

| 環境變數 | 誰會用到 | 規則 |
|---------|---------|------|
| `PUBLIC_API_BASE_URL` | 客人的瀏覽器 ＋ 伺服器（SSR，沒填內網值時的備用） | **必填**，一定要是客人連得到的公開網址 |
| `API_BASE_URL` | 只有 Astro 伺服器自己（SSR）用得到，瀏覽器完全看不到、也讀不到 | **選填**，只有「Astro 伺服器」和「Laravel 伺服器」放在同一個內網（同機房/VPC）才需要填 |

### 為什麼要分兩個網址？

Astro 網站是 SSR（伺服器端渲染）——使用者打開網址時，是 **Astro 伺服器自己先去跟 Laravel 要資料**，組好整頁 HTML 才送到瀏覽器。這段「伺服器對伺服器」的請求，如果兩台機器放在同一個內網，走內網 IP 會比繞出去公開網路再繞回來快，也不用經過 CDN、防火牆這些關卡。

但客人自己的瀏覽器（結帳、登入這類需要直接跟後端互動的功能）不在公司內網裡，**一定只能走 `PUBLIC_API_BASE_URL`**，如果誤填內網位址，客人會直接連不到，功能整個壞掉。

程式碼（`src/api/index.ts`）會自動判斷「現在是伺服器在跑、還是瀏覽器在跑」，開發時不需要每個功能都手動選——唯一要注意的是**不要把 `apiFetch()` 拉進 Vue 元件裡給瀏覽器直接呼叫**，詳見 `CLAUDE.md` 的說明。

### 怎麼填

**本機開發**：`API_BASE_URL` 留空即可。本機不在正式環境的內網裡，填了也連不到，程式會自動退回使用 `PUBLIC_API_BASE_URL`，行為跟沒有這個機制之前一樣。

**正式環境**：先跟管理伺服器/內網的人確認兩件事，再填：
1. Astro 伺服器和 Laravel 伺服器是不是真的部署在同一個內網？（不是的話 `API_BASE_URL` 留空就好，不用勉強填一個連不到的值）
2. 內網位址跟 port 各是多少？

```bash
# .env 範例
PUBLIC_API_BASE_URL="https://admin.example.com"   # 必填，公開網域
API_BASE_URL="http://10.0.0.2:8002"                # 選填，內網位址，實際 IP/port 要問清楚，不要用猜的
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

### robots.txt 是什麼？

給搜尋引擎爬蟲看的「告示牌」，告訴它們哪些頁面可以爬、哪些不行。當 Google/Bing 爬蟲要爬網站時，**第一件事**就是先看 `/robots.txt`。

#### 語法說明

```txt
User-agent: *        # 適用於所有爬蟲
Allow: /             # 允許爬取整個網站
Disallow: /admin/    # 禁止爬取 /admin/ 路徑
Sitemap: URL         # 告訴爬蟲 sitemap 位置
```

#### 範例

```txt
# 禁止所有爬蟲
User-agent: *
Disallow: /

# 允許爬取，但排除特定路徑
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
```

#### 重要觀念

| 特性 | 說明 |
|------|------|
| **君子協定** | 爬蟲「應該」遵守，但不是強制的 |
| **正規爬蟲會遵守** | Google、Bing、Facebook 等都會遵守 |
| **惡意爬蟲可能無視** | 所以需要多層保護（robots.txt + noindex） |
| **不是密碼保護** | 只是「請不要進來」的告示，不是真的鎖門 |

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

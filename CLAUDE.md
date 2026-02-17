# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Setup and Installation
- **Install dependencies**: `yarn` (requires Node.js 22.x and Yarn 1.22.22)
- **Environment setup**: Copy `.env.example` to `.env` and set `SECRET_KEY_BASE` using `openssl rand -hex 64`

### Development Server
- **Development**: `yarn dev` or `npm run dev`
- **Staging mode**: `yarn dev --mode staging`
- **Production mode**: `yarn dev --mode production`

### Build and Preview
- **Build**: `yarn build` or `npm run build` (includes Astro type checking)
- **Staging build**: `yarn build --mode staging`
- **Production build**: `yarn build --mode production`
- **Preview**: `yarn preview` or `npm run preview`

### Code Quality
- **Lint**: `yarn lint` or `npm run lint`
- **Lint with auto-fix**: `yarn lint --fix`

### Storybook
- **Development**: `yarn storybook` or `npm run storybook` (runs on port 6006)
- **Build**: `yarn build-storybook` or `npm run build-storybook`

## Architecture Overview

### Tech Stack
- **Framework**: Astro 5.x with Vue 3 integration and server-side rendering
- **Adapter**: Node.js (`@astrojs/node`, standalone mode)
- **Styling**: TailwindCSS 4.x
- **Icons**: Unplugin Icons with Vue 3 compiler (Heroicons + Tabler)
- **Session Management**: Astro Cookie Session with custom middleware
- **API Client**: ofetch for GraphQL API calls
- **Development Tools**: Storybook for component development, ESLint for code quality

### Project Structure
- **Pages**: `/src/pages/` — Astro pages and API routes
- **Components**: `/src/components/` — Reusable Vue/Astro components, UI components in `/src/components/ui/`
- **Layouts**: `/src/layouts/` — Astro layout components with partials in `/layouts/partials/`
- **Middleware**: `/src/middleware/` — Request processing pipeline (origin check, guest handling, auth)
- **API**: `/src/api/` — GraphQL API fetch functions
- **Types**: `/src/types/` — TypeScript type definitions (alert, api, user types)
- **Utils**: `/src/utils/` — Utility functions (cn, formatDate, formatNumber, dayjs, log)
- **Styles**: `/src/styles/` — Global CSS and theme configuration
- **Sessions**: `/src/sessions.ts` — Cookie session management (JWT token storage)
- **Site Config**: `/src/site.config.ts` — Site name, description, API URL, analytics IDs

### Middleware Pipeline
The middleware runs in sequence: `originCheck` → `guest` → `auth`. Custom origin checking is implemented instead of Astro's built-in security feature.

### Key Configuration
- **Path aliases**: `@/*` maps to `./src/*`
- **TypeScript**: Strict configuration with Vue 3 JSX support
- **Build format**: File-based output with trailing slash handling disabled
- **Environment variables**: Configured through `src/site.config.ts` with API base URL and analytics tracking

---

## Backend Integration

This frontend communicates with a Laravel backend via **GraphQL API**.

### API 通訊方式
- **Endpoint**: `/graphql` (POST)
- **Client**: `src/api/index.ts` 的 `apiFetch()` (基於 ofetch)
- **Auth**: JWT token 存在 Cookie Session，自動附帶 `Authorization: Bearer {token}`
- **Headers**: 自動附帶 `Content-Language: zh_TW` + `Time-Zone: Asia/Taipei`

### 新增 API 函式
在 `src/api/{模組}.ts` 中封裝 GraphQL query/mutation：

```typescript
import { apiFetch } from '@/api'

export async function fetchXxxs(page = 1) {
  const query = `
    query ($page: Int) {
      xxxs(page: $page, per_page: 15) {
        data { id translation { name } }
        paginatorInfo { total current_page last_page }
      }
    }
  `
  const res = await apiFetch('/graphql', {
    method: 'POST',
    body: { query, variables: { page } },
  })
  return res.data.xxxs
}
```

### 新增型別定義
在 `src/types/{模組}.ts` 中定義，對應後端 GraphQL Type。

---

## SEO 規範 (重要)

本專案以 SEO 為優先考量，所有開發必須遵守以下規則：

### Vue 元件 Hydration 策略

**預設使用 `client:idle`，不要用 `client:load`。**

| 優先順序 | 指令 | 使用時機 |
|---------|------|---------|
| 1 (最佳) | 不使用 (純 Astro 元件) | 不需要互動的內容，零 JS |
| 2 (預設) | `client:idle` | **一般互動元件，這是預設選項** |
| 3 | `client:visible` | 頁面下方、滾動到才需要的元件 |
| 4 | `client:load` | 僅限需要立即互動的元件（表單驗證、即時搜尋） |
| 5 (最差) | `client:only="vue"` | 僅限純客戶端才能運作的元件 |

**原則：能不用 Vue 就不用（直接寫 Astro 元件），必須用 Vue 時預設 `client:idle`。**

### 頁面 SEO 必備項目
- 每個頁面都要有唯一的 `<title>` 和 `<meta name="description">`
- 每個頁面都要設定 canonical URL
- 使用 BaseLayout 的 OG tags 和 JSON-LD 結構化資料
- 所有圖片必須有 `alt`、`width`、`height` 屬性

---

## 新增功能模組 SOP

每次新增一個功能模組（例如「作品集」），依以下順序：

### Step 1: 定義 TypeScript Types
```
src/types/portfolio.ts
```

### Step 2: 封裝 API 函式
```
src/api/portfolio.ts  →  fetchPortfolios(), fetchPortfolio(id)
```

### Step 3: 建立頁面
```
src/pages/portfolio/index.astro   →  列表頁
src/pages/portfolio/[id].astro    →  詳情頁
```

### Step 4: 建立元件 (如需要)
```
src/components/PortfolioCard.vue  →  使用 client:idle
```

### Step 5: 調整導航
```
src/layouts/partials/Header.astro  →  加入選單項目
```

---

## 內建工具函式

| 函式 | 路徑 | 用途 |
|------|------|------|
| `cn()` | `src/utils/className.ts` | 合併 class name (clsx + tailwind-merge) |
| `formatDate()` | `src/utils/formatDate.ts` | 格式化日期為 YYYY/MM/DD |
| `formatNumber()` | `src/utils/formatNumber.ts` | 數字格式化 (含萬/億人性化) |
| `dayjs` | `src/utils/dayjs.ts` | 預設 zh-tw locale + relativeTime |
| `log()` | `src/utils/log.ts` | 開發環境 console.log |

## 從 Upstream 同步更新

```bash
git remote add upstream git@github.com:stephenchenorg/starter.astro.git
git fetch upstream
git merge upstream/main --allow-unrelated-histories --strategy=recursive
```

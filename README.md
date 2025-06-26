# Astro Starter

> Start a new project: `npx degit stephenchenorg/stater.astro --mode=git my-project`

# Dentalk 前端

- 正式網址:
- 測試網址:

## Installation

```bash
yarn
yarn dev
```

Copy `.env.example` to `.env` and set your environment variables:

```bash
cp .env.example .env
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


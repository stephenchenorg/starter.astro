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

# nippo

## ワークフロー

- ユーザーから作業の訂正があった場合、claude.mdに注意事項として追記すること
- ユーザーは基本的にclaudeより知識が無いので、ユーザーの知識に間違いがある場合は訂正・確認すること
- ユーザーとclaudeの役割はそれぞれ
  - ユーザー: 企画、実装、相談
  - claude: アドバイス、指摘

## プロジェクト概要

日報アプリのAPIサーバーと画面を実装する

## 機能

- 日報の作成・更新等のCRUD
- ログイン機能
- TODO...

## 技術スタック

- **Runtime**: Node.js
- **Framework**: Hono
- **ORM**: Drizzle ORM
- **DB**: sqlite
- **Validation**: Zod
- **Language**: TypeScript

## ディレクトリ構成

```
nippo/
├── frontend/
└── backend/
```

frontend: 画面、UI実装(react)
backend: APIサーバー実装(hono, sqlite)

## 開発ルール

- スキーマ変更は必ずマイグレーションを通す
- バリデーションはZodで行う
- 環境変数は.envで管理する（.env.exampleを参照）

## package.json

```
nippo/
├── frontend/
│   └── package.json
├── backend/
│   └── package.json
└── package.json
```

- `nippo/package.json`: 共通パッケージ(ex. typescript, hono, vitest)
- `nippo/frontend/package.json`: フロントエンド限定(ex. react, tanstack)
- `nippo/backend/package.json`: バックエンド限定(ex. drizzle, better-sqlite-3)

パッケージ追加も上記ルールに沿って、使用範囲ごとにインストール先を判断する

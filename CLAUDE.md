# nippo

## ワークフロー

- ユーザーから作業の訂正があった場合、claude.mdに注意事項として追記すること
- ユーザーは基本的にclaudeより知識が無いので、ユーザーの知識に間違いがある場合は訂正・確認すること

## プロジェクト概要

日報アプリのAPIサーバー

## 技術スタック

- **Runtime**: Node.js
- **Framework**: Hono
- **ORM**: Drizzle ORM
- **DB**: PostgreSQL
- **Validation**: Zod
- **Language**: TypeScript

## ディレクトリ構成

todo

## 開発ルール

- スキーマ変更は必ずマイグレーションを通す
- バリデーションはZodで行う
- 環境変数は.envで管理する（.env.exampleを参照）

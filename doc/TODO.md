# TODO

日報に関するCRUDを実装する

## 日報のデータ構造

エンティティ

```ts
class Nippo {
  id: number
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
```

スキーマ(Drizzle ORM)

```ts
const nippos = pgTable('nippos', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})
```

## アーキテクチャ

- Domain: class Nippoを置く
- Schema: Drizzle ORMのスキーマを置く
- Repository: DomainとSchemaの整合をとる
- Presentation: route, zod schemaを置く

コールチェーン

```
httpリクエスト --> ルーティング(Presentation)
	ルーティング --> zodバリデーション(Presentation)
		zodバリデーション --> Repository問い合わせ
			Repository問い合わせ --> dbクエリ投げる
				dbクエリ投げる --> RepositoryでDomainに変換
					RepositoryでDomainに変換 --> ルーティング(Presentation)
						ルーティング --> httpレスポンス
```

## フォルダ構成

```
src/
  nippo/
    domain/
	  Nippo.ts
	schema/
	  nippos.ts
	repository/
	  NippoRepository.ts
	presentation/
	  route.ts
	  schema.ts  # zod schema
```

## 日報の投稿機能

メソッド: `POST`

- 単一日報投稿

```
/nippo
```

ボディ

```json
{
  "title": "日報タイトル",
  "content": "日報内容"
}
```

- 複数日報投稿

```
/nippo/bulk
```

ボディ

```json
[
  {
    "title": "日報タイトル1",
    "content": "日報内容1"
  },
  {
    "title": "日報タイトル2",
    "content": "日報内容2"
  }
]
```

## 日報の編集機能作成

メソッド: `PUT`

- 単一日報編集

```
/nippo/{id}
```

ボディ

```json
{
  "title": "日報タイトル",
  "content": "日報内容"
}
```

## 日報の削除機能作成

メソッド: `DELETE`

- 日報削除

/nippo/{id}

- 複数削除

/nippo/bulk

ボディ

```json
{
  "ids": [1, 2, 3]
}
```

## 日報の一覧表示機能作成

メソッド: `GET`

- 日報一覧表示

```
/nippo
```

- 日報詳細表示

```
/nippo/{id}
```

## 削除した日報の復元機能作成

メソッド: `POST`

- 日報復元

```
/nippo/{id}/restore
```

- 複数復元

```
/nippo/bulk/restore
```

ボディ

```json
{
  "ids": [1, 2, 3]
}
```

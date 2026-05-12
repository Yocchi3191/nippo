import { useState } from 'react'

type Props = {
  onSubmit: () => void
}

export function NippoForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('') // 知らん概念
  const [content, setContent] = useState('') //

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/nippo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    })
    onSubmit() // 投稿後にデータを再取得
  } // fetchというが、要するにPOSTメソッドをcurlしてる

  return (
    <>
      <h2>にっぽーを投稿する</h2>
      <form onSubmit={handleSubmit}>
        <p>タイトル</p>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <p>内容</p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <p>
          <button type="submit">投稿</button>
        </p>
      </form>
    </>
  )
}

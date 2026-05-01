import { useState } from 'react'
import type { Nippo } from '../App'

type Props = {
  nippo: Nippo
  onRefresh: () => void
}

export function NippoItem({ nippo, onRefresh }: Props) {
  const [title, setTitle] = useState(nippo.title)
  const [content, setContent] = useState(nippo.content)

  const handleDelete = async (id: number) => {
    await fetch(`/nippo/${id}`, {
      method: 'DELETE',
    })
    onRefresh()
  }

  const handleUpdate = async (id: number, title: string, content: string) => {
    await fetch(`/nippo/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    })
    onRefresh()
  }

  return (
    <li>
      <p>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </p>
      <p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </p>
      <button onClick={() => handleUpdate(nippo.id, title, content)}>
        更新
      </button>
      <button onClick={() => handleDelete(nippo.id)}>削除</button>
    </li>
  )
}

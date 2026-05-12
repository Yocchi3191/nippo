import { useEffect, useState } from 'react'
import './App.css'
import { NippoItem } from './nippo/NippoItem'
import { NippoForm } from './nippo/NippoForm'
import { hc } from 'hono/client'
import type { AppType } from '../../backend/src/app'

export const client = hc<AppType>('http://localhost:3000')

export type Nippo = {
  id: number
  title: string
  content: string
  createdAt: string
}

function App() {
  const [nippos, setNippos] = useState<Nippo[]>([])

  const fetchNippos = async () => {
    const res = await client.nippo.$get()
    const data = await res.json()
    setNippos(data)
  } // 日報データをすべて取ってきてstateにセット

  useEffect(() => {
    fetchNippos()
  }, []) // 画面更新時1回だけ日報データをfetch

  return (
    <>
      <h1>にっぽー！</h1>
      <NippoForm onSubmit={fetchNippos} />
      <h2>にっぽー一覧</h2>
      {nippos.map((nippo) => (
        <NippoItem key={nippo.id} nippo={nippo} onRefresh={fetchNippos} />
      ))}
    </>
  )
}

export default App

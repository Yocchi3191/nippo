import React, { useEffect, useState } from 'react'
import './App.css'
import { NippoItem } from './nippo/NippoItem'
import { NippoForm } from './nippo/NippoForm'

export type Nippo = {
  id: number
  title: string
  content: string
  createdAt: string
}

function App() {
  const [nippos, setNippos] = useState<Nippo[]>([]) // 知らないなにこれ

  const fetchNippos = () => {
    fetch('/nippo')
      .then((res) => res.json())
      .then((data) => setNippos(data))
  } // 日報データをすべて取ってきてstateにセット

  useEffect(() => {
    fetchNippos()
  }, []) // 画面更新時1回だけ日報データをfetch

  

  return (
    <>
      <div>
        <h1>にっぽー一覧</h1>
        <ul>
          {nippos.map((nippo) => (
            <NippoItem key={nippo.id} nippo={nippo} onRefresh={fetchNippos} />
          ))}
        </ul>
      </div>

      <NippoForm onSubmit={fetchNippos} />
    </>
  )
}

export default App

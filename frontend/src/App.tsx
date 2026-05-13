import { useEffect, useState } from 'react'
import './App.css'
import { NippoItem } from './components/NippoItem'
import { NippoForm } from './components/NippoForm'
import { client } from './client'
import type { Nippo } from './schema/Nippo'

function App() {
  const [nippos, setNippos] = useState<Nippo[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  const fetchNippos = () => setRefreshKey((k) => k + 1)

  useEffect(() => {
    client.nippo
      .$get()
      .then((res) => res.json())
      .then((data) => setNippos(data))
  }, [refreshKey])

  return (
    <>
      <h1>にっぽー！</h1>
      <NippoForm onSubmit={fetchNippos} />
      <h2>にっぽー一覧</h2>
      {nippos.map((nippo) => (
        <NippoItem key={nippo.id} nippo={nippo} />
      ))}
    </>
  )
}

export default App

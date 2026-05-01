import { useEffect, useState } from 'react'
import './App.css'

type Nippo = {
  id: number
  title: string
  content: string
  createdAt: string
}

function App() {
  const [nippos, setNippos] = useState<Nippo[]>([])
  useEffect(() => {
    fetch('/nippo')
      .then((res) => res.json())
      .then((data) => setNippos(data))
  }, [])

  return (
    <div>
      <h1>にっぽー一覧</h1>
      <ul>
        {nippos.map((nippo) => (
          <li key={nippo.id}>
            <h2>{nippo.title}</h2>
            <p>{nippo.content}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App

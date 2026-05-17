import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { NippoDetail } from './pages/NippoDetail'
import { NippoPage } from './pages/NippoPage'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Navigate to="/nippo" replace />} />
      <Route path="/nippo" element={<NippoPage />} />
      <Route path="/nippo/:id" element={<NippoDetail />} />
    </Routes>
  )
}

export default App

import type { ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { NippoDetail } from './pages/NippoDetail'
import { NippoPage } from './pages/NippoPage'
import { LoginPage } from './auth/loginPage'

const STORAGE_KEY = 'nippo_auth'

function ProtectedRoute({ element }: { element: ReactElement }) {
  if (localStorage.getItem(STORAGE_KEY) === null) {
    return <Navigate to="/login" replace />
  }
  return element
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          localStorage.getItem(STORAGE_KEY) === null ? (
            <Navigate to="/login" replace />
          ) : (
            <Navigate to="/nippo" replace />
          )
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/nippo" element={<ProtectedRoute element={<NippoPage />} />} />
      <Route path="/nippo/:id" element={<ProtectedRoute element={<NippoDetail />} />} />
    </Routes>
  )
}

export default App

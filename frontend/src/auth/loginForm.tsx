import { useState, type FormEvent } from 'react'
import type { credentials } from './credentials'

export function LoginForm({
  onLogin,
}: {
  onLogin: (credentials: credentials) => boolean
}) {
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const success = onLogin({
      email: data.get('email') as string,
      password: data.get('password') as string,
    })
    if (!success) {
      setError('ログインに失敗しました')
    }
  }

  return (
    <>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="email@example.com"
          ></input>
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="password"
          ></input>
        </div>
        <button type="submit" name="login">
          ログイン
        </button>
      </form>
    </>
  )
}

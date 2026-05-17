import type { FormEvent } from 'react'

export function LoginPage({ onLogin }) {
  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    onLogin({
      email: data.get('email') as string,
      password: data.get('password') as string,
    })
  }

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">メールアドレス</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="email@example.com"
        ></input>
        <label htmlFor="password">パスワード</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="password"
        ></input>
        <button type="submit">ログイン</button>
      </form>
    </>
  )
}

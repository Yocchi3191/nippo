import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { LoginForm } from './loginForm'

it('メールとパスワードを入力して送信するとonLoginが呼ばれる', async () => {
  const onLogin = vi.fn()
  render(<LoginForm onLogin={onLogin} />)

  await userEvent.type(
    screen.getByLabelText('メールアドレス'),
    'test@example.com',
  )
  await userEvent.type(screen.getByLabelText('パスワード'), 'password123')
  await userEvent.click(screen.getByRole('button', { name: 'login' }))

  expect(onLogin).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  })
})

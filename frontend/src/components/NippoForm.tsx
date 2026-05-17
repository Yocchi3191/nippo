import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from '../client'

export function NippoForm() {
  const queryClient = useQueryClient()
  const { mutateAsync } = useMutation({
    mutationFn: (data: { title: string; content: string }) => client.nippo.$post({ json: data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['nippos'] }),
  })
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const input = {
      title: data.get('title') as string,
      content: data.get('content') as string,
    }
    await mutateAsync(input)
    form.reset()
  }

  return (
    <>
      <h2>にっぽーを投稿する</h2>
      <form onSubmit={handleSubmit}>
        <p>タイトル</p>
        <input name="title" />
        <p>内容</p>
        <textarea name="content" />
        <p>
          <button type="submit">投稿</button>
        </p>
      </form>
    </>
  )
}

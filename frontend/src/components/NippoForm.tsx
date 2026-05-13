import { client } from '../client'

type NippoFormProps = {
  onSubmit: () => void
}

export function NippoForm({ onSubmit }: NippoFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    await client.nippo.$post({
      json: {
        title: data.get('title') as string,
        content: data.get('content') as string,
      },
    })
    form.reset()
    onSubmit()
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

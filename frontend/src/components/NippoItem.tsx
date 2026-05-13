import type { Nippo } from '../schema/Nippo'

type NippoItemProps = {
  nippo: Nippo
}

export function NippoItem({ nippo }: NippoItemProps) {
  return (
    <div>
      <h3>{nippo.title}</h3>
      <p>{nippo.content}</p>
      <p>{nippo.createdAt}</p>
      <p>{nippo.updatedAt}</p>
    </div>
  )
}

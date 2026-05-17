import { useQuery } from '@tanstack/react-query'
import { client } from '../client'
import { NippoItem } from './NippoItem'
import { Link } from 'react-router-dom'

export function NippoList() {
  const { data: nippos = [] } = useQuery({
    queryKey: ['nippos'],
    queryFn: () => client.nippo.$get().then((res) => res.json()),
  })
  return (
    <>
      <h2>にっぽー一覧</h2>
      {nippos.map((nippo) => (
        <Link to="/nippo/1">
          <NippoItem key={nippo.id} nippo={nippo} />
        </Link>
      ))}
    </>
  )
}

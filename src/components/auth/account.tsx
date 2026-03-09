import { Avatar } from '../ui/avatar'

type Props = Readonly<{
  user: {
    id: string
    image: string | null | undefined
    username: string
    banned: boolean | null | undefined
    role: string | null | undefined
  }
}>

export function Account(props: Props) {
  const { user } = props
  return (
    <div className="flex items-center justify-between gap-3">
      <Avatar
        banned={user.banned ?? false}
        crown={user.role === 'admin'}
        imgSrc={user.image ?? undefined}
        name={user.username}
      />
      {user.username}
    </div>
  )
}

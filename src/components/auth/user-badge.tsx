import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getUser } from '@/data'

import { Avatar } from '../ui/avatar'

type Props = Readonly<{
  userId: string
}>

export function UserBadge(props: Props) {
  const { userId } = props
  const query = useQuery({
    queryKey: ['user-info', userId],
    queryFn: async () =>
      await getUser({
        data: userId,
      }),
    placeholderData: keepPreviousData,
  })

  const user = query.data

  return (
    <div className="flex items-center justify-start gap-3">
      <Avatar
        loading={query.isPending}
        banned={user?.banned ?? false}
        crown={user?.role === 'admin'}
        imgSrc={user?.image ?? undefined}
        name={user?.username}
      />
      {user?.username ?? 'Loading...'}
    </div>
  )
}

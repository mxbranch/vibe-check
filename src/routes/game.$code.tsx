import { createFileRoute, useRouter } from '@tanstack/react-router'

import { getMe, getRoom } from '@/data'

export const Route = createFileRoute('/game/$code')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const room = await getRoom({ data: params.code })
    const user = await getMe()
    return {
      room,
      user,
    }
  },
})

function RouteComponent() {
  const { code } = Route.useParams()
  const { room, user } = Route.useLoaderData()
  const router = useRouter()

  if (!room || room.owner !== user?.id) {
    router.navigate({
      to: '/',
      search: {
        reason: room && room.owner !== user?.id ? 'not-your-room-bucko' : 'no-room',
      },
    })
    return
  }

  return <div>Hello "/game/{code}"!</div>
}

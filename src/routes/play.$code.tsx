import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import { getMe, getRoom, getValidSubmission } from '@/data'

export const Route = createFileRoute('/play/$code')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const room = await getRoom({ data: params.code })
    const user = await getMe()
    return {
      room,
      user,
    }
  },
  head: () => ({
    meta: [{ title: 'Vibe Check! Time To Play' }],
  }),
})

function RouteComponent() {
  const { room, user } = Route.useLoaderData()
  const router = useRouter()

  if (!room) {
    return <div>Room doesn't exist! Sorry</div>
  }
  if (!user) {
    router.navigate({
      to: '/',
    })
    return
  }
  const query = useQuery({
    queryKey: ['play-submission', room.id],
    queryFn: async () => await getValidSubmission({ data: { roomId: room.id } }),
    refetchInterval: 1000 * 60, // 1 minute
  })

  if (query.isPending) {
    return <div>Loading...</div>
  }

  if (query.data === 'unauthorized') {
    return <div>Unauthorized</div>
  }

  // If suggestion incomplete, display the suggestion form
  // If suggestion made but not played, display the thank you message

  return (
    <div>
      {query.data?.id} - {query.data?.from} - {query.data?.to} - {query.data?.target}
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import { getMe, getRoom, getRoomNextSubmission } from '@/data'

export const Route = createFileRoute('/game/$code_/preview')({
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

  const query = useQuery({
    queryKey: ['game-preview', room.id],
    queryFn: async () =>
      await getRoomNextSubmission({
        data: {
          roomId: room.id,
        },
      }),
    refetchOnMount: false,
    refetchInterval: 1000 * 10,
    retry: false,
  })

  const submissionData = query.data

  if (query.isPending) {
    return <div>Loading...</div>
  }

  if (submissionData === 'unauthorized') {
    return <div>Unauthorized</div>
  }

  return (
    <div className="flex flex-col gap-6">
      {submissionData ? (
        <div>
          {submissionData.owner} - {submissionData.from} - {submissionData.to} -{' '}
          {submissionData.hint}
        </div>
      ) : (
        <div>No Upcoming Submission!</div>
      )}
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'

import { CloseRoomButton } from '@/components/game/close-room'
import { NextSubmissionButton } from '@/components/game/next-submission'
import { getMe, getRoom, getRoomCurrentSubmission } from '@/data'

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
  const { room, user } = Route.useLoaderData()
  const router = useRouter()
  const params = Route.useParams()

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
    queryKey: ['game-submission', room.id],
    queryFn: async () =>
      await getRoomCurrentSubmission({
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
        <div>No Current Submissions!</div>
      )}
      <Link to={'/game/$code/preview'} params={params} target="_blank">
        Open Preview
      </Link>
      {submissionData && (
        <NextSubmissionButton roomId={room.id} submissionId={submissionData.id} guess={0.5} />
      )}
      <CloseRoomButton roomId={room.id} />
    </div>
  )
}

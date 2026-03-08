import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import { CreateSubmissionForm } from '@/components/game/create-submission'
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
    refetchInterval: 1000 * 30, // 30 seconds
    retry: false,
  })

  const submissionData = query.data

  if (query.isPending) {
    return <div>Loading...</div>
  }

  if (!submissionData) {
    return <div>Loading...</div>
  }

  if (submissionData === 'unauthorized') {
    return <div>Unauthorized</div>
  }

  if (submissionData === 'room-closed') {
    return <div>Room is Closed!</div>
  }

  if (submissionData === 'out-of-prompts') {
    return <div>Out of prompts?!</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        {submissionData.id} - {submissionData.from} - {submissionData.to} - {submissionData.target}
      </div>
      {!submissionData.hint && (
        <CreateSubmissionForm submissionId={submissionData.id} roomId={room.id} />
      )}
      {submissionData.hint && !submissionData.used && (
        <>Thanks for your submission - {submissionData.hint}. Wait to see it played on stream!</>
      )}
    </div>
  )
}

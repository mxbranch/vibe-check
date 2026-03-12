import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { FrownIcon, LoaderIcon, LockIcon, SearchIcon } from 'lucide-react'

import { CloseRoomButton } from '@/components/game/close-room'
import { NextSubmissionButton } from '@/components/game/next-submission'
import { RoomCode } from '@/components/game/room-code'
import { ButtonLink } from '@/components/ui/button'
import { getMe, getRoom, getRoomCurrentSubmission } from '@/data'

export const Route = createFileRoute('/host/$code')({
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
    return (
      <div className="absolute inset-0 flex items-center justify-center gap-6 text-3xl">
        <LoaderIcon className="size-7 animate-spin" />
        Loading your room...
      </div>
    )
  }

  if (submissionData === 'unauthorized') {
    return (
      <div className="absolute inset-0 flex items-center justify-center gap-6 text-3xl">
        <LockIcon />
        You're not allowed to do this, sorry
      </div>
    )
  }

  return (
    <div className="absolute inset-0 flex flex-col items-start justify-between">
      <header className="z-10 flex h-24 w-full shrink-0 grow-0 items-center justify-between gap-6 bg-mauve-800/10 p-6 backdrop-blur-sm">
        <Link to={'/'}>
          <h1 className="font-fredoka text-4xl">Vibe Check!</h1>
        </Link>
        <CloseRoomButton roomId={room.id} />
      </header>
      <div className="-my-24 flex w-full grow flex-col items-center justify-center gap-6">
        {submissionData ? (
          <div>
            {submissionData.owner} - {submissionData.from} - {submissionData.to} -{' '}
            {submissionData.hint}
          </div>
        ) : (
          <div className="inline-flex rotate-2 items-center gap-3 text-4xl">
            No Current Submissions! <FrownIcon className="size-9" />
          </div>
        )}
        {submissionData && (
          <NextSubmissionButton roomId={room.id} submissionId={submissionData.id} guess={0.5} />
        )}
      </div>
      <div className="z-10 flex h-24 w-full shrink-0 grow-0 items-center justify-between gap-6 bg-mauve-800/10 p-6 backdrop-blur-sm">
        <RoomCode code={params.code} />
        <ButtonLink to={'/host/$code/preview'} params={params} target="_blank">
          <SearchIcon />
          Open Submission Preview Tab
        </ButtonLink>
      </div>
    </div>
  )
}

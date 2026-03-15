import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { LockIcon, SmileIcon } from 'lucide-react'

import { CreateSubmissionForm } from '@/components/game/create-submission'
import { PlayerVisualiser } from '@/components/game/player-visualiser'
import { ButtonLink } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
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
    router.navigate({
      to: '/',
    })
    return
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
    return (
      <div className="absolute inset-0 flex items-center justify-center gap-6 text-3xl">
        <Spinner className="size-7" />
        Loading...
      </div>
    )
  }

  if (!submissionData) {
    return (
      <div className="absolute inset-0 flex items-center justify-center gap-6 text-3xl">
        <Spinner className="size-7" />
        Loading...
      </div>
    )
  }

  if (submissionData === 'unauthorized') {
    return (
      <div className="absolute inset-0 flex items-center justify-center gap-3 text-3xl">
        <LockIcon />
        You're not allowed to do this, sorry
      </div>
    )
  }

  if (submissionData === 'room-closed') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
        <div className="flex items-center gap-3 text-3xl">
          Game Over! Thanks for playing <SmileIcon />
        </div>
        <ButtonLink to="/">Go Back To The Main Page</ButtonLink>
      </div>
    )
  }

  if (submissionData === 'out-of-prompts') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
        <div className="flex items-center gap-3 text-3xl">
          This game has used all of the available prompts?!
        </div>
        <ButtonLink to="/">Go Back To The Main Page</ButtonLink>
      </div>
    )
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between">
      <header className="z-10 flex h-24 w-full shrink-0 grow-0 items-center justify-between gap-6 bg-mauve-800/10 p-6 backdrop-blur-sm">
        <Link to={'/'}>
          <h1 className="font-fredoka text-4xl">Vibe Check!</h1>
        </Link>
      </header>
      <div className="-mt-24 flex w-full max-w-4xl grow flex-col items-center justify-center gap-6 p-6 pt-30">
        <div className="text-center">Get the host to guess this position...</div>
        <PlayerVisualiser
          from={submissionData.from}
          to={submissionData.to}
          target={submissionData.target}
          roomOwner={submissionData.roomOwner}
        />
        {!submissionData.hint && (
          <CreateSubmissionForm submissionId={submissionData.id} roomId={room.id} />
        )}
        {submissionData.hint && !submissionData.used && (
          <div>Thanks for your hint - {submissionData.hint}. Wait to see it played on stream!</div>
        )}
      </div>
    </div>
  )
}

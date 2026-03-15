import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, EyeIcon, FrownIcon, LockIcon, SearchIcon } from 'lucide-react'
import React from 'react'

import { UserBadge } from '@/components/auth/user-badge'
import { CloseRoomButton } from '@/components/game/close-room'
import { HostSlider } from '@/components/game/host-slider'
import { NextSubmissionButton } from '@/components/game/next-submission'
import { RoomCode } from '@/components/game/room-code'
import { SkipSubmissionButton } from '@/components/game/skip-submission'
import { Button, ButtonLink } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { getMe, getRoom, getRoomCurrentSubmission } from '@/data'
import { cn } from '@/lib/cn'

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
  head: () => ({
    meta: [{ title: 'Vibe Check! Hosting A Game' }],
  }),
})

function RouteComponent() {
  const { room, user } = Route.useLoaderData()
  const router = useRouter()
  const params = Route.useParams()

  const [revealed, reveal] = React.useState<boolean>(false)
  const [value, setValue] = React.useState<number>(0.5)

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
    placeholderData: keepPreviousData,
    refetchOnMount: false,
    refetchInterval: 1000 * 10,
    retry: false,
  })

  const submissionData = query.data

  React.useEffect(() => {
    setValue(0.5)
    reveal(false)
  }, [submissionData])

  if (query.isPending) {
    return (
      <div className="absolute inset-0 flex items-center justify-center gap-6 text-3xl">
        <Spinner className="size-7" />
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
    <div className="absolute inset-0 flex flex-col items-center justify-between">
      <header className="z-10 flex h-24 w-full shrink-0 grow-0 items-center justify-between gap-6 bg-mauve-800/10 p-6 backdrop-blur-sm">
        <Link to={'/'}>
          <h1 className="font-fredoka text-4xl">Vibe Check!</h1>
        </Link>
        <CloseRoomButton roomId={room.id} />
      </header>
      {submissionData ? (
        <div className="-my-24 flex w-full max-w-6xl grow flex-col items-center justify-center gap-6 p-6 pt-30">
          <>
            <div className="flex w-full flex-col gap-3 px-6">
              <div className="flex w-full items-center justify-start gap-2 text-xl">
                <ArrowLeft /> {submissionData.from}
              </div>
              <div
                className="relative flex h-40 items-center overflow-y-clip"
                style={
                  {
                    '--target': `${submissionData.target * 100}%`,
                  } as React.CSSProperties
                }
              >
                <div
                  className={cn(
                    'absolute top-auto bottom-auto left-[calc(-46*var(--spacing)+var(--target))] size-92 rounded-full bg-transparent opacity-0 transition-colors duration-1000',
                    revealed && 'bg-purple-800/40 opacity-100',
                  )}
                />
                <div
                  className={cn(
                    'absolute top-auto bottom-auto left-[calc(-36*var(--spacing)+var(--target))] size-72 rounded-full bg-transparent opacity-0 transition-colors duration-1000',
                    revealed && 'bg-purple-700/60 opacity-100',
                  )}
                />
                <div
                  className={cn(
                    'absolute top-auto bottom-auto left-[calc(-26*var(--spacing)+var(--target))] size-52 rounded-full bg-transparent opacity-0 transition-colors duration-1000',
                    revealed && 'bg-purple-600/80 opacity-100',
                  )}
                />
                <div
                  className={cn(
                    'absolute top-auto bottom-auto left-[calc(-16*var(--spacing)+var(--target))] size-32 rounded-full bg-transparent opacity-0 transition-colors duration-1000',
                    revealed && 'bg-purple-500 opacity-100',
                  )}
                />
                <div
                  className={cn(
                    'absolute top-auto bottom-auto left-[calc(-6*var(--spacing)+var(--target))] size-12 rounded-full bg-transparent opacity-0 transition-colors duration-1000',
                    revealed && 'bg-purple-400 opacity-100',
                  )}
                />
                <HostSlider
                  value={value}
                  setValue={setValue}
                  roomOwner={room.owner}
                  disabled={revealed}
                />
              </div>
              <div className="flex w-full items-center justify-end gap-2 text-xl">
                {submissionData.to} <ArrowRight />
              </div>
            </div>
            <div className="relative flex h-24 w-full items-center justify-center rounded-lg bg-mauve-100 p-6 text-center text-2xl text-purple-950 ring-1 ring-purple-600">
              {submissionData.hint}
              <div className="absolute -bottom-2.25 left-4 size-4 rotate-45 border-r border-b border-purple-600 bg-mauve-100" />
            </div>
            <div className="flex w-full items-center justify-between">
              <UserBadge userId={submissionData.owner} />
              <div className="flex gap-3">
                {!revealed ? (
                  <Button onClick={() => reveal((revealed) => !revealed)}>
                    <EyeIcon className="size-4" /> Reveal Target
                  </Button>
                ) : (
                  <NextSubmissionButton
                    roomId={room.id}
                    submissionId={submissionData.id}
                    guess={value}
                  />
                )}
                <SkipSubmissionButton roomId={room.id} submissionId={submissionData.id} />
              </div>
            </div>
          </>
        </div>
      ) : (
        <div className="inline-flex rotate-2 items-center gap-3 text-4xl">
          No Current Submissions! <FrownIcon className="size-9" />
        </div>
      )}
      <div className="z-10 flex h-24 w-full shrink-0 grow-0 items-center justify-between gap-6 bg-mauve-800/10 p-6 backdrop-blur-sm">
        <RoomCode code={params.code} />
        <ButtonLink to={'/host/$code/preview'} params={params} target="_blank">
          <SearchIcon className="size-4" />
          Open Submission Preview Tab
        </ButtonLink>
      </div>
    </div>
  )
}

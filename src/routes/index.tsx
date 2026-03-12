// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { Gamepad2Icon } from 'lucide-react'

import { TwitchSigninButton } from '@/components/auth/twitch-signin-button'
import { TwitchSignoutButton } from '@/components/auth/twitch-signout-button'
import { UserBadge } from '@/components/auth/user-badge'
import { CreateRoomButton } from '@/components/game/create-room'
import { JoinRoomForm } from '@/components/game/join-room'
import { ButtonLink } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getMe, getUserCurrentRoom } from '@/data'
import slogans from '@/data/slogans.json'
import { cn } from '@/lib/cn'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    const user = await getMe()
    const currentRoom = await getUserCurrentRoom()
    const sloganIndex = Math.floor(Math.random() * slogans.length)
    return { user, currentRoom, slogan: slogans[sloganIndex] }
  },
  head: () => ({
    meta: [{ title: 'Vibe Check! for Jackdaw Dot Television' }],
  }),
})

function Home() {
  const { user, currentRoom, slogan } = Route.useLoaderData()
  const currentRoomValid = !!(currentRoom && currentRoom !== 'unauthorized')

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex h-full w-full max-w-xl flex-col justify-center gap-6 p-3 lg:gap-8">
        <div className="relative">
          <h1 className="text-center font-fredoka text-5xl md:text-6xl lg:text-8xl">Vibe Check!</h1>
          <div className="rotate-2 text-center text-sm font-normal text-nowrap text-purple-200 capitalize md:text-base lg:-mt-3 lg:text-right">
            {slogan}
          </div>
        </div>
        {!user && (
          <div className="flex w-full items-center justify-center">
            <TwitchSigninButton />
          </div>
        )}
        {user && (
          <>
            <div className="flex w-full items-center justify-between">
              <UserBadge userId={user.id} />
              <TwitchSignoutButton />
            </div>
            <Separator />
          </>
        )}
        {user?.role === 'admin' && (
          <>
            <div
              className={cn(
                'flex items-center gap-3',
                currentRoomValid ? 'justify-between' : 'justify-evenly',
              )}
            >
              {currentRoomValid && (
                <ButtonLink nativeButton={false} to={'/host/$code'} params={{ code: currentRoom }}>
                  <Gamepad2Icon />
                  Current Room
                </ButtonLink>
              )}
              <CreateRoomButton />
            </div>
            <Separator text="or" />
          </>
        )}
        {user && <JoinRoomForm />}
      </div>
    </div>
  )
}

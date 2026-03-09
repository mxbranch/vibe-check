// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'

import { Account } from '@/components/auth/account'
import { TwitchSigninButton } from '@/components/auth/twitch-signin-button'
import { TwitchSignoutButton } from '@/components/auth/twitch-signout-button'
import { CreateRoomButton } from '@/components/game/create-room'
import { JoinRoomForm } from '@/components/game/join-room'
import { ButtonLink } from '@/components/ui/button'
import { getMe, getUserCurrentRoom } from '@/data'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    const user = await getMe()
    const currentRoom = await getUserCurrentRoom()
    return { user, currentRoom }
  },
  head: () => ({
    meta: [{ title: 'Vibe Check! for Jackdaw Dot Television' }],
  }),
})

function Home() {
  const { user, currentRoom } = Route.useLoaderData()

  return (
    <div className="absolute inset-0 mx-auto flex w-fit flex-col items-center justify-center gap-6">
      <div className="flex flex-col">
        <h1 className="text-center font-fredoka text-8xl">Vibe Check!</h1>
        <div className="-mt-3 rotate-2 text-right font-normal text-purple-200">
          For Jackdaw Dot Television
        </div>
      </div>
      {!user && <TwitchSigninButton />}
      {user && (
        <div className="flex w-full items-center justify-between border-b border-purple-800 pt-2 pb-6">
          <Account user={user} />
          <TwitchSignoutButton />
        </div>
      )}
      {currentRoom && currentRoom !== 'unauthorized' && (
        <ButtonLink nativeButton={false} to={'/host/$code'} params={{ code: currentRoom }}>
          Open Current Room
        </ButtonLink>
      )}
      {user?.role === 'admin' && <CreateRoomButton />}
      {user && <JoinRoomForm />}
    </div>
  )
}

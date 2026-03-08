// src/routes/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router'

import { Account } from '@/components/auth/account'
import { CreateRoomButton } from '@/components/game/create-room'
import { JoinRoomForm } from '@/components/game/join-room'
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
    <div className="flex flex-col gap-6">
      <Account />
      {currentRoom && currentRoom !== 'unauthorized' && (
        <Link to={'/game/$code'} params={{ code: currentRoom }}>
          Open Current Room
        </Link>
      )}
      {user?.role === 'admin' && <CreateRoomButton />}
      {user && <JoinRoomForm />}
    </div>
  )
}

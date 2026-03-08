// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'

import { Account } from '@/components/auth/account'
import { CreateRoomButton } from '@/components/game/create-room'
import { JoinRoomForm } from '@/components/game/join-room'
import { getMe } from '@/data'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    const user = await getMe()
    return { user }
  },
  head: () => ({
    meta: [{ title: 'Vibe Check! for Jackdaw Dot Television' }],
  }),
})

function Home() {
  const { user } = Route.useLoaderData()

  return (
    <div className="flex flex-col gap-6">
      <Account />
      {user?.role === 'admin' && <CreateRoomButton />}
      {user && <JoinRoomForm />}
    </div>
  )
}

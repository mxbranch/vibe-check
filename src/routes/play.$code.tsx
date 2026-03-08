import { createFileRoute } from '@tanstack/react-router'

import { getRoom } from '@/data'

export const Route = createFileRoute('/play/$code')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const room = await getRoom({ data: params.code })
    return { room }
  },
  head: () => ({
    meta: [{ title: 'Vibe Check! Time To Play' }],
  }),
})

function RouteComponent() {
  const { room } = Route.useLoaderData()

  if (!room) {
    return <div>Room doesn't exist! Sorry</div>
  }

  return <div>Hello "/play/$code"!</div>
}

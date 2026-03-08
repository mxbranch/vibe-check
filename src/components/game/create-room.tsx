import { useRouter } from '@tanstack/react-router'

import { createRoom } from '@/data'

export function CreateRoomButton() {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={async () => {
        const newRoom = await createRoom()
        if (newRoom === 'unauthorized') {
          alert('Not Allowed')
          return
        }
        router.navigate({
          to: '/game/$code',
          params: {
            code: newRoom.code,
          },
        })
      }}
    >
      Create Room
    </button>
  )
}

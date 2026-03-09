import { useRouter } from '@tanstack/react-router'
import { Gamepad2Icon, PlusCircleIcon } from 'lucide-react'

import { createRoom } from '@/data'

import { Button } from '../ui/button'

export function CreateRoomButton() {
  const router = useRouter()
  return (
    <Button
      type="button"
      onClick={async () => {
        const newRoom = await createRoom()
        if (newRoom === 'unauthorized') {
          alert('Not Allowed')
          return
        }
        router.navigate({
          to: '/host/$code',
          params: {
            code: newRoom.code,
          },
        })
      }}
    >
      <PlusCircleIcon />
      Create Room
    </Button>
  )
}

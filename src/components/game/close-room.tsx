import { useRouter } from '@tanstack/react-router'
import { XIcon } from 'lucide-react'

import { closeRoom } from '@/data'

import { Button } from '../ui/button'

type Props = Readonly<{
  roomId: number
}>

export function CloseRoomButton(props: Props) {
  const router = useRouter()
  return (
    <Button
      type="button"
      onClick={async () => {
        await closeRoom({ data: props })
        router.navigate({
          to: '/',
        })
      }}
    >
      <XIcon /> Close Room
    </Button>
  )
}

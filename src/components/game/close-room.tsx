import { useRouter } from '@tanstack/react-router'

import { closeRoom } from '@/data'

type Props = Readonly<{
  roomId: number
}>

export function CloseRoomButton(props: Props) {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={async () => {
        await closeRoom({ data: props })
        router.navigate({
          to: '/',
        })
      }}
    >
      Close Room
    </button>
  )
}

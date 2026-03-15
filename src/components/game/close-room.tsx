import { useRouter } from '@tanstack/react-router'
import { XIcon } from 'lucide-react'
import React from 'react'

import { closeRoom } from '@/data'

import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'

type Props = Readonly<{
  roomId: number
}>

export function CloseRoomButton(props: Props) {
  const router = useRouter()
  const [processing, setProcessing] = React.useState<boolean>(false)
  return (
    <Button
      type="button"
      disabled={processing}
      onClick={async () => {
        setProcessing(true)
        await closeRoom({ data: props })
        router.navigate({
          to: '/',
        })
      }}
    >
      {processing ? <Spinner /> : <XIcon className="size-4" />} Close Room
    </Button>
  )
}

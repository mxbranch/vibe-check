import { useRouter } from '@tanstack/react-router'
import { PlusIcon } from 'lucide-react'
import React from 'react'

import { createRoom } from '@/data'

import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'

export function CreateRoomButton() {
  const router = useRouter()
  const [processing, setProcessing] = React.useState<boolean>(false)
  return (
    <Button
      type="button"
      disabled={processing}
      onClick={async () => {
        setProcessing(true)
        const newRoom = await createRoom()
        if (newRoom === 'unauthorized') {
          alert('Not Allowed')
          return
        }
        if (newRoom === 'database-error') {
          alert('Database Error')
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
      {processing ? <Spinner /> : <PlusIcon className="size-4" />}
      New Room
    </Button>
  )
}

import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { LogOutIcon } from 'lucide-react'
import React from 'react'

import { authClient } from '@/lib/auth-client'

import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'

export function TwitchSignoutButton() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [processing, setProcessing] = React.useState<boolean>(false)
  const clickHandler = async () => {
    setProcessing(true)
    await authClient.signOut()
    await queryClient.refetchQueries({
      queryKey: ['getMe'],
    })
    router.invalidate()
  }

  return (
    <Button type="button" onClick={clickHandler} disabled={processing}>
      {processing ? <Spinner /> : <LogOutIcon className="size-4" />} Sign Out
    </Button>
  )
}

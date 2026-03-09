import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { LogOutIcon } from 'lucide-react'

import { authClient } from '@/lib/auth-client'

import { Button } from '../ui/button'

export function TwitchSignoutButton() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const clickHandler = async () => {
    await authClient.signOut()
    await queryClient.refetchQueries({
      queryKey: ['getMe'],
    })
    router.invalidate()
  }

  return (
    <Button type="button" onClick={clickHandler}>
      <LogOutIcon /> Sign Out
    </Button>
  )
}

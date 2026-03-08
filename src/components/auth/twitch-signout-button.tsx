import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

import { authClient } from '@/lib/auth-client'

export function TwitchSignoutButton() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const clickHandler = async () => {
    await authClient.signOut()
    queryClient.refetchQueries({
      queryKey: ['getMe'],
    })
    router.invalidate()
  }

  return (
    <button type="button" onClick={clickHandler}>
      Sign Out
    </button>
  )
}

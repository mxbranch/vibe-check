import { authClient } from '@/lib/auth-client'
import { useRouter } from '@tanstack/react-router'

export function TwitchSignoutButton() {
  const router = useRouter()

  const clickHandler = async () => {
    await authClient.signOut()
    router.invalidate()
  }

  return (
    <button type="button" onClick={clickHandler}>
      Sign Out
    </button>
  )
}

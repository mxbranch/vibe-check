import { authClient } from '@/lib/auth-client'
import { TwitchLoginButton } from './twitch-login-button'

export function Account() {
  const session = authClient.useSession()

  return (
    <div>
      {session.isPending ? (
        'Loading...'
      ) : session.data ? (
        session.data.user.name
      ) : (
        <TwitchLoginButton />
      )}
    </div>
  )
}

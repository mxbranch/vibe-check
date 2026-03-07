import { authClient } from '@/lib/auth-client'
import { TwitchSigninButton } from './twitch-signin-button'
import { TwitchSignoutButton } from './twitch-signout-button'

export function Account() {
  const session = authClient.useSession()

  return (
    <div>
      {session.isPending ? (
        'Loading...'
      ) : session.data ? (
        <>
          {session.data.user.name}
          <TwitchSignoutButton />
        </>
      ) : (
        <TwitchSigninButton />
      )}
    </div>
  )
}

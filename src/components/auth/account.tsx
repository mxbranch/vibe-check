import { authClient } from '@/lib/auth-client'

import { Avatar } from '../ui/avatar'
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
          <Avatar imgSrc={session.data.user.image ?? undefined} name={session.data.user.name} />
          <TwitchSignoutButton />
        </>
      ) : (
        <TwitchSigninButton />
      )}
    </div>
  )
}

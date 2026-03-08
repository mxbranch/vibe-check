import { useGetMe } from '@/lib/hooks'

import { Avatar } from '../ui/avatar'
import { TwitchSigninButton } from './twitch-signin-button'
import { TwitchSignoutButton } from './twitch-signout-button'

export function Account() {
  const getMeQuery = useGetMe()

  return (
    <div>
      {getMeQuery.isPending ? (
        'Loading...'
      ) : getMeQuery.data ? (
        <>
          <Avatar
            banned={getMeQuery.data.banned ?? false}
            crown={getMeQuery.data.role === 'admin'}
            imgSrc={getMeQuery.data.image ?? undefined}
            name={getMeQuery.data.username}
          />
          <TwitchSignoutButton />
        </>
      ) : (
        <TwitchSigninButton />
      )}
    </div>
  )
}

import { TwitchIcon } from '@/assets/twitch'
import { authClient } from '@/lib/auth-client'

import { Button } from '../ui/button'

export function TwitchSigninButton() {
  const clickHandler = async () => {
    await authClient.signIn.social({
      provider: 'twitch',
    })
  }

  return (
    <Button type="button" onClick={clickHandler}>
      <TwitchIcon className="size-4" /> Sign In With Twitch
    </Button>
  )
}

import { authClient } from '@/lib/auth-client'

export function TwitchSigninButton() {
  const clickHandler = async () => {
    await authClient.signIn.social({
      provider: 'twitch',
    })
  }

  return (
    <button type="button" onClick={clickHandler}>
      Sign In With Twitch
    </button>
  )
}

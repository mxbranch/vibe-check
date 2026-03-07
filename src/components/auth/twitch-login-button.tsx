import { authClient } from '@/lib/auth-client'

export function TwitchLoginButton() {
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

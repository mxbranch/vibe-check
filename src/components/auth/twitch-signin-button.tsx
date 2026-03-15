import React from 'react'

import { TwitchIcon } from '@/assets/twitch'
import { authClient } from '@/lib/auth-client'

import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'

export function TwitchSigninButton() {
  const [processing, setProcessing] = React.useState<boolean>(false)
  const clickHandler = async () => {
    setProcessing(true)
    await authClient.signIn.social({
      provider: 'twitch',
    })
  }

  return (
    <Button
      type="button"
      onClick={clickHandler}
      className="relative overflow-clip"
      disabled={processing}
    >
      <div className="absolute inset-0 animate-pulse bg-mauve-50/15" />
      {processing ? <Spinner /> : <TwitchIcon className="size-4" />} Sign In With Twitch
    </Button>
  )
}

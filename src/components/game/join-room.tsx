import { useRouter } from '@tanstack/react-router'
import React from 'react'

import { validateRoomCode } from '@/data'

export function JoinRoomForm() {
  const [code, setCode] = React.useState<string>('')
  const router = useRouter()

  async function clickHandler() {
    const roomExists = await validateRoomCode({ data: code })
    if (!roomExists) {
      alert('Lmao no')
      return
    }

    router.navigate({
      to: '/play/$code',
      params: {
        code,
      },
    })
  }

  return (
    <>
      <input
        className="border rounded-md"
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button type="button" onClick={clickHandler}>
        Join Game
      </button>
    </>
  )
}

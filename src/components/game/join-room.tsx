import { useRouter } from '@tanstack/react-router'
import React from 'react'

import { validateRoomCode } from '@/data'

import { Button } from '../ui/button'

export function JoinRoomForm() {
  const [code, setCode] = React.useState<string>('')
  const [feedback, setFeedback] = React.useState<string>('Enter Code To Play!')
  const router = useRouter()

  async function clickHandler() {
    setFeedback('Checking...')
    const roomExists = await validateRoomCode({ data: code })
    if (!roomExists) {
      setFeedback('Room Code Not Recognised')
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
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="code-input" className="sr-only">
          Enter Code
        </label>
        <input
          className="w-10 grow rounded-md bg-purple-950 px-3 py-1.5 text-center ring-1 inset-shadow-sm inset-ring-1 ring-purple-700 inset-ring-purple-800 outline-offset-2 outline-purple-400 focus:outline-2 md:px-4 md:py-2"
          type="text"
          value={code}
          // Upper Case Letters Only!
          onChange={(e) => {
            const newCode = e.target.value
            const lettersOnly = /^[A-Z]+$/
            if (newCode === '' || lettersOnly.test(newCode.toUpperCase())) {
              setCode(newCode.toUpperCase())
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              clickHandler()
            }
          }}
          id="code-input"
        />
        <Button
          disabled={code.length < 4}
          type="button"
          onClick={clickHandler}
          className="shrink-0 grow-0"
        >
          Join Game
        </Button>
      </div>
      <div className="text-sm">{feedback}</div>
    </div>
  )
}

import { useQueryClient } from '@tanstack/react-query'
import { DicesIcon } from 'lucide-react'
import React from 'react'

import { rerollPrompt } from '@/data'

import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'

type Props = Readonly<{
  rerollUsed?: boolean
  roomId: number
  submissionId: number
}>

export function RerollPromptButton(props: Props) {
  const { rerollUsed, roomId, submissionId } = props

  const [processing, setProcessing] = React.useState<boolean>(false)
  const queryClient = useQueryClient()
  async function handleClick() {
    setProcessing(true)
    await rerollPrompt({
      data: {
        roomId: roomId,
        submissionId: submissionId,
      },
    })
    await queryClient.refetchQueries({
      queryKey: ['play-submission', roomId],
    })
    setProcessing(false)
  }

  return (
    <Button type="button" onClick={handleClick} disabled={rerollUsed}>
      {processing ? <Spinner /> : <DicesIcon className="size-4" />}{' '}
      {rerollUsed ? 'Reroll Used' : 'Reroll Prompt?'}
    </Button>
  )
}

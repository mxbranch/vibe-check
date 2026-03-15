import { useQueryClient } from '@tanstack/react-query'
import { HammerIcon } from 'lucide-react'
import React from 'react'

import { markSubmissionUsed } from '@/data'

import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'

type Props = Readonly<{
  roomId: number
  submissionId: number
}>

export function BanSubmissionButton(props: Props) {
  const { roomId, submissionId } = props
  const queryClient = useQueryClient()

  const [processing, setProcessing] = React.useState<boolean>(false)
  async function handleClick() {
    setProcessing(true)
    await markSubmissionUsed({ data: { roomId, submissionId, guess: 0.0, result: 'banned' } })
    await queryClient.refetchQueries({
      queryKey: ['game-submission', roomId],
    })
    await queryClient.refetchQueries({
      queryKey: ['game-preview', roomId],
    })
    setProcessing(false)
  }

  return (
    <Button type="button" onClick={handleClick} disabled={processing}>
      {processing ? <Spinner /> : <HammerIcon className="size-4" />}BAN USER FOR SUBMISSION
    </Button>
  )
}

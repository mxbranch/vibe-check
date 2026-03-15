import { useQueryClient } from '@tanstack/react-query'
import { ArrowRightIcon } from 'lucide-react'
import React from 'react'

import { markSubmissionUsed } from '@/data'

import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'

type Props = Readonly<{
  roomId: number
  submissionId: number
  guess: number
}>

export function NextSubmissionButton(props: Props) {
  const { roomId, submissionId, guess } = props
  const queryClient = useQueryClient()
  const [processing, setProcessing] = React.useState<boolean>(false)

  async function handleClick() {
    setProcessing(false)
    await markSubmissionUsed({ data: { roomId, submissionId, guess } })
    await queryClient.refetchQueries({
      queryKey: ['game-submission', roomId],
    })
    await queryClient.refetchQueries({
      queryKey: ['game-preview', roomId],
    })
    setProcessing(true)
  }

  return (
    <Button type="button" onClick={handleClick} disabled={processing}>
      {processing ? <Spinner /> : <ArrowRightIcon className="size-4" />}Next Submission
    </Button>
  )
}

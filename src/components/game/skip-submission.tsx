import { useQueryClient } from '@tanstack/react-query'
import { ArrowRightIcon } from 'lucide-react'
import React from 'react'

import { markSubmissionUsed } from '@/data'

import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'

type Props = Readonly<{
  roomId: number
  submissionId: number
}>

export function SkipSubmissionButton(props: Props) {
  const { roomId, submissionId } = props
  const [processing, setProcessing] = React.useState<boolean>(false)
  const queryClient = useQueryClient()
  async function handleClick() {
    setProcessing(true)
    await markSubmissionUsed({ data: { roomId, submissionId, guess: 0.0, result: 'skipped' } })
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
      {processing ? <Spinner /> : <ArrowRightIcon className="size-4" />}Skip
    </Button>
  )
}

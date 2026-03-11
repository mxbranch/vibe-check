import { useQueryClient } from '@tanstack/react-query'

import { markSubmissionUsed } from '@/data'

import { Button } from '../ui/button'

type Props = Readonly<{
  roomId: number
  submissionId: number
}>

export function SkipSubmissionButton(props: Props) {
  const { roomId, submissionId } = props
  const queryClient = useQueryClient()

  async function handleClick() {
    await markSubmissionUsed({ data: { roomId, submissionId, guess: 0.0, result: 'skipped' } })
    await queryClient.refetchQueries({
      queryKey: ['game-submission', roomId],
    })
    await queryClient.refetchQueries({
      queryKey: ['game-preview', roomId],
    })
  }

  return (
    <Button type="button" onClick={handleClick}>
      SKIP SUBMISSION
    </Button>
  )
}

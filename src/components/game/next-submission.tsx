import { useQueryClient } from '@tanstack/react-query'

import { markSubmissionUsed } from '@/data'

import { Button } from '../ui/button'

type Props = Readonly<{
  roomId: number
  submissionId: number
  guess: number
}>

export function NextSubmissionButton(props: Props) {
  const { roomId, submissionId, guess } = props
  const queryClient = useQueryClient()

  async function handleClick() {
    await markSubmissionUsed({ data: { roomId, submissionId, guess } })
    await queryClient.refetchQueries({
      queryKey: ['game-submission', roomId],
    })
    await queryClient.refetchQueries({
      queryKey: ['game-preview', roomId],
    })
  }

  return (
    <Button type="button" onClick={handleClick}>
      NEXT SUBMISSION
    </Button>
  )
}

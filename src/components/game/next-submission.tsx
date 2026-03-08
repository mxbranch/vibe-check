import { useQueryClient } from '@tanstack/react-query'

import { markSubmissionPlayed } from '@/data'

type Props = Readonly<{
  roomId: number
  submissionId: number
  guess: number
}>

export function NextSubmissionButton(props: Props) {
  const { roomId, submissionId, guess } = props
  const queryClient = useQueryClient()

  async function handleClick() {
    await markSubmissionPlayed({ data: { roomId, submissionId, guess } })
    await queryClient.refetchQueries({
      queryKey: ['game-submission', roomId],
    })
  }

  return (
    <button type="button" onClick={handleClick}>
      NEXT SUBMISSION
    </button>
  )
}

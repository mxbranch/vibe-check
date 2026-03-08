import { useQueryClient } from '@tanstack/react-query'

import { markSubmissionUsed } from '@/data'

type Props = Readonly<{
  roomId: number
  submissionId: number
}>

export function BanSubmissionButton(props: Props) {
  const { roomId, submissionId } = props
  const queryClient = useQueryClient()

  async function handleClick() {
    await markSubmissionUsed({ data: { roomId, submissionId, guess: 0.0, result: 'banned' } })
    await queryClient.refetchQueries({
      queryKey: ['game-submission', roomId],
    })
    await queryClient.refetchQueries({
      queryKey: ['game-preview', roomId],
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="border border-red-500 bg-red-50 px-1.5 py-1"
    >
      BAN USER FOR SUBMISSION
    </button>
  )
}

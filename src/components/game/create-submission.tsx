import { useForm, useSelector } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { SendIcon } from 'lucide-react'
import React from 'react'

import { postSubmission, postSubmissionSchema, type PostSubmissionSchema } from '@/data'

import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { RerollPromptButton } from './reroll-prompt'

type Props = Readonly<{
  submissionId: number
  roomId: number
  rerollUsed?: boolean
}>

const MAX_SUBMISSION_LENGTH = 140

export function CreateSubmissionForm(props: Props) {
  const { submissionId, roomId, rerollUsed = false } = props

  const [processing, setProcessing] = React.useState<boolean>(false)
  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues: {
      hint: '',
      submissionId,
    } as PostSubmissionSchema,
    onSubmit: async ({ value }) => {
      setProcessing(true)
      await postSubmission({ data: value })
      await queryClient.refetchQueries({
        queryKey: ['play-submission', roomId],
      })
      setProcessing(false)
    },
    validators: {
      onSubmit: postSubmissionSchema,
    },
  })

  const hintState = useSelector(form.store, (state) => state.values.hint)

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="flex w-full flex-col items-center gap-3"
      >
        <form.Field name="hint">
          {(field) => (
            <input
              type="text"
              value={field.state.value}
              onChange={(e) => {
                if (e.target.value.length <= MAX_SUBMISSION_LENGTH) {
                  field.handleChange(e.target.value)
                }
              }}
              onBlur={field.handleBlur}
              className="w-full grow rounded-md bg-purple-950 px-3 py-1.5 text-center ring-1 inset-shadow-sm inset-ring-1 ring-purple-700 inset-ring-purple-800 outline-offset-2 outline-purple-400 focus:outline-2 md:px-4 md:py-2"
            />
          )}
        </form.Field>
        <div className="flex w-full items-start justify-between">
          <div>
            {hintState.length} / {MAX_SUBMISSION_LENGTH}
          </div>
          <RerollPromptButton roomId={roomId} rerollUsed={rerollUsed} submissionId={submissionId} />
          <Button type="submit" disabled={processing}>
            {processing ? <Spinner /> : <SendIcon className="size-4" />} Submit
          </Button>
        </div>
      </form>
    </>
  )
}

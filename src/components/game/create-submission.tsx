import { useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'

import { postSubmission, postSubmissionSchema, type PostSubmissionSchema } from '@/data'

type Props = Readonly<{
  submissionId: number
  roomId: number
}>

export function CreateSubmissionForm(props: Props) {
  const { submissionId, roomId } = props

  const queryClient = useQueryClient()
  const form = useForm({
    defaultValues: {
      hint: '',
      submissionId,
    } as PostSubmissionSchema,
    onSubmit: async ({ value }) => {
      await postSubmission({ data: value })
      queryClient.refetchQueries({
        queryKey: ['play-submission', roomId],
      })
    },
    validators: {
      onSubmit: postSubmissionSchema,
    },
  })

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <form.Field name="hint">
          {(field) => (
            <input
              type="text"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="border rounded-lg"
            />
          )}
        </form.Field>
        <button type="submit" className="border border-indigo-700 rounded-lg bg-indigo-50">
          Submit Entry
        </button>
      </form>
    </>
  )
}

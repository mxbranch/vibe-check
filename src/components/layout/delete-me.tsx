import { Dialog } from '@base-ui/react/dialog'
import { useRouter } from '@tanstack/react-router'
import { UserX2Icon, XIcon } from 'lucide-react'
import React from 'react'

import { deleteMe } from '@/data'

import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'

type Props = Readonly<{
  isLoggedIn?: boolean
}>

export function DeleteMe(props: Props) {
  const { isLoggedIn = false } = props
  const router = useRouter()

  const [deleted, setDeleted] = React.useState<boolean>(false)
  const [processing, setProcessing] = React.useState<boolean>(false)

  return (
    <Dialog.Root>
      <Dialog.Trigger className="inline cursor-pointer text-purple-200 underline underline-offset-2 transition-all hover:rotate-1 hover:underline-offset-4">
        Click here to delete all your data.
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute dark:opacity-70" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -mt-8 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-lg bg-purple-200 p-6 text-mauve-900 outline-1 outline-mauve-200 transition-all duration-150 data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0">
          <Dialog.Title className="mb-3 font-fredoka text-3xl">Delete My Data</Dialog.Title>
          <Dialog.Description>
            {deleted ? (
              <>We've deleted your data. Thanks for playing Vibe Check!</>
            ) : (
              <>
                This will delete:{' '}
                <ul className="list-inside list-disc text-sm">
                  <li>Your suggestions</li>
                  <li>Your game rooms (if applicable)</li>
                  <li>Your Twitch account information</li>
                </ul>
                {!isLoggedIn && <>But we can only do that if you're logged in already!</>}
              </>
            )}
            <div className="mt-6 flex w-full flex-col items-center justify-between gap-6 border-t border-purple-600 pt-6 md:flex-row">
              <Dialog.Close render={<Button />}>
                <XIcon /> Close {!deleted && 'Without Deleting'}
              </Dialog.Close>
              {isLoggedIn && (
                <Button
                  onClick={async () => {
                    setProcessing(true)
                    await deleteMe()
                    setDeleted(true)
                    setProcessing(false)
                    router.navigate({
                      to: '/',
                    })
                  }}
                  disabled={processing}
                >
                  {processing ? <Spinner /> : <UserX2Icon className="size-4" />} Delete My Data
                </Button>
              )}
            </div>
          </Dialog.Description>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

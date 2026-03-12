import React from 'react'

import { Button } from './button'

type Props = Readonly<{
  children?: React.ReactNode
}>

export function DismissableBanner(props: Props) {
  const { children } = props

  const [open, setOpen] = React.useState<boolean>(true)

  if (!open) {
    return null
  }

  return (
    <div className="flex w-full max-w-4xl items-center justify-between rounded-lg border border-purple-500 bg-purple-900 p-6 text-mauve-50">
      <div>{children}</div>
      <Button
        onClick={() => {
          setOpen(false)
        }}
      >
        Okay, Thanks
      </Button>
    </div>
  )
}

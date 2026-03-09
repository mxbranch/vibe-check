import { Button as ButtonPrimitive, type ButtonProps } from '@base-ui/react/button'
import { createLink } from '@tanstack/react-router'

import { cn } from '@/lib/cn'

export function Button(props: ButtonProps) {
  const { className, ...rest } = props
  return (
    <ButtonPrimitive
      className={cn(
        'inline-flex w-fit shrink-0  grow-0 -translate-y-0.5 items-center justify-center gap-2 rounded-full bg-purple-500 px-4 py-2 font-semibold text-purple-50 ring-1 inset-ring-1 ring-purple-800 inset-ring-purple-900 outline-offset-2 outline-purple-400 transition-all text-shadow-purple-900 text-shadow-xs hover:-translate-y-1 hover:rotate-1 hover:bg-purple-600 focus:outline-2 active:translate-y-0 active:bg-purple-700',
        className,
      )}
      {...rest}
    />
  )
}

function ButtonLinkStyled(props: ButtonProps) {
  const { className, render: _, ...rest } = props
  return (
    <ButtonPrimitive
      className={cn(
        'inline-flex w-fit shrink-0  grow-0 -translate-y-0.5 items-center justify-center gap-2 rounded-full bg-purple-500 px-4 py-2 font-semibold text-purple-50 ring-1 inset-ring-1 ring-purple-800 inset-ring-purple-900 outline-offset-2 outline-purple-400 transition-all text-shadow-purple-900 text-shadow-xs hover:-translate-y-1 hover:bg-purple-600 focus:outline-2 active:translate-y-0 active:bg-purple-700',
        className,
      )}
      render={<a />}
      {...rest}
    />
  )
}

export const ButtonLink = createLink(ButtonLinkStyled)

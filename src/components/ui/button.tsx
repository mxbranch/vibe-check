import { Button as ButtonPrimitive, type ButtonProps } from '@base-ui/react/button'
import { createLink } from '@tanstack/react-router'
import React from 'react'

import { cn } from '@/lib/cn'

const maxTilt = 3
const tiltRange = maxTilt * 2 + 1

export function Button(props: ButtonProps) {
  const { className, ...rest } = props
  const [angle, setAngle] = React.useState<number>(0)

  return (
    <ButtonPrimitive
      style={
        {
          '--angle': `${angle}deg`,
        } as React.CSSProperties
      }
      className={cn(
        'inline-flex w-fit shrink-0 grow-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-purple-500 px-3 py-1.5 font-semibold text-purple-50 ring-1 inset-ring-1 ring-purple-800 inset-ring-purple-900 outline-offset-2 outline-purple-400 transition-all text-shadow-purple-800 text-shadow-xs not-disabled:hover:-translate-y-0.5 not-disabled:hover:rotate-(--angle) not-disabled:hover:bg-purple-600 focus:outline-2 not-disabled:active:translate-y-0.5 not-disabled:active:bg-purple-700 disabled:cursor-not-allowed disabled:grayscale md:px-4 md:py-2',
        className,
      )}
      onMouseOver={() => {
        const newAngle = Math.floor(Math.random() * tiltRange - tiltRange / 2)
        setAngle(newAngle)
      }}
      {...rest}
    />
  )
}

function ButtonLinkStyled(props: ButtonProps) {
  const { className, render: _, ...rest } = props
  return <Button nativeButton={false} className={className} render={<a />} {...rest} />
}

export const ButtonLink = createLink(ButtonLinkStyled)

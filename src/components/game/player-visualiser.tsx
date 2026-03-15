import { keepPreviousData, useQuery } from '@tanstack/react-query'
import React from 'react'

import { VerticalSeparator } from '@/components/ui/separator'
import { getUser } from '@/data'

import { Avatar } from '../ui/avatar'

type Props = Readonly<{
  from: string | null
  to: string | null
  target: number
  roomOwner: string | null
}>

export function PlayerVisualiser(props: Props) {
  const { from, to, target, roomOwner } = props

  const query = useQuery({
    queryKey: ['user-info', roomOwner],
    queryFn: async () =>
      await getUser({
        data: roomOwner,
      }),
    placeholderData: keepPreviousData,
  })

  const owner = query.data
  if (owner === 'unauthorized') return null

  return (
    <div className="isolate flex w-full grow flex-col items-center justify-between backdrop-blur-sm">
      <div className="w-full shrink-0 grow-0 rounded-lg bg-purple-900 p-1 text-center">{from}</div>
      <div className="relative -z-10 flex w-full grow flex-col items-center justify-center">
        <VerticalSeparator className="h-full w-1" />
        <div className="absolute w-16 border-b-4 border-purple-500" />
        <div className="absolute top-1/4 w-8 border-b-4 border-purple-600" />
        <div className="absolute top-3/4 w-8 border-b-4 border-purple-600" />
        <div
          style={
            {
              '--target': `${target * 100}%`,
            } as React.CSSProperties
          }
          className="absolute top-[calc(var(--target)-(var(--spacing)*6))] right-auto left-auto"
        >
          <Avatar
            loading={query.isPending}
            banned={owner?.banned ?? false}
            imgSrc={owner?.image ?? undefined}
            name={owner?.username}
            className="size-12"
          />
        </div>
      </div>
      <div className="w-full shrink-0 grow-0 rounded-lg bg-purple-900 p-1 text-center">{to}</div>
    </div>
  )
}

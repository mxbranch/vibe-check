import { Slider } from '@base-ui/react/slider'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import React from 'react'

import { getUser } from '@/data'

import { Avatar } from '../ui/avatar'

type Props = Readonly<{
  value: number
  setValue: React.Dispatch<React.SetStateAction<number>>
  roomOwner: string
  disabled?: boolean
}>

export function HostSlider(props: Props) {
  const { value, setValue, roomOwner, disabled } = props

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
    <Slider.Root
      value={value}
      onValueChange={setValue}
      min={0}
      max={1}
      step={0.01}
      className="w-full"
      disabled={disabled}
    >
      <Slider.Control className="flex w-full grow touch-none items-center py-3 select-none">
        <Slider.Track className="h-1 w-full rounded-sm bg-gray-200 shadow-[inset_0_0_0_1px] shadow-gray-200 select-none">
          <Slider.Thumb aria-label="Volume" className="size-18 overflow-clip">
            <Avatar
              loading={query.isPending}
              banned={owner?.banned ?? false}
              imgSrc={owner?.image ?? undefined}
              name={owner?.username}
              className="pointer-events-none size-18 select-none"
            />
          </Slider.Thumb>
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  )
}

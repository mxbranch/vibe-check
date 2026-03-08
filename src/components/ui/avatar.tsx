import { Avatar as AvatarPrimitive } from '@base-ui/react'
import { CrownIcon, XIcon } from 'lucide-react'

type Props = Readonly<{
  banned?: boolean
  crown?: boolean
  imgSrc?: string
  name?: string
}>

export function Avatar(props: Props) {
  const { banned = false, crown = false, imgSrc, name } = props
  const { Root, Image, Fallback } = AvatarPrimitive

  return (
    <div className="size-12 inline-flex items-center justify-center relative">
      {banned && <XIcon className="stroke-red-500 absolute inset-auto size-8" />}
      {crown && (
        <CrownIcon className="stroke-amber-400 fill-amber-400 absolute -top-2 right-auto left-auto" />
      )}
      <Root className="size-12 inline-flex items-center justify-center overflow-clip rounded-full bg-gray-200 select-none">
        <Image src={imgSrc} className="size-full object-cover" />
        <Fallback className="size-full flex items-center justify-center font-semibold">
          {name?.slice(0, 2) ?? 'XX'}
        </Fallback>
      </Root>
    </div>
  )
}

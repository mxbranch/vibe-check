import { Avatar as AvatarPrimitive } from '@base-ui/react'

type Props = Readonly<{
  imgSrc?: string
  name?: string
}>

export function Avatar(props: Props) {
  const { imgSrc, name } = props
  const { Root, Image, Fallback } = AvatarPrimitive

  return (
    <Root className="size-12 inline-flex items-center justify-center rounded-full overflow-hidden bg-gray-200 select-none">
      <Image src={imgSrc} className="size-full object-cover" />
      <Fallback className="size-full flex items-center justify-center font-semibold">
        {name?.slice(0, 2) ?? 'XX'}
      </Fallback>
    </Root>
  )
}

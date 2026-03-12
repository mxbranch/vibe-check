import { Avatar as AvatarPrimitive } from '@base-ui/react'
import { CrownIcon, Loader2Icon, XIcon } from 'lucide-react'

import { cn } from '@/lib/cn'

type Props = Readonly<{
  banned?: boolean
  className?: string
  crown?: boolean
  imgSrc?: string
  loading?: boolean
  name?: string
}>

export function Avatar(props: Props) {
  const { banned = false, className, crown = false, imgSrc, loading = false, name } = props
  const { Root, Image, Fallback } = AvatarPrimitive

  return (
    <div className={cn('relative inline-flex size-12 items-center justify-center', className)}>
      {banned && <XIcon className="absolute inset-auto size-8 stroke-red-500" />}
      {crown && (
        <CrownIcon className="absolute -top-4 right-auto left-auto size-6 fill-yellow-300 stroke-yellow-300" />
      )}
      <Root className="inline-flex size-full items-center justify-center overflow-clip rounded-full bg-gray-200 select-none">
        <Image src={imgSrc} alt={`${name}'s Avatar`} className="size-full object-cover" />
        <Fallback className="flex size-full items-center justify-center font-semibold">
          {loading ? (
            <Loader2Icon className="animate-spin stroke-purple-700" />
          ) : (
            (name?.slice(0, 2) ?? 'XX')
          )}
        </Fallback>
      </Root>
    </div>
  )
}

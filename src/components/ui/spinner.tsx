import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/cn'

type Props = Readonly<{
  className?: string
}>

export function Spinner(props: Props) {
  const { className } = props
  return <Loader2 className={cn('size-4 animate-spin', className)} />
}

import { Separator as SeparatorPrimitive, type SeparatorProps } from '@base-ui/react/separator'

import { cn } from '@/lib/cn'

export function Separator(props: SeparatorProps & { text?: string }) {
  const { className, text, orientation: _, ...rest } = props

  if (text) {
    return (
      <div className="flex items-center gap-3">
        <SeparatorPrimitive className={cn('h-px grow bg-purple-600', className)} {...rest} />
        <div className="text-sm text-purple-100 italic">{text}</div>
        <SeparatorPrimitive className={cn('h-px grow bg-purple-600', className)} {...rest} />
      </div>
    )
  }

  return <SeparatorPrimitive className={cn('h-px bg-purple-600', className)} {...rest} />
}

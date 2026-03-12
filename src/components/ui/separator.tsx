import { Separator as SeparatorPrimitive, type SeparatorProps } from '@base-ui/react/separator'

import { cn } from '@/lib/cn'

export function Separator(props: Omit<SeparatorProps, 'orientation'> & { text?: string }) {
  const { className, text, ...rest } = props

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

export function VerticalSeparator(props: Omit<SeparatorProps, 'orientation'>) {
  const { className, ...rest } = props
  return (
    <SeparatorPrimitive
      orientation="vertical"
      className={cn('w-px bg-purple-600', className)}
      {...rest}
    />
  )
}

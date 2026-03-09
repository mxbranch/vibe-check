import { cn } from '@/lib/cn'

type Props = React.HTMLProps<HTMLAnchorElement>

export function InlineLink(props: Props) {
  const { className, ...rest } = props
  return (
    <a
      className={cn(
        'inline-block text-purple-200 underline underline-offset-2 transition-all hover:rotate-1 hover:underline-offset-4',
        className,
      )}
      {...rest}
    />
  )
}

import { InlineLink } from '../ui/inline-link'

export function Footer() {
  return (
    <div
      className="relative h-96"
      style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
    >
      <div className="fixed bottom-0 flex h-96 w-full items-center justify-center bg-mauve-900 p-6 text-mauve-100">
        <div>
          Created for{' '}
          <InlineLink href="https://jackdaw.tv" target="_blank">
            Jackdaw.tv
          </InlineLink>
        </div>
      </div>
    </div>
  )
}

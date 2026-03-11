import { InlineLink } from '../ui/inline-link'

export function Footer() {
  return (
    <div
      className="relative h-96"
      style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
    >
      <footer className="fixed bottom-0 flex h-96 w-full flex-col items-center justify-center gap-1 bg-mauve-900 p-6 text-mauve-100">
        <div>
          Created for{' '}
          <InlineLink href="https://jackdaw.tv" target="_blank">
            Jackdaw.tv
          </InlineLink>
        </div>
        <div>The developer of this site used no AI tools</div>
      </footer>
    </div>
  )
}

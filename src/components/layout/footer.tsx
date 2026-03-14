import { InlineLink } from '../ui/inline-link'

export function Footer() {
  return (
    <div
      className="relative h-96"
      style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
    >
      <footer className="fixed bottom-0 flex h-96 w-full items-center justify-between gap-1 bg-mauve-900 p-6 text-mauve-300">
        <div className="max-w-lg">
          Created for{' '}
          <InlineLink href="https://jackdaw.tv" target="_blank">
            Jackdaw.tv
          </InlineLink>{' '}
          and inspired by the{' '}
          <InlineLink href="" target="_blank">
            really cool board game Wavelength
          </InlineLink>
          .
        </div>
        <div className="flex max-w-lg flex-col gap-2 text-right">
          <div>The developer of this site used no AI tools.</div>
          <div className="text-sm text-mauve-500">
            <a href="https://thenib.com/mister-gotcha/" target="_blank">
              Can't guarantee that for every library used but that's just 2026 isn't it.
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

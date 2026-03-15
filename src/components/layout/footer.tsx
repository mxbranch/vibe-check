import { useRouterState } from '@tanstack/react-router'

import { InlineLink } from '../ui/inline-link'
import { DeleteMe } from './delete-me'

type Props = Readonly<{
  isLoggedIn?: boolean
}>

export function Footer(props: Props) {
  const { isLoggedIn } = props
  const router = useRouterState()
  if (router.location.pathname !== '/') return null
  return (
    <div
      className="relative h-106 md:h-96"
      style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
    >
      <footer className="fixed bottom-0 flex h-106 w-full flex-col items-center justify-center gap-4 bg-mauve-900 p-6 text-mauve-300 md:h-96 md:flex-row md:justify-between">
        <div className="flex max-w-lg flex-col gap-2 text-left">
          <div>
            Created for{' '}
            <InlineLink href="https://jackdaw.tv" target="_blank">
              Jackdaw.tv
            </InlineLink>{' '}
            and inspired by the{' '}
            <InlineLink
              href="https://www.cmyk.games/collections/games/products/wavelength"
              target="_blank"
            >
              really cool board game Wavelength
            </InlineLink>
            .
          </div>
          <div className="text-sm text-mauve-500">
            This site only processes personal data provided by Twitch to log you in. Aside from this
            we only store your in-game suggestions and have no analytics.{' '}
            <DeleteMe isLoggedIn={isLoggedIn} />
          </div>
        </div>
        <div className="flex max-w-lg flex-col gap-2 md:text-right">
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

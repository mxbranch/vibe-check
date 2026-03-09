import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import React from 'react'

import { Footer } from '@/components/layout/footer'
import { Konami } from '@/components/layout/konami'
import { TanStackQueryProvider } from '@/providers/tanstack-query'

import globalCSS from '@/styles/global.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Vibe Check',
      },
    ],
    links: [{ rel: 'stylesheet', href: globalCSS }],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <TanStackQueryProvider>
        <Outlet />
      </TanStackQueryProvider>
    </RootDocument>
  )
}

type RootDocumentProps = Readonly<{
  children?: React.ReactNode
}>

function RootDocument(props: RootDocumentProps) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="bg-purple-950 text-lg font-medium text-purple-100">
        <div className="relative isolate flex h-svh w-full items-center justify-center overflow-clip">
          <div
            className="z-0 aspect-square h-[max(100svh,100svw)] animate-spin-slow mask-radial-from-0 mask-radial-to-60% mask-radial-at-center opacity-10"
            style={{
              background:
                'repeating-conic-gradient(from 0deg at center, var(--color-mauve-50) 0 10deg, transparent 0 20deg)',
            }}
          />
          {props.children}
        </div>
        <Footer />
        <Konami />
        <Scripts />
      </body>
    </html>
  )
}

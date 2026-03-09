import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import React from 'react'

import { Footer } from '@/components/layout/footer'
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
        <div
          className="absolute inset-0 z-0 flex  h-svh animate-spin-slow items-center justify-center overflow-hidden mask-radial-from-0 mask-radial-to-80% mask-radial-at-center opacity-10"
          style={{
            background:
              'repeating-conic-gradient(from 0deg at center, var(--color-mauve-50) 0 10deg, transparent 0 20deg)',
          }}
        />
        <div className="relative isolate min-h-svh w-full">{props.children}</div>
        <Footer />
        <Scripts />
      </body>
    </html>
  )
}

//repeating-conic-gradient(from var(--background-gradient-start, 0deg) at var(--header-bg-center), var(--color-accent2-light1) 0 4deg, transparent 0 8deg) fixed;

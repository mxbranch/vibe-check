import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import React from 'react'

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
      <body>
        <div className="isolate">{props.children}</div>
        <Scripts />
      </body>
    </html>
  )
}

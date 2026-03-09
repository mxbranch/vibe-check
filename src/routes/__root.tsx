import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import React from 'react'

import radialStripes from '@/assets/radial-stripes.svg'
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
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <img
            src={radialStripes}
            className="animate-spin-slow object-cover object-center mix-blend-screen"
          />
        </div>
        <div className="relative isolate min-h-svh w-full">{props.children}</div>
        <Scripts />
      </body>
    </html>
  )
}

//

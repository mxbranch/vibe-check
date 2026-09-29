import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

import db from '@/db'

export const auth = betterAuth({
  appName: 'Vibe Check',
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    twitch: {
      clientId: process.env.BETTER_AUTH_TWITCH_ID!,
      clientSecret: process.env.BETTER_AUTH_TWITCH_SECRET!,
    },
  },
  plugins: [admin(), tanstackStartCookies()],
  onAPIError: {
    errorURL: '/auth-error',
  },
})

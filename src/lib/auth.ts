import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import db from '@/db'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

export const auth = betterAuth({
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
  plugins: [tanstackStartCookies()],
})

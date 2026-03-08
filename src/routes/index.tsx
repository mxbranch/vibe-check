// src/routes/index.tsx
import { createFileRoute, useRouter } from '@tanstack/react-router'

import { Account } from '@/components/auth/account'
import { getValues, setValue, validateRoomCode } from '@/data'
import { sqids } from '@/lib/sqids'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getValues(),
  head: () => ({
    meta: [{ title: 'Vibe Check Index' }],
  }),
})

function Home() {
  const router = useRouter()
  const testValues = Route.useLoaderData()

  return (
    <>
      <Account />
      <button
        type="button"
        onClick={() => {
          setValue({ data: 'New Entry' }).then(() => {
            router.invalidate()
          })
        }}
      >
        Add Entry
      </button>
      <ul>
        {testValues.map((testValue) => {
          const code = sqids.encode([testValue.id])
          return (
            <li key={testValue.id}>
              {code} - {testValue.value}
              <button
                type="button"
                onClick={async () => {
                  const result = await validateRoomCode({ data: code })
                  alert(`Result: ${result ? 'yes' : 'no'}`)
                }}
              >
                Test
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}

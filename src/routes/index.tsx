// src/routes/index.tsx
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import * as v from 'valibot'
import db from '@/db'
import { test } from '@/db/schema'
import { desc } from 'drizzle-orm'

const getData = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await db.select().from(test).limit(5).orderBy(desc(test.id))
})

const setValue = createServerFn({ method: 'POST' })
  .inputValidator(v.pipe(v.string(), v.trim()))
  .handler(async ({ data }) => {
    await db.insert(test).values({
      value: data,
    })
    return { success: true }
  })

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => await getData(),
})

function Home() {
  const router = useRouter()
  const testValues = Route.useLoaderData()

  return (
    <>
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
        {testValues.map((testValue) => (
          <li key={testValue.id}>
            {testValue.id} - {testValue.value}
          </li>
        ))}
      </ul>
    </>
  )
}

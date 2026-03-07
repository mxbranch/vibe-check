// src/routes/index.tsx
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { getValues, setValue } from '#/data/value-test-table'

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

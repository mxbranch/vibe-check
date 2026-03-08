import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'

import { getMe } from '@/data'

export function useGetMe() {
  const getMeFn = useServerFn(getMe)
  const query = useQuery({
    queryKey: ['getMe'],
    queryFn: async () => await getMeFn(),
  })

  return query
}

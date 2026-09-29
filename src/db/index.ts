import 'dotenv/config'
import { drizzle } from 'drizzle-orm/netlify-db'

import * as schema from './schema'

// You can specify any property from the node-postgres connection options
const db = drizzle({
  schema,
})

export default db

import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.string().optional().default('development'),
  DATABASE_PROVIDER: z.string().optional().default('sqlite'),
  DATABASE_URL: z.string().url(),
  API_PORT: z.coerce.number().optional().default(3333),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
})

export type Env = z.infer<typeof envSchema>

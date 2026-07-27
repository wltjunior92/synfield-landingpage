import { z } from 'zod'

const envSchema = z.object({
  VITE_APP_BASE_URL: z.string().optional(),
  VITE_APP_API_URL: z.string(),
  VITE_LOCAL_URL: z.string(),
  VITE_STRIPE_PUBLISHABLE_KEY: z.string(),
})

const _env = envSchema.safeParse(import.meta.env)

if (!_env.success) {
  console.error('❌Invalid environment variables', _env.error.format())

  throw new Error('❌Invalid environment variables.')
}

export const env = _env.data

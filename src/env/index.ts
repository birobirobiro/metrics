import 'dotenv/config'

import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  DEPLOY_URL: z.string().optional(),
  YOUTUBE_API_KEY: z.string(),
  GITHUB_API_KEY: z.string(),
  DISCORD_API_KEY: z.string(),
  TWITCH_CLIENT_ID: z.string(),
  TWITCH_API_KEY: z.string(),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables')
}

export const env = _env.data

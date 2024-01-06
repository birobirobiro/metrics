import { env } from '@/env'

export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path
  if (process.env.VERCEL_URL) return `http://${env.DEPLOY_URL}${path}`
  return `http://localhost:${env.PORT ?? 3333}${path}`
}

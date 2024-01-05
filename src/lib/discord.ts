import { env } from '@/env'
import axios, { AxiosError } from 'axios'
import { z } from 'zod'

export async function getDiscordGuildInfo(guildId: string) {
  try {
    const response = await axios.get(
      `https://discord.com/api/v10/guilds/${guildId}?with_counts=true`,
      {
        headers: {
          Authorization: `Bot ${env.DISCORD_API_KEY}`,
        },
      },
    )

    const data = discordDataSchema.parse(response.data)

    return data
  } catch (err: unknown) {
    if (err instanceof Error || err instanceof AxiosError) {
      return handleErrorResponse(err, guildId)
    } else {
      console.error(err)
      throw new Error('Unknown error getting guild information')
    }
  }
}

function handleErrorResponse(err: Error | AxiosError, guildId: string): string {
  if (err.message === 'Request failed with status code 404') {
    return `Guild ${guildId} not found`
  } else {
    return `Error getting guild information: ${err.message}`
  }
}

export const discordDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().nullable(),
  description: z.string().nullable(),
  owner_id: z.string(),
  approximate_member_count: z.number(),
})

export type DithubData = z.infer<typeof discordDataSchema>

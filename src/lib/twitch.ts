import { env } from '@/env'
import axios, { AxiosError } from 'axios'
import { z } from 'zod'
import { absoluteUrl } from './utils'

export async function getTwitchUserInfos(userId: string) {
  try {
    const redirectUri = absoluteUrl('/twitch')
    const auth = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${env.TWITCH_CLIENT_ID}&client_secret=${env.TWITCH_API_KEY}&grant_type=client_credentials&authorization_code=${redirectUri}`,
    )

    const code = auth.data.access_token

    const followers = await axios.get(
      `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${code}`,
          'Client-ID': env.TWITCH_CLIENT_ID,
        },
      },
    )

    const response = await axios.get(
      `https://api.twitch.tv/helix/channels?broadcaster_id=${userId}`,
      {
        headers: {
          Authorization: `Bearer ${code}`,
          'Client-ID': env.TWITCH_CLIENT_ID,
        },
      },
    )

    const data = twitchDataSchema.parse(response.data)

    return { data, followers: followers.data.total }
  } catch (err) {
    if (err instanceof Error || err instanceof AxiosError) {
      console.log(err.message)
      return `Error getting twitch user information: ${err.message}`
    } else {
      throw new Error('Unknown error getting user information')
    }
  }
}

export const twitchDataSchema = z.object({
  data: z
    .object({
      broadcaster_id: z.string(),
      broadcaster_name: z.string(),
      broadcaster_language: z.string(),
      game_name: z.string(),
      title: z.string(),
      tags: z.string().array(),
    })
    .array(),
})

export type TwitchData = z.infer<typeof twitchDataSchema>

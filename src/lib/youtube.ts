import { env } from '@/env'
import { google } from 'googleapis'
import { z } from 'zod'

const youtube = google.youtube({
  version: 'v3',
  auth: env.YOUTUBE_API_KEY,
})

export async function getYoutubeChannelInfos(channelId: string) {
  console.log('Getting channel infos for channel:', channelId)

  return new Promise((resolve, reject) => {
    youtube.channels.list(
      {
        part: ['snippet', 'statistics'],
        id: [channelId],
      },
      (err, response) => {
        if (err || !response) {
          reject(err)
          return
        }

        if (
          !response.data ||
          !response.data.pageInfo?.resultsPerPage ||
          response.data.pageInfo.resultsPerPage <= 0
        ) {
          reject(new Error('No items found'))
          return
        }

        const data = youtubeDataSchema.parse(response.data)

        resolve(data)
      },
    )
  })
}

export const youtubeDataSchema = z.object({
  pageInfo: z.object({ totalResults: z.number() }),
  items: z
    .object({
      id: z.string(),
      snippet: z.object({
        title: z.string(),
        description: z.string(),
        customUrl: z.string(),
        publishedAt: z.string(),
        thumbnails: z.object({
          default: z.object({
            url: z.string(),
            width: z.number(),
            height: z.number(),
          }),
          medium: z.object({
            url: z.string(),
            width: z.number(),
            height: z.number(),
          }),
          high: z.object({
            url: z.string(),
            width: z.number(),
            height: z.number(),
          }),
        }),
        country: z.string(),
      }),
      statistics: z.object({
        viewCount: z.string(),
        subscriberCount: z.string(),
        hiddenSubscriberCount: z.boolean(),
        videoCount: z.string(),
      }),
    })
    .array(),
})

export type YoutubeData = z.infer<typeof youtubeDataSchema>

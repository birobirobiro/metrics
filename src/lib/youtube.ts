import { env } from '@/env'
import { google } from 'googleapis'

const youtube = google.youtube({
  version: 'v3',
  auth: env.YOUTUBE_API_KEY,
})

export async function getChannelInfos(channelId: string) {
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

        resolve(response.data)
      },
    )
  })
}

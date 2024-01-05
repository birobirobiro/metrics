import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { getChannelInfos } from './lib/youtube'
import { getUserInfos } from './lib/github'
import { getGuildInfo } from './lib/discord'

export const app = fastify()

app.get(
  '/youtube/:channelId',
  async (req: FastifyRequest<{ Params: youtubeParams }>, res: FastifyReply) => {
    const channelId: string = req.params.channelId

    if (!channelId) {
      return res.status(400).send()
    }

    const data = (await getChannelInfos(channelId)) as youtubeData

    if (!data || data.pageInfo.totalResults <= 0) {
      return res
        .status(404)
        .send({ success: false, channelId, message: 'No data found' })
    }

    res.send({ success: true, data })
  },
)

app.get(
  '/github/:username',
  async (req: FastifyRequest<{ Params: githubParams }>, res: FastifyReply) => {
    const username: string = req.params.username

    if (!username) {
      return res.status(400).send()
    }

    const data = await getUserInfos(username)

    if (isGitHubData(data) === false) {
      res.status(401).send({ success: false, message: 'Unauthorized' })
    }

    if (!data || !isGitHubData(data)) {
      return res
        .status(404)
        .send({ success: false, username, message: 'No data found' })
    }

    res.send({ success: true, data })
  },
)

app.get(
  '/discord/:guildId',
  async (req: FastifyRequest<{ Params: discordParams }>, res: FastifyReply) => {
    const guildId: string = req.params.guildId

    if (!guildId) {
      return res.status(400).send()
    }

    const data = await getGuildInfo(guildId)

    if (!data || !isDiscordData(data)) {
      res
        .status(404)
        .send({ success: false, guildId, message: 'No data found' })
    }

    res.send({ success: true, data })
  },
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isGitHubData(obj: any): obj is githubData {
  if (
    obj?.message ===
    'Error getting user information: Request failed with status code 401'
  )
    return false

  return (
    typeof obj?.login === 'string' &&
    typeof obj?.id === 'number' &&
    typeof obj?.node_id === 'string' &&
    typeof obj?.url === 'string' &&
    typeof obj?.html_url === 'string' &&
    typeof obj?.followers === 'number' &&
    typeof obj?.name === 'string'
    // only important informations
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isDiscordData(obj: any): obj is discordData {
  return (
    typeof obj?.id === 'string' &&
    typeof obj?.name === 'string' &&
    typeof obj?.owner_id === 'string' &&
    typeof obj?.approximate_member_count === 'number'
  ) // only important informations
}

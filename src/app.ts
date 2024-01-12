import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { discordDataSchema, getDiscordGuildInfo } from './lib/discord'
import { getGithubUserInfos, githubDataSchema } from './lib/github'
import { getTwitchUserInfos, twitchDataSchema } from './lib/twitch'
import {
  YoutubeData,
  getYoutubeChannelInfos,
  youtubeDataSchema,
} from './lib/youtube'

export const app = fastify()

app.get(
  '/youtube/:channelId',
  async (
    req: FastifyRequest<{ Params: { channelId: string } }>,
    res: FastifyReply,
  ) => {
    const channelId: string = req.params.channelId

    if (!channelId) {
      return res.status(400).send()
    }

    const data = (await getYoutubeChannelInfos(channelId)) as YoutubeData

    if (
      !data ||
      data.pageInfo.totalResults <= 0 ||
      isYoutubeData(data) === false
    ) {
      return res
        .status(404)
        .send({ success: false, channelId, message: 'No data found' })
    }

    res.send({ success: true, data })
  },
)

app.get(
  '/github/:username',
  async (
    req: FastifyRequest<{ Params: { username: string } }>,
    res: FastifyReply,
  ) => {
    const username: string = req.params.username

    if (!username) {
      return res.status(400).send()
    }

    const data = await getGithubUserInfos(username)

    if (!data || isGithubData(data) === false) {
      return res
        .status(404)
        .send({ success: false, username, message: 'No data found' })
    }

    res.send({ success: true, data })
  },
)

app.get(
  '/discord/:guildId',
  async (
    req: FastifyRequest<{ Params: { guildId: string } }>,
    res: FastifyReply,
  ) => {
    const guildId: string = req.params.guildId

    if (!guildId) {
      return res.status(400).send()
    }

    const data = await getDiscordGuildInfo(guildId)

    if (!data || isDiscordData(data) === false) {
      res
        .status(404)
        .send({ success: false, guildId, message: 'No data found' })
    }

    res.send({ success: true, data })
  },
)

app.get(
  '/twitch/:userId',
  async (
    req: FastifyRequest<{ Params: { userId: string } }>,
    res: FastifyReply,
  ) => {
    const userId: string = req.params.userId

    if (!userId) {
      return res.status(400).send()
    }

    const info = await getTwitchUserInfos(userId)

    if (!info) {
      return res
        .status(404)
        .send({ success: false, userId, message: 'No data found' })
    }

    const data = info.data

    if (!data || isTwitchData(data) === false) {
      return res
        .status(404)
        .send({ success: false, userId, message: 'No data found' })
    }

    res.send({
      success: true,
      info: {
        ...data,
        followers: info.followers,
      },
    })
  },
)

function isYoutubeData(data: unknown) {
  const parsedData = youtubeDataSchema.safeParse(data)

  return parsedData.success
}

function isTwitchData(data: unknown) {
  const parsedData = twitchDataSchema.safeParse(data)

  return parsedData.success
}

function isGithubData(data: unknown) {
  const parsedData = githubDataSchema.safeParse(data)

  return parsedData.success
}

function isDiscordData(data: unknown) {
  const parsedData = discordDataSchema.safeParse(data)

  return parsedData.success
}

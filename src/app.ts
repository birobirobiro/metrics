import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { getChannelInfos } from './lib/youtube'

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

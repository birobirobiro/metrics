interface youtubeParams {
  channelId: string
}

interface youtubeData {
  kind: string
  etag: string
  pageInfo: { totalResults: number; resultsPerPage: number }
  items: [
    {
      kind: string
      etag: string
      id: string
      snippet: object
      statistics: object
    },
  ]
}

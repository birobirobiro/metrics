import axios, { AxiosError, AxiosResponse } from 'axios'
import { z } from 'zod'

export async function getGithubUserInfos(username: string) {
  console.log('Getting user infos for user:', username)

  try {
    const response: AxiosResponse = await axios.get(
      `https://api.github.com/users/${username}`,
    )

    const data = githubDataSchema.parse(response.data)

    return data
  } catch (err: unknown) {
    if (err instanceof Error || err instanceof AxiosError) {
      console.log(err.message)
      return `Error getting user information: ${err.message}`
    } else {
      throw new Error('Unknown error getting user information')
    }
  }
}

export const githubDataSchema = z.object({
  id: z.number(),
  avatar_url: z.string(),
  url: z.string(),
  organizations_url: z.string(),
  repos_url: z.string(),
  events_url: z.string(),
  name: z.string(),
  company: z.string().nullish(),
  blog: z.string(),
  location: z.string(),
  email: z.string().nullish(),
  hireable: z.boolean().nullish(),
  bio: z.string().nullish(),
  twitter_username: z.string().nullish(),
  public_repos: z.number().nullish(),
  followers: z.number(),
  following: z.number(),
})

export type GithubData = z.infer<typeof githubDataSchema>

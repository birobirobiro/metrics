import { env } from '@/env'
import axios, { AxiosResponse } from 'axios'

export async function getUserInfos(username: string) {
  console.log('Getting user infos for user:', username)

  try {
    const response: AxiosResponse = await axios.get(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          Authorization: `Bearer ${env.GITHUB_API_KEY}`,
        },
      },
    )

    return response.data
  } catch (err: unknown) {
    if (err instanceof Error) {
      return `Error getting user information: ${err.message}`
    } else {
      throw new Error('Unknown error getting user information')
    }
  }
}

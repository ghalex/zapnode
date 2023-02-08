
import axios, { Axios } from 'axios'

const root = 'https://dummyjson.com/'
const timeout = 4000

const ms: Axios = axios.create({
  baseURL: root,
  timeout
})

ms.interceptors.response.use(
  (response: any) => {
    if (response.status === 200) {
      return response
    }
  },
  async (error) => {
    console.log(error.message as string)
    return await Promise.reject(new Error('Axio error: '))
  }
)

export default ms

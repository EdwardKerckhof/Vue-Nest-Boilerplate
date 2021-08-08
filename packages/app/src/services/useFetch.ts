import axios, { AxiosInstance } from 'axios'
import { computed, reactive, ref } from 'vue'

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-type': 'application/json'
  }
})

interface IAxiosConfig {
  skip: boolean
  config: any
}

export const useFetch = (url: string, config: IAxiosConfig) => {
  const data = ref<Object | null>(null)
  const response = ref<Object | null>(null)
  const error = ref<null | string>(null)
  const loading = ref<null | boolean>(null)

  const fetch = async () => {
    loading.value = true

    try {
      const result = await apiClient.request({ url, ...config })
      response.value = result
      data.value = result.data
    } catch (ex) {
      error.value = ex.message
    } finally {
      loading.value = false
    }
  }

  !config.skip && fetch()

  return { data, response, error, loading, fetch }
}

const cacheMap = reactive(new Map())

export const useFetchCache = (
  key: string,
  url: string,
  config: IAxiosConfig
) => {
  config.skip = true
  const info = useFetch(url, { ...config })

  const updateCache = () => cacheMap.set(key, info.response.value)
  const clearCache = () => cacheMap.set(key, undefined)

  const fetch = async () => {
    try {
      await info.fetch()
      updateCache()
    } catch {
      clearCache()
    }
  }

  const response = computed(() => cacheMap.get(key))
  const data = computed(() => response.value?.data)

  if (response.value == undefined) fetch()

  return { ...info, fetch, data, response, clearCache }
}

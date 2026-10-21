import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)
  const token = config.cloudflareApiToken

  const targetPath = (query.path as string) || '/radar/http/summary/bot'
  const normalizedPath = targetPath.startsWith('/') ? targetPath : `/${targetPath}`
  const radarPath = normalizedPath.startsWith('/radar') ? normalizedPath : `/radar${normalizedPath}`
  const radarUrl = `https://api.cloudflare.com/client/v4${radarPath}`

  const params: Record<string, string> = {}
  for (const [key, val] of Object.entries(query)) {
    if (key !== 'path' && typeof val === 'string') {
      params[key] = val
    }
  }

  if (!params.location) {
    params.location = 'ID'
  }

  if (!token) {
    return {
      status: 'mock',
      endpoint: radarUrl,
      params,
      message: 'CLOUDFLARE_API_TOKEN is not configured in .env yet. Once provided, live responses from Cloudflare will appear here.',
      sampleEndpointsToTry: [
        '/radar/http/summary/bot?location=ID&dateRange=7d',
        '/radar/http/summary/device_type?location=ID&dateRange=7d',
        '/radar/http/summary/http_version?location=ID&dateRange=7d',
        '/radar/http/summary/tls_version?location=ID&dateRange=7d',
        '/radar/attacks/layer3/summary?location=ID&dateRange=7d',
        '/radar/quality/speed/summary?location=ID&dateRange=7d'
      ]
    }
  }

  try {
    const data = await $fetch(radarUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    })

    return {
      status: 'success',
      endpoint: radarUrl,
      params,
      data
    }
  }
  catch (err: unknown) {
    const error = err as { statusCode?: number, data?: unknown, message?: string }
    return {
      status: 'error',
      endpoint: radarUrl,
      params,
      statusCode: error.statusCode || 500,
      error: error.data || error.message
    }
  }
})


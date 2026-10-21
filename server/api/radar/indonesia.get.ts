import { defineEventHandler, getQuery } from 'h3'
import type { IndonesiaRadarResponse } from '../../../types/radar'

export default defineEventHandler<Promise<IndonesiaRadarResponse>>(async (event): Promise<IndonesiaRadarResponse> => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)
  const token = config.cloudflareApiToken

  // If token is available, attempt to fetch live Indonesia data from Cloudflare Radar
  if (token) {
    try {
      const response = await $fetch<Record<string, unknown>>('https://api.cloudflare.com/client/v4/radar/http/summary/bot', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          location: 'ID',
          dateRange: query.dateRange || '7d'
        }
      })

      return {
        source: 'live',
        location: 'ID',
        countryName: 'Indonesia',
        timestamp: new Date().toISOString(),
        data: response
      }
    }
    catch (err: unknown) {
      const error = err as { statusCode?: number, message?: string }
      return {
        source: 'error',
        location: 'ID',
        message: error.message || 'Failed to fetch from Cloudflare Radar API',
        statusCode: error.statusCode || 500,
        tip: 'Please check your CLOUDFLARE_API_TOKEN in .env'
      }
    }
  }

  // Fallback demo/mock data for initial development without API key
  return {
    source: 'mock',
    location: 'ID',
    countryName: 'Indonesia',
    timestamp: new Date().toISOString(),
    metrics: {
      humanTrafficPercentage: 68.4,
      botTrafficPercentage: 31.6,
      ipv6AdoptionPercentage: 27.5,
      mobileTrafficPercentage: 74.2,
      desktopTrafficPercentage: 25.8,
      topProtocols: [
        { protocol: 'HTTP/2', percentage: 58.2 },
        { protocol: 'HTTP/3 (QUIC)', percentage: 34.1 },
        { protocol: 'HTTP/1.1', percentage: 7.7 }
      ],
      majorIsps: [
        { asn: 'AS7713', name: 'Telkom Indonesia', share: 42.1 },
        { asn: 'AS24203', name: 'Indosat Ooredoo Hutchison', share: 21.4 },
        { asn: 'AS9272', name: 'XL Axiata', share: 14.8 },
        { asn: 'AS17974', name: 'PT Smartfren Telecom', share: 8.5 },
        { asn: 'AS23947', name: 'MNC Play / MNC Kabel', share: 4.2 }
      ]
    },
    message: 'Displaying simulated baseline data. Set CLOUDFLARE_API_TOKEN in .env to connect live.'
  }
})

export interface IndonesiaRadarMetrics {
  humanTrafficPercentage: number
  botTrafficPercentage: number
  ipv6AdoptionPercentage: number
  mobileTrafficPercentage: number
  desktopTrafficPercentage: number
  topProtocols: Array<{ protocol: string, percentage: number }>
  majorIsps: Array<{ asn: string, name: string, share: number }>
}

export interface IndonesiaRadarResponse {
  source: 'live' | 'mock' | 'error'
  location: string
  countryName?: string
  timestamp?: string
  metrics?: IndonesiaRadarMetrics
  data?: Record<string, unknown>
  message?: string
  statusCode?: number
  tip?: string
}


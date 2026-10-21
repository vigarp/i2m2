import { describe, expect, it } from 'vitest'
import handler from '../../server/api/radar/indonesia.get'

describe('server/api/radar/indonesia endpoint', () => {
  it('returns mock data when no token is configured', async () => {
    // Create mock H3 event
    const mockEvent = {
      context: {},
      node: {
        req: { url: '/api/radar/indonesia', headers: {} },
        res: {}
      }
    }

    // Call event handler
    // @ts-expect-error test event simulation
    const res = await handler(mockEvent)
    expect(res).toBeDefined()
    expect(res.location).toBe('ID')
    expect(res.metrics).toBeDefined()
    expect(res.metrics.humanTrafficPercentage).toBeGreaterThan(0)
  })
})


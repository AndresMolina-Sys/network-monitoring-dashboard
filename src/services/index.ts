import { createMockNetworkMonitoringService } from './mock-network-monitoring-service'
import type { NetworkMonitoringService } from './network-monitoring-service'

type MockDemoMode = 'normal' | 'empty' | 'error' | 'slow'

const mockDemoMode = getMockDemoMode()

export const networkMonitoringService: NetworkMonitoringService =
  createMockNetworkMonitoringService({
    latencyMs: mockDemoMode === 'slow' ? 2000 : undefined,
    nodes: mockDemoMode === 'empty' ? [] : undefined,
    shouldFail: () => mockDemoMode === 'error',
  })

function getMockDemoMode(): MockDemoMode {
  if (!import.meta.env.DEV) {
    return 'normal'
  }

  const value = new URLSearchParams(window.location.search).get('demo')

  if (value === 'empty' || value === 'error' || value === 'slow') {
    return value
  }

  return 'normal'
}

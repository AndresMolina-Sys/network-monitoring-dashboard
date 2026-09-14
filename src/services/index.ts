import { createMockNetworkMonitoringService } from './mock-network-monitoring-service'
import type { NetworkMonitoringService } from './network-monitoring-service'

export const networkMonitoringService: NetworkMonitoringService =
  createMockNetworkMonitoringService()

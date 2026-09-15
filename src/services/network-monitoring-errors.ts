export class NetworkNodeNotFoundError extends Error {
  readonly nodeId: string

  constructor(nodeId: string) {
    super(`Network node "${nodeId}" was not found`)
    this.name = 'NetworkNodeNotFoundError'
    this.nodeId = nodeId
  }
}

export class NetworkRequestError extends Error {
  constructor(message = 'Unable to load network data') {
    super(message)
    this.name = 'NetworkRequestError'
  }
}

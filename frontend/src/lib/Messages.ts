export function getConnectionToServerFailureMessage(action: string): string {
  return `Failed to ${action} because unable to connect to the server. It might be because you are offline or the server is down.`;
}
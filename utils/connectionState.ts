export function getConnectionState({
  sent,
  received,
  connected,
}: {
  sent?: boolean;
  received?: boolean;
  connected?: boolean;
}) {
  if (connected) return "connected";
  if (received) return "respond";
  if (sent) return "pending";
  return "connect";
}
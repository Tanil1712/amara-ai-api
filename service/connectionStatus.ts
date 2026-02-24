export type ConnectionState =
  | "none"
  | "pending"
  | "connected"
  | "incoming";
export function resolveConnectionState(
  myUid: string,
  studentUid: string,
  requests: any[],
  connections: any[]
): ConnectionState {
  const connected = connections.some(
    c => c.users.includes(myUid) && c.users.includes(studentUid)
  );
  if (connected) return "connected";
  const outgoing = requests.find(
    r => r.from === myUid && r.to === studentUid
  );
  if (outgoing) return "pending";
  const incoming = requests.find(
    r => r.from === studentUid && r.to === myUid
  );
  if (incoming) return "incoming";
  return "none";
}
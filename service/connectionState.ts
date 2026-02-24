import { db } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
/**
* Listens to connection state between me and another user
*/
export function listenToConnectionState(
  myUid: string,
  otherUid: string,
  callback: (state: "none" | "sent" | "received" | "connected") => void
) {
  const sentRef = doc(db, "connections", myUid, "sent", otherUid);
  const receivedRef = doc(db, "connections", myUid, "received", otherUid);
  const connectedRef = doc(db, "connections", myUid, "connected", otherUid);
  const unsubSent = onSnapshot(sentRef, (snap) => {
    if (snap.exists()) callback("sent");
  });
  const unsubReceived = onSnapshot(receivedRef, (snap) => {
    if (snap.exists()) callback("received");
  });
  const unsubConnected = onSnapshot(connectedRef, (snap) => {
    if (snap.exists()) callback("connected");
  });
  return () => {
    unsubSent();
    unsubReceived();
    unsubConnected();
  };
}
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
export function useConnectionStatus(myUid: string) {
  const [requests, setRequests] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  useEffect(() => {
    if (!myUid) return;
    const q1 = query(
      collection(db, "requests"),
      where("participants", "array-contains", myUid)
    );
    const q2 = query(
      collection(db, "connections"),
      where("users", "array-contains", myUid)
    );
    const unsub1 = onSnapshot(q1, s =>
      setRequests(s.docs.map(d => d.data()))
    );
    const unsub2 = onSnapshot(q2, s =>
      setConnections(s.docs.map(d => d.data()))
    );
    return () => {
      unsub1();
      unsub2();
    };
  }, [myUid]);
  return { requests, connections };
}
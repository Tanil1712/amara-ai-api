import { db } from "../lib/firebase";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
export async function sendRequest(fromUid: string, toUid: string) {
  await setDoc(doc(db, "connections", fromUid, "sent", toUid), {
    status: "pending",
    createdAt: serverTimestamp(),
  });
  await setDoc(doc(db, "connections", toUid, "received", fromUid), {
    status: "pending",
    createdAt: serverTimestamp(),
  });
}
export async function acceptRequest(myUid: string, otherUid: string) {
  await setDoc(doc(db, "connections", myUid, "connected", otherUid), {
    connectedAt: serverTimestamp(),
  });
  await setDoc(doc(db, "connections", otherUid, "connected", myUid), {
    connectedAt: serverTimestamp(),
  });
  await deleteDoc(doc(db, "connections", myUid, "received", otherUid));
  await deleteDoc(doc(db, "connections", otherUid, "sent", myUid));
}
export async function rejectRequest(myUid: string, otherUid: string) {
  await deleteDoc(doc(db, "connections", myUid, "received", otherUid));
  await deleteDoc(doc(db, "connections", otherUid, "sent", myUid));
}
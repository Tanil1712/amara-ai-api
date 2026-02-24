import {
  addDoc,
  collection,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../lib/firebase";
export const sendConnectionRequest = async (
  from: string,
  to: string
) => {
  await addDoc(collection(db, "connectionRequests"), {
    from,
    to,
    status: "pending",
    createdAt: serverTimestamp(),
  });
};
export const acceptRequest = async (
  requestId: string,
  from: string,
  to: string
) => {
  await addDoc(collection(db, "connections"), {
    users: [from, to],
    createdAt: serverTimestamp(),
  });
  await deleteDoc(doc(db, "connectionRequests", requestId));
};
export const ignoreRequest = async (requestId: string) => {
  await deleteDoc(doc(db, "connectionRequests", requestId));
};
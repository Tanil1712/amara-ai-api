import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
export async function signUp(email: string, password: string, profileData: any) {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", res.user.uid), {
    uid: res.user.uid,
    email,
    ...profileData,
    createdAt: Date.now(),
  });
  return res.user;
}
export async function login(email: string, password: string) {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
}
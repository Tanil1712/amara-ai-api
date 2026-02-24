import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
export async function createStudentProfile(user: any) {
  const ref = doc(db, "students", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      name: user.displayName || "New Student",
      email: user.email,
      role: "student",
      subjects: [],
      bio: "This is my student profile",
      createdAt: serverTimestamp(),
    });
  }
}
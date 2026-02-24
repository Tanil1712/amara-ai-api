import { db } from "./firebase";
import { addDoc, collection } from "firebase/firestore";
/* ➕ CREATE POST */
export async function createPost(post: any) {
  await addDoc(collection(db, "posts"), {
    ...post,
    createdAt: Date.now(),
  });
}
/* ➕ ADD HOMEWORK */
export async function addHomework(homework: any) {
  await addDoc(collection(db, "homework"), {
    ...homework,
    createdAt: Date.now(),
  });
}
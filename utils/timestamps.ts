import { serverTimestamp } from "firebase/firestore";
export function createTimestamps() {
  return {
    createdAtClient: Date.now(),   // instant, never undefined
    createdAtServer: serverTimestamp(), // backend truth
  };
}

import { IntentType } from "./intents";

/**
* Simple in-memory store (per session)
*/
let memoryStore: {
  lastIntent?: IntentType;
  lastTopic?: string;
} = {};

export function getMemory() {
  return memoryStore;
}

export function updateMemory(intent: IntentType, text: string) {
  memoryStore.lastIntent = intent;
  memoryStore.lastTopic = text;
}

export function clearMemory() {
  memoryStore = {};
}

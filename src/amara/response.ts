import { DetectedIntent } from "./intents";
import { updateMemory } from "./memory";

/* ===============================
   Response banks
================================ */

const GREETING_RESPONSES = [
  "Hey 👋 How’s your studying going?",
  "Hi! Ready to learn something new today?",
  "Hello! What can I help you with?",
];

const STUDY_TIPS_RESPONSES = [
  "Try studying in 25-minute sessions with short breaks.",
  "Past exam papers are one of the best ways to revise.",
  "Explaining a topic to someone else helps you remember it better.",
];

const DISCOVER_RESPONSES = [
  "I can help you find students to study with.",
  "Let’s connect you with classmates in your subjects.",
];

const UNKNOWN_RESPONSES = [
  "I’m not sure I understand yet. Can you explain a bit more?",
  "Hmm 🤔 can you rephrase that?",
];

/* ===============================
   Main response generator
================================ */

export function generateResponse(
  detectedIntent: DetectedIntent,
  originalText: string
): string {
  const { intent, subject, confidence } = detectedIntent;

  // Store memory
  updateMemory(intent, originalText);

  // Low confidence fallback
  if (confidence < 0.5) {
    return "I’m not fully sure I understood. Can you explain a bit more?";
  }

  switch (intent) {
    case "GREETING":
      return pick(GREETING_RESPONSES);

    case "HOMEWORK_HELP":
      if (subject) {
        return `I see you need help with ${subject}. What topic or question are you working on?`;
      }
      return "Which subject is your homework for?";

    case "STUDY_TIPS":
      return pick(STUDY_TIPS_RESPONSES);

    case "DISCOVER_HELP":
      return pick(DISCOVER_RESPONSES);

    case "UNKNOWN":
    default:
      return pick(UNKNOWN_RESPONSES);
  }
}

/* ===============================
   Utility
================================ */

function pick(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)];
}


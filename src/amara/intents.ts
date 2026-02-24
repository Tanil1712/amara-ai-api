export type IntentType =
  | "GREETING"
  | "HOMEWORK_HELP"
  | "STUDY_TIPS"
  | "DISCOVER_HELP"
  | "UNKNOWN";

export interface DetectedIntent {
  intent: IntentType;
  subject?: string;
  confidence: number;
}

export function detectIntent(text: string): DetectedIntent {
  const lower = text.toLowerCase();

  // GREETING (more strict)
  if (/^(hi|hello|hey)\b/.test(lower)) {
    return { intent: "GREETING", confidence: 0.9 };
  }

  // HOMEWORK HELP + SUBJECT DETECTION
  if (lower.includes("homework") || lower.includes("assignment")) {
    const subject = detectSubject(lower);
    return {
      intent: "HOMEWORK_HELP",
      subject,
      confidence: 0.85,
    };
  }

  // STUDY TIPS
  if (
    lower.includes("study") ||
    lower.includes("revise") ||
    lower.includes("revision")
  ) {
    return { intent: "STUDY_TIPS", confidence: 0.75 };
  }

  // DISCOVER / FIND STUDY GROUPS
  if (
    lower.includes("find students") ||
    lower.includes("study group") ||
    lower.includes("discover students")
  ) {
    return { intent: "DISCOVER_HELP", confidence: 0.7 };
  }

  return { intent: "UNKNOWN", confidence: 0.3 };
}

/* ===============================
   Helper: subject detection
================================ */

function detectSubject(text: string): string | undefined {
  if (text.includes("math")) return "Math";
  if (text.includes("physics")) return "Physics";
  if (text.includes("chemistry")) return "Chemistry";
  if (text.includes("biology")) return "Biology";
  if (text.includes("computer")) return "Computer Science";
  return undefined;
}

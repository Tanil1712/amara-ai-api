
import { detectIntent, DetectedIntent } from "./intents";
import { generateResponse } from "./response";
import { getMemory } from "./memory";

/**
* Process a user message through Amara AI
* Beta mode: Experimental AI assistant
*
* Input:
* - userText: string typed by user
* - context: AmaraContext (optional memory of last interaction)
*
* Returns a string response
*/
export function processAmaraMessage(
  userText: string,
  context: any
): string {
  // Beta mode: logs for debugging
  console.log("[Amara Beta] Processing message:", userText);
  console.log("[Amara Beta] Context:", context);

  // Step 1: Detect intent
  const detectedIntent: DetectedIntent = detectIntent(userText);

  // Step 2: Generate response
  const response = generateResponse(detectedIntent, userText);

  // Optional: You can extend beta to log analytics, memory, etc.
  console.log("[Amara Beta] Response generated:", response);

  return response;
}

// ✅ Exporting so AmaraSheet can import without errors
export default processAmaraMessage;
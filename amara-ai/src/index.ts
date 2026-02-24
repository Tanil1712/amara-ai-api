export interface Env {
  GEMINI_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Only POST allowed", { status: 405 });
    }

    try {
      // ✅ safely type the body
      const body = (await request.json()) as {
        prompt: string;
        context?: string;
      };

      const prompt = body.prompt;
      const context = body.context ?? "";

      if (!prompt) {
        return new Response(
          JSON.stringify({ error: "Prompt is required" }),
          { status: 400 }
        );
      }

      const geminiResponse = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
          env.GEMINI_API_KEY,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: context + "\n\n" + prompt }],
              },
            ],
          }),
        }
      );

      const data = (await geminiResponse.json()) as any;

      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "No response from Amara AI";

      return new Response(
        JSON.stringify({ reply: text }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error: any) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }
  },
};
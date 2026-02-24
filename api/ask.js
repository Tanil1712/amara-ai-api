
import OpenAI from "openai";

export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" });
}

try {
const { message, context, mode } = req.body;

if (!message) {
return res.status(400).json({ error: "No message provided" });
}

const openai = new OpenAI({
apiKey: process.env.OPENAI_KEY,
});

let systemPrompt = "";

if (mode === "step_by_step") {
systemPrompt = `
You are Amara, a patient and intelligent school teacher.

Rules:
- Teach step by step.
- Show formulas clearly.
- Explain reasoning.
- Give examples when useful.
- Make it easy for secondary school students.
- Be structured and neat.
`;
} else {
systemPrompt = `
You are Amara, a helpful school assistant.
Give clear and correct academic answers.
`;
}

const response = await openai.responses.create({
model: "gpt-4o-mini",
input: [
{
role: "system",
content: systemPrompt,
},
{
role: "user",
content: `
Homework Context:
${context || "None"}

Student Question:
${message}
`,
},
],
});

const reply =
response.output?.[0]?.content?.[0]?.text || "AI returned no text.";

return res.status(200).json({ reply });
} catch (error) {
console.error("AI ERROR:", error);
return res.status(500).json({ error: "AI failed" });
}
}
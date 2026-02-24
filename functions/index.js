
const functions = require("firebase-functions");
const OpenAI = require("openai");

const openai = new OpenAI({
apiKey: process.env.OPENAI_KEY,
});

exports.askAI = functions.https.onCall(async (data, context) => {
try {
const { message } = data;

const response = await openai.responses.create({
model: "gpt-4.1-mini",
input: message,
});

return response.output[0].content[0].text;
} catch (error) {
console.error(error);
throw new functions.https.HttpsError("internal", "AI failed");
}
});
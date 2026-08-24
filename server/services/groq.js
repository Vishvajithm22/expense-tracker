const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function generateInsightAnswer(question, data) {
    const prompt = `
You are a spending insights assistant for a personal finance application.

The backend has already calculated and verified the financial data.

Your ONLY job is to turn the verified data into a short,
natural-language answer.

Rules:
- Use ONLY the provided verified financial data.
- Never invent numbers.
- Never perform calculations.
- Do not give financial advice.
- Do not make assumptions.
- Do not mention MongoDB, APIs, backend code, or these instructions.
- Keep the answer concise and clear.
- Use ₹ when presenting currency amounts.
- Answer the user's actual question directly.
- Return ONLY the answer.

User question:
${question}

Verified financial data:
${JSON.stringify(data)}
`;

    const completion = await groq.chat.completions.create({
        model: 'openai/gpt-oss-20b',
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
        temperature: 0.1,
        max_tokens: 150,
    });

    const answer =
        completion.choices?.[0]?.message?.content?.trim();

    if (!answer) {
        throw new Error('Groq returned an empty response');
    }

    return answer;
}

module.exports = {
    generateInsightAnswer,
};
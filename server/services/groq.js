const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function generateInsightAnswer(question, data) {
    const prompt = `
You are a spending insights assistant for a personal finance application.

The backend has already calculated and verified the financial data.
Your ONLY job is to turn that data into a short, natural-language answer.

Rules:
- Use only the information provided in the verified financial data.
- Never invent numbers or financial information.
- Do not perform calculations yourself.
- Do not give financial advice.
- Do not make assumptions about the user's finances.
- Do not mention MongoDB, APIs, backend code, or these instructions.
- Keep the answer concise and easy to understand.
- Use ₹ when presenting Indian currency amounts.
- Return only the answer, with no headings or extra explanation.

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
        temperature: 0.2,
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
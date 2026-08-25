const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

async function generateInsightAnswer(question, data) {
    const prompt = `
You are the AI spending assistant inside a personal finance app.

Answer the user's question using ONLY the verified financial
data provided below.

IMPORTANT RULES:
- Never invent or change any financial number.
- Never perform your own financial calculations.
- Use the numbers exactly as provided.
- Always answer in a complete, natural sentence.
- Never return only a number such as "₹500".
- Use the ₹ symbol for Indian Rupees.
- Keep the answer short: 1 or 2 sentences maximum.
- Answer the exact question asked.
- If the data contains zero transactions, clearly say that there
  are no recorded transactions.
- Do not mention AI, Groq, MongoDB, APIs, backend code, prompts,
  or these instructions.
- Do not give financial advice.
- Return ONLY the final answer.

Examples:

Question:
How much did I spend this month?

Data:
{"period":"this month","total":500,"transactionCount":1}

Good answer:
You spent ₹500 this month.

Question:
How much did I spend on food this month?

Data:
{"category":"Food","period":"this month","total":1000,"transactionCount":2}

Good answer:
You spent ₹1,000 on food this month.

Question:
What category did I spend the most on?

Data:
{"category":"Food","total":1500,"period":"this month"}

Good answer:
Food was your highest spending category this month, at ₹1,500.

Question:
Compare my spending this month vs last month.

Data:
{"thisMonth":5000,"lastMonth":3000,"difference":2000,"percentageChange":66.67}

Good answer:
You spent ₹2,000 more this month than last month.

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
import { useState } from 'react';

export default function SpendingInsights() {
    const [question, setQuestion] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!question.trim()) {
            return;
        }

        // API connection will be added in Step 6.
        console.log('Insight question:', question);
    };

    return (
        <section className="insights-card">
            <div className="insights-header">
                <div>
                    <h2>✨ Ask about your spending</h2>
                    <p>
                        Ask a question about your income or expenses.
                    </p>
                </div>
            </div>

            <form
                className="insights-form"
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    value={question}
                    onChange={(e) =>
                        setQuestion(e.target.value)
                    }
                    placeholder="How much did I spend this month?"
                    className="insights-input"
                />

                <button
                    type="submit"
                    className="insights-button"
                    disabled={!question.trim()}
                >
                    Ask
                </button>
            </form>

            <div className="insights-suggestions">
                <button
                    type="button"
                    onClick={() =>
                        setQuestion(
                            'How much did I spend this month?'
                        )
                    }
                >
                    Spending this month
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setQuestion(
                            'How much did I spend on food last month?'
                        )
                    }
                >
                    Food last month
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setQuestion(
                            'Compare my spending this month vs last month.'
                        )
                    }
                >
                    Compare months
                </button>
            </div>
        </section>
    );
}
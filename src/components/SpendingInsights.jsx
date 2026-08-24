import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API;

function createFallbackAnswer(data) {
    if (!data) {
        return 'No spending data is available.';
    }

    // Comparison with no spending in either month
    if (
        data.thisMonth === 0 &&
        data.lastMonth === 0
    ) {
        return 'You had no recorded spending this month or last month.';
    }

    // Spending period with no transactions
    if (
        data.period === 'this month' &&
        data.total === 0 &&
        data.transactionCount === 0
    ) {
        return "You haven't recorded any spending this month.";
    }

    if (
        data.period === 'last month' &&
        data.total === 0 &&
        data.transactionCount === 0
    ) {
        return "You haven't recorded any spending last month.";
    }

    // Income with no transactions
    if (
        data.period === 'this month' &&
        data.total === 0 &&
        data.transactionCount === 0
    ) {
        return "You haven't recorded any income this month.";
    }

    return 'Your spending data is available, but an AI summary could not be generated.';
}

export default function SpendingInsights() {
    const { authHeader } = useAuth();

    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedQuestion = question.trim();

        if (!trimmedQuestion || loading) {
            return;
        }

        setLoading(true);
        setError('');
        setAnswer('');
        setData(null);

        try {
            const res = await axios.post(
                `${API}/insights/ask`,
                {
                    question: trimmedQuestion,
                },
                authHeader()
            );

            const responseData = res.data.data || null;

            setData(responseData);

            if (res.data.answer) {
                setAnswer(res.data.answer);
            } else {
                setAnswer(
                    createFallbackAnswer(responseData)
                );
            }
        } catch (err) {
            console.error(
                'Insight request failed:',
                err
            );

            setError(
                err.response?.data?.msg ||
                'Unable to get your spending insight. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const setSuggestedQuestion = (value) => {
        setQuestion(value);
        setAnswer('');
        setData(null);
        setError('');
    };

    return (
        <section className="insights-card">
            <div className="insights-header">
                <div>
                    <h2>
                        ✨ Ask about your spending
                    </h2>

                    <p>
                        Ask a question about your income
                        or expenses.
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
                    disabled={loading}
                />

                <button
                    type="submit"
                    className="insights-button"
                    disabled={
                        !question.trim() || loading
                    }
                >
                    {loading
                        ? 'Thinking...'
                        : 'Ask'}
                </button>
            </form>

            <div className="insights-suggestions">
                <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                        setSuggestedQuestion(
                            'How much did I spend this month?'
                        )
                    }
                >
                    Spending this month
                </button>

                <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                        setSuggestedQuestion(
                            'How much did I spend on food last month?'
                        )
                    }
                >
                    Food last month
                </button>

                <button
                    type="button"
                    disabled={loading}
                    onClick={() =>
                        setSuggestedQuestion(
                            'Compare my spending this month vs last month.'
                        )
                    }
                >
                    Compare months
                </button>
            </div>

            {loading && (
                <div className="insights-loading">
                    Analyzing your spending...
                </div>
            )}

            {error && (
                <div className="insights-error">
                    {error}
                </div>
            )}

            {!loading &&
                !error &&
                answer && (
                    <div className="insights-answer">
                        <div className="insights-answer-label">
                            AI Insight
                        </div>

                        <p>{answer}</p>
                    </div>
                )}
        </section>
    );
}
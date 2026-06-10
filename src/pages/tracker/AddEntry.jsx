import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:5000/api';
const CATEGORIES = [
    'Food', 'Housing', 'Transport', 'Bills',
    'Health', 'Entertainment', 'Salary', 'Freelance', 'Other'
];

export default function AddEntry() {
    const { authHeader } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [category, setCategory] = useState('Food');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(
                `${API}/transactions`,
                { title, amount: Number(amount), type, category },
                authHeader()
            );
            setSuccess(true);
            setTitle(''); setAmount(''); setType('expense'); setCategory('Food');
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tracker-page">
            <div className="tracker-page-header">
                <h2>Add Entry</h2>
                <p className="su-sub">Record a new income or expense</p>
            </div>

            {success && (
                <div className="su-msg">
                    ✅ Transaction added! &nbsp;
                    <span
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => navigate('/')}
                    >
                        View on Dashboard →
                    </span>
                </div>
            )}

            <div className="add-entry-card">
                <form className="tx-form" onSubmit={handleSubmit}>
                    <h3>New Transaction</h3>

                    <div>
                        <label className="field-label">Title</label>
                        <input
                            placeholder="e.g. Rent, Salary, Groceries"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="field-label">Amount (₹)</label>
                        <input
                            type="number" min="1"
                            placeholder="0.00"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="field-label">Type</label>
                        <div className="type-toggle">
                            <button
                                type="button"
                                className={type === 'expense' ? 'active expense' : ''}
                                onClick={() => setType('expense')}
                            >
                                💸 Expense
                            </button>
                            <button
                                type="button"
                                className={type === 'income' ? 'active income' : ''}
                                onClick={() => setType('income')}
                            >
                                💰 Income
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="field-label">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)}>
                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Transaction'}
                    </button>
                </form>
            </div>
        </div>
    );
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API = process.env.REACT_APP_API;
const CATEGORIES = [
    'Food', 'Housing', 'Transport', 'Bills',
    'Health', 'Entertainment', 'Salary', 'Freelance', 'Other'
];

const TIPS = [
    { icon: '💡', text: 'Add income entries like salary, freelance, or bonuses to track your total earnings.' },
    { icon: '📊', text: 'Use categories consistently — it makes your Charts page more useful.' },
    { icon: '📋', text: 'Added by mistake? Go to History to delete any transaction.' },
    { icon: '💾', text: 'All entries sync to the cloud instantly — safe even if you close the tab.' },
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
                <div className="su-msg" style={{ marginBottom: '1rem' }}>
                    ✅ Transaction added! &nbsp;
                    <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/')}>
                        View on Dashboard →
                    </span>
                </div>
            )}

            {/* Two column layout */}
            <div className="add-entry-layout">

                {/* Left — form */}
                <div className="add-entry-card">
                    <form className="tx-form" onSubmit={handleSubmit}>
                        <h3>New Transaction</h3>

                        <div>
                            <label className="field-label">Title</label>
                            <input placeholder="e.g. Rent, Salary, Groceries"
                                value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>

                        <div>
                            <label className="field-label">Amount (₹)</label>
                            <input type="number" min="1" placeholder="0.00"
                                value={amount} onChange={e => setAmount(e.target.value)} required />
                        </div>

                        <div>
                            <label className="field-label">Type</label>
                            <div className="type-toggle">
                                <button type="button"
                                    className={type === 'expense' ? 'active expense' : ''}
                                    onClick={() => setType('expense')}>💸 Expense</button>
                                <button type="button"
                                    className={type === 'income' ? 'active income' : ''}
                                    onClick={() => setType('income')}>💰 Income</button>
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

                {/* Right — tips panel */}
                <div className="add-entry-tips">
                    <h3 className="tips-title">Quick tips</h3>
                    {TIPS.map((tip, i) => (
                        <div key={i} className="tip-card">
                            <span className="tip-icon">{tip.icon}</span>
                            <p>{tip.text}</p>
                        </div>
                    ))}

                    <div className="tip-shortcut">
                        <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '8px' }}>Quick navigate</p>
                        <button className="shortcut-btn" onClick={() => navigate('/')}>🏠 Dashboard</button>
                        <button className="shortcut-btn" onClick={() => navigate('/history')}>📋 View History</button>
                        <button className="shortcut-btn" onClick={() => navigate('/charts')}>📊 See Charts</button>
                    </div>
                </div>

            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API = process.env.REACT_APP_API;

export default function GroupDetail() {
    const { id } = useParams();
    const { authHeader, user } = useAuth();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('expenses');
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [email, setEmail] = useState('');
    const [adding, setAdding] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => { fetchGroup(); }, [id]);

    const fetchGroup = async () => {
        try {
            const res = await axios.get(`${API}/groups/${id}`, authHeader());
            setGroup(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const addExpense = async (e) => {
        e.preventDefault();
        setAdding(true);
        try {
            const res = await axios.post(`${API}/groups/${id}/expenses`, { title, amount }, authHeader());
            setGroup(res.data);
            setTitle(''); setAmount('');
            setMsg('Expense added!');
            setTimeout(() => setMsg(''), 2000);
        } catch (err) {
            setMsg(err.response?.data?.msg || 'Failed');
        } finally { setAdding(false); }
    };

    const addMember = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API}/groups/${id}/members`, { email }, authHeader());
            setGroup(res.data);
            setEmail('');
            setMsg('Member added!');
            setTimeout(() => setMsg(''), 2000);
        } catch (err) {
            setMsg(err.response?.data?.msg || 'User not found');
        }
    };

    if (loading) return <div className="su-page"><p className="empty">Loading...</p></div>;
    if (!group) return <div className="su-page"><p className="empty">Group not found</p></div>;

    return (
        <div className="su-page">
            <div className="su-header">
                <div>
                    <button className="su-back-btn" onClick={() => navigate('/groups')}>← Back to groups</button>
                    <h2 className="su-title">{group.name}</h2>
                    <p className="su-sub">{group.members?.length} members · {group.expenses?.length} expenses</p>
                </div>
                <button className="su-btn-primary" onClick={() => navigate('/balances')}>
                    ⚖️ Balances
                </button>
            </div>

            {msg && <div className="su-msg">{msg}</div>}

            <div className="su-tabs">
                <button className={`su-tab ${tab === 'expenses' ? 'active' : ''}`} onClick={() => setTab('expenses')}>
                    Expenses ({group.expenses?.length})
                </button>
                <button className={`su-tab ${tab === 'members' ? 'active' : ''}`} onClick={() => setTab('members')}>
                    Members ({group.members?.length})
                </button>
            </div>

            {tab === 'expenses' && (
                <>
                    <form className="su-card su-form" onSubmit={addExpense}>
                        <h3>Add expense</h3>
                        <input placeholder="What was it for? (e.g. Hotel, Dinner)" value={title} onChange={e => setTitle(e.target.value)} required />
                        <input type="number" placeholder="Amount (₹)" value={amount} onChange={e => setAmount(e.target.value)} min="1" required />
                        <p className="su-hint">
                            Split equally among {group.members?.length} members
                            {amount ? ` — ₹${(amount / group.members?.length).toFixed(0)} each` : ''}
                        </p>
                        <button type="submit" className="su-btn-primary" disabled={adding}>
                            {adding ? 'Adding...' : 'Add Expense'}
                        </button>
                    </form>

                    {group.expenses?.length === 0 ? (
                        <p className="empty">No expenses yet. Add the first one!</p>
                    ) : (
                        <div className="su-expense-list">
                            {[...group.expenses].reverse().map(exp => (
                                <div key={exp._id} className="su-expense-item">
                                    <div className="su-expense-info">
                                        <span className="su-expense-title">{exp.title}</span>
                                        <span className="su-expense-meta">
                                            Paid by {exp.paidBy?.name} · {new Date(exp.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="su-expense-amount">
                                        ₹{exp.amount?.toLocaleString()}
                                        <span className="su-expense-share">
                                            ₹{(exp.amount / (exp.splitAmong?.length || 1)).toFixed(0)} each
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {tab === 'members' && (
                <>
                    <form className="su-card su-form" onSubmit={addMember}>
                        <h3>Add member by email</h3>
                        <input type="email" placeholder="their@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                        <p className="su-hint">They must already have a FinHub account</p>
                        <button type="submit" className="su-btn-primary">Add Member</button>
                    </form>

                    <div className="su-member-list">
                        {group.members?.map(member => (
                            <div key={member._id} className="su-member-item">
                                <div className="su-member-avatar">{member.name?.[0]?.toUpperCase()}</div>
                                <div>
                                    <div className="su-member-name">
                                        {member.name} {(member._id === user?.id || member.id === user?.id) ? '(you)' : ''}
                                    </div>
                                    <div className="su-member-email">{member.email}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

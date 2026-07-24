import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API = process.env.REACT_APP_API;

export default function History() {
    const { authHeader } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        try {
            const res = await axios.get(`${API}/transactions`, authHeader());
            setTransactions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteTransaction = async (id) => {
        try {
            await axios.delete(`${API}/transactions/${id}`, authHeader());
            setTransactions(prev => prev.filter(t => t._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const filtered = transactions
        .filter(t => filter === 'all' || t.type === filter)
        .filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

    if (loading) return <div className="tracker-page"><p className="empty">Loading...</p></div>;

    return (
        <div className="tracker-page">
            <div className="tracker-page-header">
                <h2>History</h2>
                <p className="su-sub">{transactions.length} total transactions</p>
            </div>

            {/* Search + filter */}
            <div className="history-controls">
                <input
                    className="history-search"
                    placeholder="🔍 Search transactions..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <div className="filter-bar">
                    {['all', 'income', 'expense'].map(f => (
                        <button
                            key={f}
                            className={`filter-btn ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <p className="empty">No transactions found.</p>
            ) : (
                <div className="list-section">
                    <ul className="tx-list">
                        {filtered.map(tx => (
                            <li key={tx._id} className={`tx-item ${tx.type}`}>
                                <div className="tx-info">
                                    <span className="tx-title">{tx.title}</span>
                                    <span className="tx-category">
                                        {tx.category} · {new Date(tx.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="tx-right">
                                    <span className="tx-amount">
                                        {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                    </span>
                                    <button className="delete-btn" onClick={() => deleteTransaction(tx._id)}>✕</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import BalanceSummary from '../components/BalanceSummary';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import ExpenseChart from '../components/ExpenseChart';

const API = 'http://localhost:5000/api';

export default function Dashboard() {
    const { authHeader } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ── Fetch transactions on page load ──────
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await axios.get(
                    `${API}/transactions`,
                    authHeader()
                );
                setTransactions(res.data);
            } catch (err) {
                setError('Failed to load transactions');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    // ── Add transaction ───────────────────────
    const addTransaction = async (tx) => {
        try {
            const res = await axios.post(
                `${API}/transactions`,
                tx,
                authHeader()
            );
            setTransactions(prev => [res.data, ...prev]);
        } catch (err) {
            console.error('Add failed:', err.response?.data?.msg);
        }
    };

    // ── Delete transaction ────────────────────
    const deleteTransaction = async (id) => {
        try {
            await axios.delete(
                `${API}/transactions/${id}`,
                authHeader()
            );
            setTransactions(prev => prev.filter(t => t._id !== id));
        } catch (err) {
            console.error('Delete failed:', err.response?.data?.msg);
        }
    };

    // ── Export CSV ───────────────────────────
    const exportCSV = () => {
        const rows = [
            ['Title', 'Amount', 'Type', 'Category', 'Date'],
            ...transactions.map(t => [
                t.title, t.amount, t.type, t.category,
                new Date(t.date).toLocaleDateString()
            ])
        ];
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'transactions.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    const filtered = filter === 'all'
        ? transactions
        : transactions.filter(t => t.type === filter);

    if (loading) return (
        <div className="dashboard-page">
            <p className="empty">Loading your transactions...</p>
        </div>
    );

    return (
        <div className="dashboard-page">

            {error && <div className="error-msg" style={{ marginBottom: '1rem' }}>{error}</div>}

            <BalanceSummary transactions={transactions} />

            <ExpenseChart transactions={transactions} />

            <div className="dash-actions">
                <button className="btn-export" onClick={exportCSV}>
                    ⬇ Export CSV
                </button>
            </div>

            <div className="dash-body">
                <TransactionForm onAdd={addTransaction} />

                <div className="list-section">
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
                    <TransactionList
                        transactions={filtered}
                        onDelete={deleteTransaction}
                    />
                </div>
            </div>

        </div>
    );
}
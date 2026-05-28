import { useState } from 'react';
import BalanceSummary from '../components/BalanceSummary';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import ExpenseChart from '../components/ExpenseChart';

// Dummy data — will be replaced with real API calls after backend is ready
const DUMMY = [
    { _id: '1', title: 'Salary', amount: 50000, type: 'income', category: 'Salary', date: '2026-05-01' },
    { _id: '2', title: 'Rent', amount: 12000, type: 'expense', category: 'Housing', date: '2026-05-02' },
    { _id: '3', title: 'Groceries', amount: 3200, type: 'expense', category: 'Food', date: '2026-05-03' },
    { _id: '4', title: 'Freelance', amount: 15000, type: 'income', category: 'Freelance', date: '2026-05-05' },
    { _id: '5', title: 'Electricity', amount: 1500, type: 'expense', category: 'Bills', date: '2026-05-06' },
];

export default function Dashboard() {
    const [transactions, setTransactions] = useState(DUMMY);
    const [filter, setFilter] = useState('all');

    const addTransaction = (tx) =>
        setTransactions(prev => [{ ...tx, _id: Date.now().toString() }, ...prev]);

    const deleteTransaction = (id) =>
        setTransactions(prev => prev.filter(t => t._id !== id));

    const filtered = filter === 'all'
        ? transactions
        : transactions.filter(t => t.type === filter);

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

    return (
        <div className="dashboard-page">

            {/* ── Balance cards ── */}
            <BalanceSummary transactions={transactions} />

            {/* ── Spending chart ── */}
            <ExpenseChart transactions={transactions} />

            {/* ── Export button ── */}
            <div className="dash-actions">
                <button className="btn-export" onClick={exportCSV}>
                    <i className="ti ti-download" aria-hidden="true" /> Export CSV
                </button>
            </div>

            {/* ── Add form + list ── */}
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
import { useState } from 'react';

const CATEGORIES = ['Food', 'Housing', 'Transport', 'Bills', 'Health', 'Entertainment', 'Salary', 'Freelance', 'Other'];

export default function TransactionForm({ onAdd }) {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [category, setCategory] = useState('Food');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !amount) return;

        onAdd({ title, amount: Number(amount), type, category, date: new Date().toISOString() });

        // Reset form
        setTitle(''); setAmount(''); setType('expense'); setCategory('Food');
    };

    return (
        <form className="tx-form" onSubmit={handleSubmit}>
            <h3>Add Transaction</h3>

            <input
                placeholder="Title (e.g. Rent, Salary)"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
            />

            <input
                type="number"
                placeholder="Amount (₹)"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
            />

            <div className="type-toggle">
                <button type="button" className={type === 'expense' ? 'active expense' : ''} onClick={() => setType('expense')}>Expense</button>
                <button type="button" className={type === 'income' ? 'active income' : ''} onClick={() => setType('income')}>Income</button>
            </div>

            <select value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>

            <button type="submit" className="btn-primary">Add</button>
        </form>
    );
}
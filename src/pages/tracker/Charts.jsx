import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';

const API = process.env.REACT_APP_API;
const COLORS = ['#534AB7', '#0F6E56', '#854F0B', '#185FA5', '#993C1D', '#3B6D11', '#A32D2D'];

export default function Charts() {
    const { authHeader } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API}/transactions`, authHeader())
            .then(r => setTransactions(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');
    const totalExp = expenses.reduce((s, t) => s + t.amount, 0);
    const totalInc = income.reduce((s, t) => s + t.amount, 0);

    // Category chart data
    const byCategory = expenses.reduce((acc, t) => {
        const ex = acc.find(i => i.category === t.category);
        if (ex) ex.amount += t.amount;
        else acc.push({ category: t.category, amount: t.amount });
        return acc;
    }, []).sort((a, b) => b.amount - a.amount);

    // Monthly chart data
    const byMonth = transactions.reduce((acc, t) => {
        const m = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
        const ex = acc.find(i => i.month === m);
        if (ex) {
            if (t.type === 'expense') ex.expense += t.amount;
            else ex.income += t.amount;
        } else {
            acc.push({
                month: m,
                expense: t.type === 'expense' ? t.amount : 0,
                income: t.type === 'income' ? t.amount : 0,
            });
        }
        return acc;
    }, []);

    if (loading) return <div className="tracker-page"><p className="empty">Loading...</p></div>;

    return (
        <div className="tracker-page">
            <div className="tracker-page-header">
                <h2>Charts & Analytics</h2>
                <p className="su-sub">Visual breakdown of your finances</p>
            </div>

            {/* Summary */}
            <div className="summary-cards" style={{ marginBottom: '1.5rem' }}>
                <div className="summary-card balance">
                    <p>Balance</p>
                    <h3>₹{(totalInc - totalExp).toLocaleString()}</h3>
                </div>
                <div className="summary-card income">
                    <p>Total Income</p>
                    <h3>₹{totalInc.toLocaleString()}</h3>
                </div>
                <div className="summary-card expense">
                    <p>Total Expenses</p>
                    <h3>₹{totalExp.toLocaleString()}</h3>
                </div>
            </div>

            {/* Category breakdown */}
            <div className="chart-wrapper">
                <h3>Spending by category</h3>
                {byCategory.length === 0 ? (
                    <p className="empty">No expense data yet</p>
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={byCategory} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                            <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, 'Amount']} />
                            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                                {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Monthly breakdown */}
            {byMonth.length > 0 && (
                <div className="chart-wrapper">
                    <h3>Income vs Expenses by month</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={byMonth} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                            <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`]} />
                            <Legend />
                            <Bar dataKey="income" fill="#0F6E56" radius={[4, 4, 0, 0]} name="Income" />
                            <Bar dataKey="expense" fill="#c0392b" radius={[4, 4, 0, 0]} name="Expense" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
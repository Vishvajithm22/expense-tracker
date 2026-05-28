import {
    BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = [
    '#534AB7', '#0F6E56', '#854F0B',
    '#185FA5', '#993C1D', '#3B6D11', '#A32D2D'
];

function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'white', border: '0.5px solid #ddd',
                borderRadius: '8px', padding: '8px 14px', fontSize: '13px'
            }}>
                <p style={{ fontWeight: 500, marginBottom: 4 }}>{label}</p>
                <p style={{ color: '#534AB7' }}>
                    ₹{payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
}

export default function ExpenseChart({ transactions }) {
    const data = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            const existing = acc.find(i => i.category === t.category);
            if (existing) existing.amount += t.amount;
            else acc.push({ category: t.category, amount: t.amount });
            return acc;
        }, [])
        .sort((a, b) => b.amount - a.amount);

    if (data.length === 0)
        return (
            <div className="chart-empty">
                Add expenses to see your spending chart.
            </div>
        );

    return (
        <div className="chart-wrapper">
            <h3>Spending by category</h3>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="category"
                        tick={{ fontSize: 12, fill: '#888' }}
                        axisLine={false} tickLine={false} />
                    <YAxis
                        tick={{ fontSize: 12, fill: '#888' }}
                        axisLine={false} tickLine={false}
                        tickFormatter={v => `₹${v}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                        {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
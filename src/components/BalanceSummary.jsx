export default function BalanceSummary({ transactions }) {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;

    return (
        <div className="summary-cards">
            <div className="summary-card balance">
                <p>Balance</p>
                <h3>₹{balance.toLocaleString()}</h3>
            </div>
            <div className="summary-card income">
                <p>Income</p>
                <h3>₹{income.toLocaleString()}</h3>
            </div>
            <div className="summary-card expense">
                <p>Expenses</p>
                <h3>₹{expense.toLocaleString()}</h3>
            </div>
        </div>
    );
}
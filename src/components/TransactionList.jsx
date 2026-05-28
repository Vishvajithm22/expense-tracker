export default function TransactionList({ transactions, onDelete }) {
    if (transactions.length === 0)
        return <p className="empty">No transactions yet.</p>;

    return (
        <ul className="tx-list">
            {transactions.map(tx => (
                <li key={tx._id} className={`tx-item ${tx.type}`}>
                    <div className="tx-info">
                        <span className="tx-title">{tx.title}</span>
                        <span className="tx-category">{tx.category}</span>
                    </div>
                    <div className="tx-right">
                        <span className="tx-amount">
                            {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                        </span>
                        <button className="delete-btn" onClick={() => onDelete(tx._id)}>✕</button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
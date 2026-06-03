import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API = 'http://localhost:5000/api';

export default function Balances() {
    const { authHeader, user } = useAuth();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [settling, setSettling] = useState('');

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        try {
            const res = await axios.get(`${API}/groups`, authHeader());
            const detailed = await Promise.all(
                res.data.map(g =>
                    axios.get(`${API}/groups/${g._id}`, authHeader()).then(r => r.data)
                )
            );
            setGroups(detailed);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Helper — safely compare MongoDB ObjectId with user id string
    const isSameUser = (mongoUser, userId) => {
        if (!mongoUser || !userId) return false;
        const id = mongoUser?._id?.toString() || mongoUser?.id?.toString() || mongoUser?.toString();
        return id === userId;
    };

    const calcDebts = (group) => {
        const myId = user?.id;
        // Map: creditorId → { name, amount }
        const owedTo = {};

        group.expenses?.forEach(exp => {
            const paidById = exp.paidBy?._id?.toString() || exp.paidBy?.id?.toString();

            // I paid — skip (others owe me, not relevant here)
            if (paidById === myId) return;

            // Check if I am in splitAmong
            const isSplit = exp.splitAmong?.some(m => isSameUser(m, myId));
            if (!isSplit) return;

            const share = exp.amount / (exp.splitAmong?.length || 1);
            const key = paidById;

            if (!owedTo[key]) {
                owedTo[key] = {
                    to: paidById,
                    toName: exp.paidBy?.name || 'Unknown',
                    amount: 0,
                    groupId: group._id,
                    groupName: group.name,
                };
            }
            owedTo[key].amount += share;
        });

        // Subtract settlements I've already made
        group.settlements?.forEach(s => {
            const fromId = s.from?._id?.toString() || s.from?.id?.toString();
            const toId = s.to?._id?.toString() || s.to?.id?.toString();
            if (fromId === myId && owedTo[toId]) {
                owedTo[toId].amount -= s.amount;
            }
        });

        return Object.values(owedTo).filter(d => d.amount > 0.5);
    };

    // What others owe ME
    const calcOthersOweMe = (group) => {
        const myId = user?.id;
        const owedByOthers = {};

        group.expenses?.forEach(exp => {
            const paidById = exp.paidBy?._id?.toString() || exp.paidBy?.id?.toString();
            if (paidById !== myId) return; // I didn't pay

            const share = exp.amount / (exp.splitAmong?.length || 1);

            exp.splitAmong?.forEach(member => {
                const memberId = member?._id?.toString() || member?.id?.toString();
                if (memberId === myId) return; // skip myself

                if (!owedByOthers[memberId]) {
                    owedByOthers[memberId] = {
                        from: memberId,
                        fromName: member?.name || 'Unknown',
                        amount: 0,
                        groupId: group._id,
                        groupName: group.name,
                    };
                }
                owedByOthers[memberId].amount += share;
            });
        });

        // Subtract settlements others have made to me
        group.settlements?.forEach(s => {
            const fromId = s.from?._id?.toString() || s.from?.id?.toString();
            const toId = s.to?._id?.toString() || s.to?.id?.toString();
            if (toId === myId && owedByOthers[fromId]) {
                owedByOthers[fromId].amount -= s.amount;
            }
        });

        return Object.values(owedByOthers).filter(d => d.amount > 0.5);
    };

    const settle = async (groupId, toUserId, amount) => {
        const key = groupId + toUserId;
        setSettling(key);
        try {
            await axios.post(
                `${API}/groups/${groupId}/settle`,
                { toUserId, amount },
                authHeader()
            );
            fetchAll();
        } catch (err) {
            alert('Failed to settle');
        } finally {
            setSettling('');
        }
    };

    if (loading) return (
        <div className="su-page">
            <p className="empty">Calculating balances...</p>
        </div>
    );

    const iOwe = groups.flatMap(g => calcDebts(g));
    const othersOwe = groups.flatMap(g => calcOthersOweMe(g));
    const totalIOwe = iOwe.reduce((s, d) => s + d.amount, 0);
    const totalOwed = othersOwe.reduce((s, d) => s + d.amount, 0);

    return (
        <div className="su-page">

            {/* Header */}
            <div className="su-header">
                <div>
                    <h2 className="su-title">Balances</h2>
                    <p className="su-sub">Across all your groups</p>
                </div>
            </div>

            {/* Summary cards */}
            <div className="bal-summary">
                <div className="bal-summary-card owe">
                    <p>You owe</p>
                    <h3>₹{totalIOwe.toFixed(0)}</h3>
                </div>
                <div className="bal-summary-card owed">
                    <p>You are owed</p>
                    <h3>₹{totalOwed.toFixed(0)}</h3>
                </div>
                <div className={`bal-summary-card ${totalOwed - totalIOwe >= 0 ? 'net-pos' : 'net-neg'}`}>
                    <p>Net balance</p>
                    <h3>{totalOwed - totalIOwe >= 0 ? '+' : ''}₹{(totalOwed - totalIOwe).toFixed(0)}</h3>
                </div>
            </div>

            {/* What I owe */}
            {iOwe.length > 0 && (
                <>
                    <div className="bal-section-title">💸 You owe</div>
                    <div className="su-balance-list">
                        {iOwe.map((debt, i) => (
                            <div key={i} className="su-balance-item">
                                <div className="su-balance-info">
                                    <span className="su-balance-label">
                                        You owe <strong>{debt.toName}</strong>
                                    </span>
                                    <span className="su-balance-group">{debt.groupName}</span>
                                </div>
                                <div className="su-balance-right">
                                    <span className="su-balance-amount negative">₹{debt.amount.toFixed(0)}</span>
                                    <button
                                        className="su-settle-btn"
                                        disabled={settling === debt.groupId + debt.to}
                                        onClick={() => settle(debt.groupId, debt.to, debt.amount)}
                                    >
                                        {settling === debt.groupId + debt.to ? '...' : 'Settle ✓'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* What others owe me */}
            {othersOwe.length > 0 && (
                <>
                    <div className="bal-section-title" style={{ marginTop: '1.25rem' }}>💰 You are owed</div>
                    <div className="su-balance-list">
                        {othersOwe.map((debt, i) => (
                            <div key={i} className="su-balance-item">
                                <div className="su-balance-info">
                                    <span className="su-balance-label">
                                        <strong>{debt.fromName}</strong> owes you
                                    </span>
                                    <span className="su-balance-group">{debt.groupName}</span>
                                </div>
                                <div className="su-balance-right">
                                    <span className="su-balance-amount" style={{ color: '#0F6E56' }}>
                                        ₹{debt.amount.toFixed(0)}
                                    </span>
                                    <span className="bal-waiting">Waiting</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* All settled */}
            {iOwe.length === 0 && othersOwe.length === 0 && (
                <div className="su-empty-state">
                    <div className="su-empty-icon">✅</div>
                    <h3>All settled up!</h3>
                    <p>No pending balances across any of your groups.</p>
                </div>
            )}

        </div>
    );
}

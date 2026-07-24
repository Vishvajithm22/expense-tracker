import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API = process.env.REACT_APP_API;

export default function Groups() {
    const { authHeader, user } = useAuth();
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [creating, setCreating] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => { fetchGroups(); }, []);

    const fetchGroups = async () => {
        try {
            const res = await axios.get(`${API}/groups`, authHeader());
            setGroups(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const createGroup = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        setCreating(true);
        try {
            const res = await axios.post(`${API}/groups`, { name }, authHeader());
            setGroups(prev => [res.data, ...prev]);
            setName('');
            setShowForm(false);
        } catch (err) {
            console.error(err);
        } finally {
            setCreating(false);
        }
    };

    const getNetBalance = (group) => {
        let balance = 0;
        const myId = user?.id;

        group.expenses?.forEach(exp => {
            const paidById = exp.paidBy?._id || exp.paidBy?.id;
            const share = exp.amount / (exp.splitAmong?.length || 1);
            if (paidById === myId) {
                balance += exp.amount - share;
            } else {
                const isSplit = exp.splitAmong?.some(m => (m._id || m.id) === myId);
                if (isSplit) balance -= share;
            }
        });

        group.settlements?.forEach(s => {
            const fromId = s.from?._id || s.from?.id;
            const toId = s.to?._id || s.to?.id;
            if (fromId === myId) balance += s.amount;
            if (toId === myId) balance -= s.amount;
        });

        return balance;
    };

    if (loading) return <div className="su-page"><p className="empty">Loading groups...</p></div>;

    return (
        <div className="su-page">
            <div className="su-header">
                <div>
                    <h2 className="su-title">My Groups</h2>
                    <p className="su-sub">{groups.length} active group{groups.length !== 1 ? 's' : ''}</p>
                </div>
                <button className="su-btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ New Group'}
                </button>
            </div>

            {showForm && (
                <form className="su-card su-form" onSubmit={createGroup}>
                    <h3>Create a new group</h3>
                    <input
                        placeholder="e.g. Goa Trip, Flat Expenses"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                    <button type="submit" className="su-btn-primary" disabled={creating}>
                        {creating ? 'Creating...' : 'Create Group'}
                    </button>
                </form>
            )}

            {groups.length === 0 ? (
                <div className="su-empty-state">
                    <div className="su-empty-icon">👥</div>
                    <h3>No groups yet</h3>
                    <p>Create a group to start splitting expenses with friends</p>
                </div>
            ) : (
                <div className="su-group-list">
                    {groups.map(group => {
                        const bal = getNetBalance(group);
                        return (
                            <div key={group._id} className="su-group-card" onClick={() => navigate(`/groups/${group._id}`)}>
                                <div className="su-group-icon">👥</div>
                                <div className="su-group-info">
                                    <h3>{group.name}</h3>
                                    <p>{group.members?.length} members · {group.expenses?.length} expenses</p>
                                </div>
                                <div className={`su-balance ${bal > 0 ? 'positive' : bal < 0 ? 'negative' : 'zero'}`}>
                                    {bal > 0 ? `+₹${Math.abs(bal).toFixed(0)}` :
                                        bal < 0 ? `-₹${Math.abs(bal).toFixed(0)}` : 'Settled ✓'}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API = process.env.REACT_APP_API;

export default function Activity() {
    const { authHeader } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const res = await axios.get(`${API}/groups`, authHeader());
                const detailed = await Promise.all(
                    res.data.map(g =>
                        axios.get(`${API}/groups/${g._id}`, authHeader()).then(r => r.data)
                    )
                );

                // Flatten expenses + settlements into one activity feed
                const all = [];
                detailed.forEach(group => {
                    group.expenses?.forEach(exp => {
                        all.push({
                            type: 'expense',
                            msg: `${exp.paidBy?.name} added ₹${exp.amount} for "${exp.title}"`,
                            group: group.name,
                            date: new Date(exp.createdAt || exp.date),
                            icon: '💸',
                        });
                    });
                    group.settlements?.forEach(s => {
                        all.push({
                            type: 'settlement',
                            msg: `${s.from?.name} settled ₹${s.amount} with ${s.to?.name}`,
                            group: group.name,
                            date: new Date(s.date),
                            icon: '✅',
                        });
                    });
                });

                all.sort((a, b) => b.date - a.date);
                setEvents(all);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, []);

    if (loading) return <div className="su-page"><p className="empty">Loading activity...</p></div>;

    return (
        <div className="su-page">
            <div className="su-header">
                <div>
                    <h2 className="su-title">Activity</h2>
                    <p className="su-sub">Recent activity across all groups</p>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="su-empty-state">
                    <div className="su-empty-icon">📭</div>
                    <h3>No activity yet</h3>
                    <p>Add expenses to your groups to see activity here</p>
                </div>
            ) : (
                <div className="activity-list">
                    {events.map((ev, i) => (
                        <div key={i} className="activity-item">
                            <div className="activity-icon">{ev.icon}</div>
                            <div className="activity-body">
                                <p className="activity-msg">{ev.msg}</p>
                                <p className="activity-meta">
                                    {ev.group} · {ev.date.toLocaleDateString()} {ev.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
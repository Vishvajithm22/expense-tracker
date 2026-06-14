import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [currency, setCurrency] = useState('₹ INR');
    const [confirmed, setConfirmed] = useState('');

    const handleExport = () => {
        setConfirmed('Data export — go to Dashboard and use Export CSV.');
        setTimeout(() => setConfirmed(''), 3000);
    };

    const handleDeleteHistory = () => {
        if (window.confirm('Clear all transaction history? This cannot be undone.')) {
            setConfirmed('To clear history — delete entries from the History page.');
            setTimeout(() => setConfirmed(''), 3000);
        }
    };

    return (
        <div className="tracker-page">
            <div className="tracker-page-header">
                <h2>Settings</h2>
                <p className="su-sub">App preferences and account options</p>
            </div>

            {confirmed && (
                <div className="su-msg" style={{ marginBottom: '1rem' }}>{confirmed}</div>
            )}

            <div className="settings-layout">

                {/* App settings */}
                <div>
                    <div className="bal-section-title" style={{ marginBottom: '8px' }}>App</div>
                    <div className="profile-section">
                        <div className="profile-row">
                            <span className="profile-row-label">Currency</span>
                            <select
                                value={currency}
                                onChange={e => setCurrency(e.target.value)}
                                style={{ border: '1.5px solid #e5e7eb', borderRadius: '6px', padding: '4px 8px', fontSize: '13px', outline: 'none' }}
                            >
                                <option>₹ INR</option>
                                <option>$ USD</option>
                                <option>€ EUR</option>
                                <option>£ GBP</option>
                            </select>
                        </div>
                        <div className="profile-row">
                            <span className="profile-row-label">Language</span>
                            <span className="profile-row-value">English</span>
                        </div>
                    </div>

                    {/* Data */}
                    <div className="bal-section-title" style={{ margin: '1.25rem 0 8px' }}>Data</div>
                    <div className="profile-section">
                        <div className="profile-row" style={{ cursor: 'pointer' }} onClick={handleExport}>
                            <span className="profile-row-label">Export Data</span>
                            <span style={{ color: '#534AB7', fontSize: '13px', fontWeight: '500' }}>Export →</span>
                        </div>
                        <div className="profile-row" style={{ cursor: 'pointer' }} onClick={handleDeleteHistory}>
                            <span className="profile-row-label" style={{ color: '#c0392b' }}>Clear History</span>
                            <span style={{ color: '#c0392b', fontSize: '13px' }}>›</span>
                        </div>
                    </div>

                    {/* Account */}
                    <div className="bal-section-title" style={{ margin: '1.25rem 0 8px' }}>Account</div>
                    <div className="profile-section">
                        <div className="profile-row" style={{ cursor: 'pointer' }}
                            onClick={() => navigate('/profile')}>
                            <span className="profile-row-label">View Profile</span>
                            <span style={{ color: '#9ca3af' }}>›</span>
                        </div>
                        <div className="profile-row" style={{ cursor: 'pointer' }}
                            onClick={() => { if (window.confirm('Log out?')) logout(); }}>
                            <span className="profile-row-label" style={{ color: '#c0392b' }}>Logout</span>
                            <span style={{ color: '#c0392b' }}>›</span>
                        </div>
                    </div>
                </div>

                {/* Info panel */}
                <div className="settings-info">
                    <div className="settings-info-card">
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚙️</div>
                        <h3>FinHub Settings</h3>
                        <p>Manage your app preferences, data, and account options from here.</p>
                    </div>
                    <div className="settings-info-card">
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔒</div>
                        <h3>Your data is safe</h3>
                        <p>All your data is stored securely in MongoDB Atlas with JWT authentication.</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
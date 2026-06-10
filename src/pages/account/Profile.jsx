import { useAuth } from '../../context/AuthContext';

export default function Profile() {
    const { user, logout } = useAuth();

    return (
        <div className="tracker-page">
            <div className="tracker-page-header">
                <h2>Profile</h2>
                <p className="su-sub">Your account details</p>
            </div>

            <div className="profile-card">
                <div className="profile-avatar">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <h3 className="profile-name">{user?.name}</h3>
                <p className="profile-email">{user?.email}</p>
            </div>

            <div className="profile-section">
                {[
                    { label: 'Full Name', value: user?.name },
                    { label: 'Email', value: user?.email },
                    { label: 'Member since', value: 'FinHub User' },
                ].map(item => (
                    <div key={item.label} className="profile-row">
                        <span className="profile-row-label">{item.label}</span>
                        <span className="profile-row-value">{item.value}</span>
                    </div>
                ))}
            </div>

            <button
                className="su-btn-primary"
                style={{ background: '#c0392b', marginTop: '1rem' }}
                onClick={logout}
            >
                🚪 Logout
            </button>
        </div>
    );
}
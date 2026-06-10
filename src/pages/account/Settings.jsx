export default function Settings() {
    return (
        <div className="tracker-page">
            <div className="tracker-page-header">
                <h2>Settings</h2>
                <p className="su-sub">App preferences</p>
            </div>

            {[
                { section: 'App', items: ['Currency: ₹ INR', 'Language: English', 'Dark Mode: Off'] },
                { section: 'Data', items: ['Export All Data', 'Clear Transaction History'] },
                { section: 'Account', items: ['Change Password', 'Delete Account'] },
            ].map(s => (
                <div key={s.section} style={{ marginBottom: '1.25rem' }}>
                    <div className="bal-section-title">{s.section}</div>
                    <div className="profile-section">
                        {s.items.map(item => (
                            <div key={item} className="profile-row" style={{ cursor: 'pointer' }}>
                                <span className="profile-row-label"
                                    style={{ color: item.includes('Delete') ? '#c0392b' : undefined }}>
                                    {item}
                                </span>
                                <span style={{ color: '#9ca3af' }}>›</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
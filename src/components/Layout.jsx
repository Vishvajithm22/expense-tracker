import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const PAGE_TITLES = {
    '/': { title: 'Dashboard', section: 'Expense Tracker', color: '#534AB7' },
    '/add': { title: 'Add Entry', section: 'Expense Tracker', color: '#534AB7' },
    '/history': { title: 'History', section: 'Expense Tracker', color: '#534AB7' },
    '/charts': { title: 'Charts', section: 'Expense Tracker', color: '#534AB7' },
    '/groups': { title: 'My Groups', section: 'SettleUp', color: '#0F6E56' },
    '/groups/add': { title: 'Add Expense', section: 'SettleUp', color: '#0F6E56' },
    '/balances': { title: 'Balances', section: 'SettleUp', color: '#0F6E56' },
    '/activity': { title: 'Activity', section: 'SettleUp', color: '#0F6E56' },
    '/profile': { title: 'Profile', section: 'Account', color: '#374151' },
    '/settings': { title: 'Settings', section: 'Account', color: '#374151' },
};

export default function Layout({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuth();
    const location = useLocation();

    const meta = PAGE_TITLES[location.pathname]
        || { title: 'FinHub', section: '', color: '#534AB7' };

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'FH';

    return (
        <div className="app-layout">

            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <div className="main-area">

                {/* Top bar */}
                <header className="topbar">
                    <div className="topbar-left">
                        <div
                            className="topbar-accent"
                            style={{ background: meta.color }}
                        />
                        <div>
                            <p className="topbar-section">{meta.section}</p>
                            <h1 className="topbar-title">{meta.title}</h1>
                        </div>
                    </div>
                    <div className="topbar-right">
                        <button className="notif-btn" aria-label="Notifications">
                            <i className="ti ti-bell" aria-hidden="true" />
                            <span className="notif-dot" />
                        </button>
                        <div
                            className="avatar"
                            style={{ background: meta.color + '22', color: meta.color }}
                            title={user?.name}
                        >
                            {initials}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="page-content">
                    {children}
                </main>

            </div>
        </div>
    );
}
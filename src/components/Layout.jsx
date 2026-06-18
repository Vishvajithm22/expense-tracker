import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

const PAGE_META = {
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
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const meta = PAGE_META[location.pathname]
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
                        <div className="topbar-accent" style={{ background: meta.color }} />
                        <div>
                            <p className="topbar-section">{meta.section}</p>
                            <h1 className="topbar-title">{meta.title}</h1>
                        </div>
                    </div>

                    <div className="topbar-right">
                        {/* Avatar with dropdown */}
                        <div className="avatar-wrapper">
                            <div
                                className="avatar"
                                style={{ background: meta.color + '22', color: meta.color }}
                                title={user?.name}
                                onClick={() => setMenuOpen(prev => !prev)}
                            >
                                {initials}
                            </div>

                            {menuOpen && (
                                <>
                                    {/* Click outside to close */}
                                    <div
                                        className="avatar-backdrop"
                                        onClick={() => setMenuOpen(false)}
                                    />
                                    {/* Dropdown menu */}
                                    <div className="avatar-menu">
                                        <div className="avatar-menu-header">
                                            <p className="avatar-menu-name">{user?.name}</p>
                                            <p className="avatar-menu-email">{user?.email}</p>
                                        </div>
                                        <button
                                            className="avatar-menu-item"
                                            onClick={() => { navigate('/profile'); setMenuOpen(false); }}
                                        >
                                            👤 Profile
                                        </button>
                                        <button
                                            className="avatar-menu-item"
                                            onClick={() => { navigate('/settings'); setMenuOpen(false); }}
                                        >
                                            ⚙️ Settings
                                        </button>
                                        <button
                                            className="avatar-menu-item avatar-menu-logout"
                                            onClick={() => { logout(); setMenuOpen(false); }}
                                        >
                                            🚪 Logout
                                        </button>
                                    </div>
                                </>
                            )}
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
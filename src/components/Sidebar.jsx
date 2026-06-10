import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

let logo = null;
try { logo = require('../assets/finhub-logo.png'); } catch (e) { logo = null; }

const NAV = [
    {
        id: 'tracker',
        label: 'Expense Tracker',
        icon: '💰',
        color: '#534AB7',
        sub: [
            { label: 'Dashboard', icon: '🏠', path: '/' },
            { label: 'Add Entry', icon: '➕', path: '/add' },
            { label: 'History', icon: '📋', path: '/history' },
            { label: 'Charts', icon: '📊', path: '/charts' },
        ],
    },
    {
        id: 'settleup',
        label: 'SettleUp',
        icon: '👥',
        color: '#0F6E56',
        sub: [
            { label: 'My Groups', icon: '🗂️', path: '/groups' },
            { label: 'Add Expense', icon: '➕', path: '/groups' },
            { label: 'Balances', icon: '⚖️', path: '/balances' },
            { label: 'Activity', icon: '📡', path: '/activity' },
        ],
    },
];

const BOTTOM = [
    { label: 'Profile', icon: '👤', path: '/profile' },
    { label: 'Settings', icon: '⚙️', path: '/settings' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState('tracker');

    const isActive = (path) => location.pathname === path;
    const isSectionOn = (sec) => sec.sub.some(s => s.path === location.pathname);

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>

            {/* Logo row */}
            <div className="sidebar-logo">
                {!collapsed && (
                    <div className="logo-area">
                        {logo
                            ? <img src={logo} alt="FinHub" className="logo-full" />
                            : <span className="logo-text">FinHub</span>
                        }
                    </div>
                )}
                <button
                    className="collapse-btn"
                    onClick={() => setCollapsed(!collapsed)}
                    title={collapsed ? 'Expand' : 'Collapse'}
                >
                    {collapsed ? '→' : '←'}
                </button>
            </div>

            {/* Main nav */}
            <nav className="sidebar-nav">
                {NAV.map(section => {
                    const secActive = isSectionOn(section);
                    const isOpen = open === section.id;
                    return (
                        <div key={section.id} className="nav-section">
                            <button
                                className={`nav-section-btn ${secActive ? 'active' : ''}`}
                                style={secActive ? { background: section.color } : {}}
                                onClick={() => setOpen(isOpen ? '' : section.id)}
                                title={collapsed ? section.label : ''}
                            >
                                <span className="nav-icon">{section.icon}</span>
                                {!collapsed && (
                                    <>
                                        <span className="nav-label">{section.label}</span>
                                        <span className="nav-chevron">{isOpen ? '▲' : '▼'}</span>
                                    </>
                                )}
                            </button>

                            {isOpen && !collapsed && (
                                <div className="nav-sub">
                                    {section.sub.map((item, idx) => (
                                        <button
                                            key={idx}
                                            className={`nav-sub-btn ${isActive(item.path) ? 'active' : ''}`}
                                            style={isActive(item.path) ? { color: section.color } : {}}
                                            onClick={() => navigate(item.path)}
                                        >
                                            <span>{item.icon}</span>
                                            <span>{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="sidebar-bottom">
                {BOTTOM.map(item => (
                    <button
                        key={item.path}
                        className={`bottom-btn ${isActive(item.path) ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                        title={collapsed ? item.label : ''}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {!collapsed && <span>{item.label}</span>}
                    </button>
                ))}
                <button
                    className="bottom-btn logout-btn"
                    onClick={logout}
                    title={collapsed ? 'Logout' : ''}
                >
                    <span className="nav-icon">🚪</span>
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>

        </aside>
    );
}
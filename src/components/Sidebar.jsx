import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
    {
        id: 'tracker',
        label: 'Expense Tracker',
        icon: 'ti-wallet',
        color: '#534AB7',
        light: '#EEEDFE',
        sub: [
            { id: 'dashboard', label: 'Dashboard', icon: 'ti-home', path: '/' },
            { id: 'addentry', label: 'Add Entry', icon: 'ti-plus', path: '/add' },
            { id: 'history', label: 'History', icon: 'ti-list', path: '/history' },
            { id: 'charts', label: 'Charts', icon: 'ti-chart-bar', path: '/charts' },
        ],
    },
    {
        id: 'settleup',
        label: 'SettleUp',
        icon: 'ti-users',
        color: '#0F6E56',
        light: '#E1F5EE',
        sub: [
            { id: 'groups', label: 'My Groups', icon: 'ti-layout-grid', path: '/groups' },
            { id: 'addexp', label: 'Add Expense', icon: 'ti-plus', path: '/groups/add' },
            { id: 'balances', label: 'Balances', icon: 'ti-scale', path: '/balances' },
            { id: 'activity', label: 'Activity', icon: 'ti-activity', path: '/activity' },
        ],
    },
];

const BOTTOM = [
    { id: 'profile', label: 'Profile', icon: 'ti-user', path: '/profile' },
    { id: 'settings', label: 'Settings', icon: 'ti-settings', path: '/settings' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState('tracker');

    const isActive = (path) => location.pathname === path;
    const isSectionActive = (section) =>
        section.sub.some(s => s.path === location.pathname);

    const handleSection = (id) => {
        setOpen(open === id ? '' : id);
    };

    const handleNav = (path) => navigate(path);

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>

            {/* Logo + collapse button */}
            <div className="sidebar-logo">
                {!collapsed && <span className="logo-text">FinHub</span>}
                <button
                    className="collapse-btn"
                    onClick={() => setCollapsed(!collapsed)}
                    aria-label="Toggle sidebar"
                >
                    <i className={`ti ${collapsed ? 'ti-menu-2' : 'ti-layout-sidebar-left-collapse'}`}
                        aria-hidden="true" />
                </button>
            </div>

            {/* Main nav */}
            <nav className="sidebar-nav">
                {NAV.map(section => {
                    const active = isSectionActive(section);
                    const isOpen = open === section.id;
                    return (
                        <div key={section.id} className="nav-section">

                            {/* Section header */}
                            <button
                                className={`nav-section-btn ${active ? 'active' : ''}`}
                                style={active ? { background: section.color } : {}}
                                onClick={() => handleSection(section.id)}
                                title={collapsed ? section.label : ''}
                            >
                                <i className={`ti ${section.icon}`} aria-hidden="true" />
                                {!collapsed && (
                                    <>
                                        <span className="nav-label">{section.label}</span>
                                        <i className={`ti ${isOpen ? 'ti-chevron-up' : 'ti-chevron-down'} nav-chevron`}
                                            aria-hidden="true" />
                                    </>
                                )}
                            </button>

                            {/* Sub items */}
                            {isOpen && !collapsed && (
                                <div className="nav-sub">
                                    {section.sub.map(item => (
                                        <button
                                            key={item.id}
                                            className={`nav-sub-btn ${isActive(item.path) ? 'active' : ''}`}
                                            style={isActive(item.path) ? { color: section.color } : {}}
                                            onClick={() => handleNav(item.path)}
                                        >
                                            <i className={`ti ${item.icon}`} aria-hidden="true" />
                                            <span>{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Bottom items */}
            <div className="sidebar-bottom">
                {BOTTOM.map(item => (
                    <button
                        key={item.id}
                        className={`bottom-btn ${isActive(item.path) ? 'active' : ''}`}
                        onClick={() => handleNav(item.path)}
                        title={collapsed ? item.label : ''}
                    >
                        <i className={`ti ${item.icon}`} aria-hidden="true" />
                        {!collapsed && <span>{item.label}</span>}
                    </button>
                ))}

                {/* Logout */}
                <button
                    className="bottom-btn logout-btn"
                    onClick={logout}
                    title={collapsed ? 'Logout' : ''}
                >
                    <i className="ti ti-logout" aria-hidden="true" />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>

        </aside>
    );
}
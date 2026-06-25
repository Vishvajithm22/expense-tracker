import { useNavigate } from 'react-router-dom';
import './Landing.css';

const FEATURES = [
    { icon: '📊', color: 'purple', title: 'Expense tracker', desc: 'Log income and expenses, categorise them, and get a clear view of your spending habits over time.' },
    { icon: '👥', color: 'teal', title: 'Group bill splitting', desc: 'Create groups for trips, flatmates, or events. Add shared expenses and FinHub calculates who owes what.' },
    { icon: '📈', color: 'blue', title: 'Visual analytics', desc: 'Bar charts and monthly breakdowns show exactly where your money is going — by category and over time.' },
    { icon: '💾', color: 'amber', title: 'CSV export', desc: 'Export your full transaction history to CSV in one click — great for budgeting spreadsheets or tax records.' },
    { icon: '✅', color: 'coral', title: 'Settle up', desc: 'Record settlements between group members and watch balances clear in real time.' },
    { icon: '🌙', color: 'green', title: 'Dark mode + multi-currency', desc: 'Switch between light and dark mode. Choose your preferred currency — INR, USD, EUR, or GBP.' },
];

const STEPS = [
    { num: '1', title: 'Create a free account', desc: 'Sign up with your email in seconds. Your data is secured with JWT authentication.' },
    { num: '2', title: 'Log your transactions', desc: 'Add income and expenses with categories and dates. Watch your dashboard update instantly.' },
    { num: '3', title: 'Split & settle bills', desc: 'Create a group, invite friends by email, add shared expenses, and settle up with one tap.' },
];

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="lp-root">

            {/* ── Navbar ── */}
            <nav className="lp-nav">
                <div className="lp-logo">Fin<span>Hub</span></div>
                <div className="lp-nav-links">
                    <a href="#features">Features</a>
                    <a href="#how-it-works">How it works</a>
                </div>
                <div className="lp-nav-btns">
                    <button className="lp-btn-outline" onClick={() => navigate('/login')}>Log in</button>
                    <button className="lp-btn-primary" onClick={() => navigate('/register')}>Get started free →</button>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="lp-hero">
                <div className="lp-hero-badge">✨ Smart finance management</div>
                <h1>Track expenses.<br /><span>Split bills.</span> Stay in control.</h1>
                <p>FinHub brings personal expense tracking and group bill splitting into one clean, simple app. Know where your money goes — and who owes what.</p>
                <div className="lp-hero-btns">
                    <button className="lp-btn-primary lp-btn-lg" onClick={() => navigate('/register')}>Start for free →</button>
                    <button className="lp-btn-outline lp-btn-lg" onClick={() => navigate('/login')}>Log in</button>
                </div>
                <div className="lp-hero-stats">
                    <div className="lp-stat"><span>₹0</span><p>Always free to use</p></div>
                    <div className="lp-stat"><span>2-in-1</span><p>Tracker + SettleUp</p></div>
                    <div className="lp-stat"><span>100%</span><p>Secure & private</p></div>
                </div>
            </section>

            <div className="lp-divider" />

            {/* ── Features ── */}
            <section className="lp-section" id="features">
                <p className="lp-section-label">Features</p>
                <h2>Everything you need, nothing you don't</h2>
                <p className="lp-section-sub">Two powerful modules in one app — personal finance tracking and group expense splitting.</p>
                <div className="lp-features-grid">
                    {FEATURES.map(f => (
                        <div key={f.title} className="lp-feature-card">
                            <div className={`lp-feature-icon lp-icon-${f.color}`}>{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="lp-divider" />

            {/* ── How it works ── */}
            <section className="lp-section" id="how-it-works">
                <p className="lp-section-label">How it works</p>
                <h2>Up and running in minutes</h2>
                <p className="lp-section-sub">No setup, no credit card. Just sign up and start managing your money.</p>
                <div className="lp-steps">
                    {STEPS.map(s => (
                        <div key={s.num} className="lp-step">
                            <div className="lp-step-num">{s.num}</div>
                            <h3>{s.title}</h3>
                            <p>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="lp-divider" />

            {/* ── CTA ── */}
            <section className="lp-cta">
                <h2>Ready to take control of your finances?</h2>
                <p>Join FinHub today — it's free, fast, and built for real life. Track personal spending and split group bills without switching apps.</p>
                <div className="lp-hero-btns">
                    <button className="lp-btn-primary lp-btn-lg" onClick={() => navigate('/register')}>Create free account →</button>
                    <button className="lp-btn-outline lp-btn-lg" onClick={() => navigate('/login')}>Log in</button>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="lp-footer">
                <div className="lp-logo">FinHub</div>
                <div className="lp-footer-links">
                    <a href="#features">Features</a>
                    <a href="#how-it-works">How it works</a>
                </div>
                <p className="lp-copy">© 2026 FinHub. All rights reserved.</p>
            </footer>

        </div>
    );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/finhub-logo.png';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ok = await login(email, password);
        if (ok) navigate('/');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                {/* Logo at top of card */}
                <div className="auth-logo-wrap">
                    <img src={logo} alt="FinHub" className="auth-logo" />
                </div>

                <h2>Welcome back</h2>
                <p className="subtitle">Sign in to your FinHub account</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="you@example.com"
                            value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="••••••••"
                            value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p className="switch-link">
                    No account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}
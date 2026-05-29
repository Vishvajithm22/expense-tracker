import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/finhub-logo.png';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ok = await register(name, email, password);
        if (ok) navigate('/');          // ← goes to Dashboard on success
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo-wrap">
                    <img src={logo} alt="FinHub" className="auth-logo" />
                </div>

                <h2>Create account</h2>
                <p className="subtitle">Start tracking your money</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Min 6 characters"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <p className="switch-link">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>

            </div>
        </div>
    );
}
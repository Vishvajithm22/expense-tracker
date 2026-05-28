import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // We'll connect this to the backend later
        // For now, just navigate to dashboard
        console.log('Login with:', email, password);
        navigate('/');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Welcome back</h2>
                <p className="subtitle">Sign in to your account</p>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary">Sign in</button>
                </form>

                <p className="switch-link">
                    No account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}
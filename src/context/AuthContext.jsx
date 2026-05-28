import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    );
    const [token, setToken] = useState(
        localStorage.getItem('token') || null
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // ─── helper: save login data to state + localStorage ───────
    const saveLogin = (data) => {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    };

    // ─── REGISTER ──────────────────────────────────────────────
    // TODO: replace mock with real API when backend is ready:
    //   const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
    //   saveLogin(res.data);
    const register = async (name, email, password) => {
        setLoading(true); setError('');
        try {
            // Mock — saves fake data so app works without backend
            await new Promise(r => setTimeout(r, 600)); // fake loading delay
            saveLogin({
                token: 'mock-token-' + Date.now(),
                user: { id: '1', name, email },
            });
            return true;
        } catch (err) {
            setError('Registration failed');
            return false;
        } finally { setLoading(false); }
    };

    // ─── LOGIN ─────────────────────────────────────────────────
    // TODO: replace mock with real API when backend is ready:
    //   const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    //   saveLogin(res.data);
    const login = async (email, password) => {
        setLoading(true); setError('');
        try {
            // Mock — any email/password works for now
            await new Promise(r => setTimeout(r, 600)); // fake loading delay
            const name = email.split('@')[0]; // use email prefix as name
            saveLogin({
                token: 'mock-token-' + Date.now(),
                user: { id: '1', name, email },
            });
            return true;
        } catch (err) {
            setError('Login failed');
            return false;
        } finally { setLoading(false); }
    };

    // ─── LOGOUT ────────────────────────────────────────────────
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    // ─── AUTH HEADER for API calls ─────────────────────────────
    const authHeader = () => ({
        headers: { Authorization: `Bearer ${token}` }
    });

    return (
        <AuthContext.Provider value={{
            user, token, loading, error,
            login, register, logout, authHeader
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
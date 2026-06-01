import { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// ── Base URL — your Express backend ─────────
const API = 'http://localhost:5000/api';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    );
    const [token, setToken] = useState(
        localStorage.getItem('token') || null
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // ── Save login data ──────────────────────
    const saveLogin = (data) => {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    };

    // ── Register ─────────────────────────────
    const register = async (name, email, password) => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API}/auth/register`, {
                name, email, password
            });
            saveLogin(res.data);
            return true;
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // ── Login ─────────────────────────────────
    const login = async (email, password) => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API}/auth/login`, {
                email, password
            });
            saveLogin(res.data);
            return true;
        } catch (err) {
            setError(err.response?.data?.msg || 'Invalid credentials');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // ── Logout ────────────────────────────────
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    // ── Auth header for all protected API calls
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
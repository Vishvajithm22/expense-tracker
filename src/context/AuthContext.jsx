import { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API = process.env.REACT_APP_API;

export function AuthProvider({ children }) {

    // ── Read saved session from localStorage ─────────────────
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('user')) || null
    );
    const [token, setToken] = useState(
        localStorage.getItem('token') || null
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // ── Save login — normalise user id field ─────────────────
    // MongoDB returns _id, but our balance logic uses user.id
    // We store both so comparisons always work
    const saveLogin = (data) => {
        const userToSave = {
            ...data.user,
            id: data.user.id || data.user._id?.toString(),
            _id: data.user._id || data.user.id,
        };
        setToken(data.token);
        setUser(userToSave);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userToSave));
    };

    // ── Register ──────────────────────────────────────────────
    const register = async (name, email, password) => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API}/auth/register`, {
                name, email, password,
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

    // ── Login ─────────────────────────────────────────────────
    const login = async (email, password) => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${API}/auth/login`, {
                email, password,
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

    // ── Logout ────────────────────────────────────────────────
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    // ── Auth header — attach JWT to every API request ─────────
    // Usage: axios.get(url, authHeader())
    const authHeader = () => ({
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            error,
            login,
            register,
            logout,
            authHeader,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook — use this in any component
// const { user, token, login, logout, authHeader } = useAuth();
export const useAuth = () => useContext(AuthContext);
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';

// Expense Tracker pages
import Dashboard from './pages/Dashboard';
import AddEntry from './pages/tracker/AddEntry';
import History from './pages/tracker/History';
import Charts from './pages/tracker/Charts';

// SettleUp pages
import Groups from './pages/settleup/Groups';
import GroupDetail from './pages/settleup/GroupDetail';
import Balances from './pages/settleup/Balances';
import Activity from './pages/settleup/Activity';

// Account pages
import Profile from './pages/account/Profile';
import Settings from './pages/account/Settings';

// ── PrivateRoute — wraps every protected page in Layout ──
function PrivateRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public ─────────────────────────────── */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Expense Tracker ────────────────────── */}
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/add" element={<PrivateRoute><AddEntry /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
        <Route path="/charts" element={<PrivateRoute><Charts /></PrivateRoute>} />

        {/* ── SettleUp ───────────────────────────── */}
        <Route path="/groups" element={<PrivateRoute><Groups /></PrivateRoute>} />
        <Route path="/groups/:id" element={<PrivateRoute><GroupDetail /></PrivateRoute>} />
        <Route path="/groups/add" element={<PrivateRoute><Groups /></PrivateRoute>} />
        <Route path="/balances" element={<PrivateRoute><Balances /></PrivateRoute>} />
        <Route path="/activity" element={<PrivateRoute><Activity /></PrivateRoute>} />

        {/* ── Account ────────────────────────────── */}
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

        {/* ── Catch all ──────────────────────────── */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
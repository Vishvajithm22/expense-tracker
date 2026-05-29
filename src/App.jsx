// ─────────────────────────────────────────────
//  src/App.jsx
//  NO App.css import — delete that line if it exists
// ─────────────────────────────────────────────
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout — sidebar + topbar wrapper
import Layout from './components/Layout';

// Public pages — no sidebar
import Login from './pages/Login';
import Register from './pages/Register';

// Protected pages — sidebar appears on all of these
import Dashboard from './pages/Dashboard';

// ─────────────────────────────────────────────
//  PrivateRoute
//  - If user has a token → show the page inside Layout
//  - If no token        → redirect to /login
// ─────────────────────────────────────────────
function PrivateRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
}

// ─────────────────────────────────────────────
//  App
// ─────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public routes (no sidebar) ───────────── */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Protected routes (sidebar via Layout) ── */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* ── Catch everything else ────────────────── */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
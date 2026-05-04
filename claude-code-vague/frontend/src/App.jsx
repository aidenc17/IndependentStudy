import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import TodosPage from './pages/TodosPage';
import UsersPage from './pages/UsersPage';
import './App.css';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/todos" replace /> : <AuthPage />}
      />
      <Route
        path="/todos"
        element={<ProtectedRoute><TodosPage /></ProtectedRoute>}
      />
      <Route
        path="/users"
        element={<ProtectedRoute><UsersPage /></ProtectedRoute>}
      />
      <Route path="*" element={<Navigate to={user ? '/todos' : '/login'} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Todos from './pages/Todos';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Admin from './pages/Admin';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [resetToken, setResetToken] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    const token = params.get('token');
    if (page === 'reset-password' && token) {
      setResetToken(token);
      setCurrentPage('reset-password');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  function navigate(page) {
    setCurrentPage(page);
  }

  function renderPage() {
    switch (currentPage) {
      case 'todos':
        return <Todos onNavigate={navigate} />;
      case 'about':
        return <About />;
      case 'login':
        return <Login onNavigate={navigate} />;
      case 'register':
        return <Register onNavigate={navigate} />;
      case 'forgot-password':
        return <ForgotPassword onNavigate={navigate} />;
      case 'reset-password':
        return <ResetPassword token={resetToken} onNavigate={navigate} />;
      case 'admin':
        return <Admin onNavigate={navigate} />;
      case 'home':
      default:
        return <Home onNavigate={navigate} />;
    }
  }

  return (
    <div className="app">
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      <main className="main-content">{renderPage()}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

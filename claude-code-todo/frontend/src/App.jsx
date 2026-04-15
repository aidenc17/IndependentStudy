import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Todos from './pages/Todos';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');

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

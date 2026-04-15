import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentPage, onNavigate }) {
  const { isLoggedIn, user, logout } = useAuth();

  function handleLogout() {
    logout();
    onNavigate('home');
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => onNavigate('home')}>
        TodoApp
      </div>
      <div className="navbar-links">
        <button
          className={currentPage === 'home' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => onNavigate('home')}
        >
          Home
        </button>

        {isLoggedIn ? (
          <>
            <button
              className={currentPage === 'todos' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => onNavigate('todos')}
            >
              Todos
            </button>
            <span className="nav-user">Hi, {user?.username}</span>
            <button className="nav-btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className={currentPage === 'about' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => onNavigate('about')}
            >
              About
            </button>
            <button
              className={currentPage === 'login' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => onNavigate('login')}
            >
              Login
            </button>
            <button
              className={currentPage === 'register' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => onNavigate('register')}
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

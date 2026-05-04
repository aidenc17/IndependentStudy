import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Home({ onNavigate }) {
  const { isLoggedIn, user } = useAuth();

  return (
    <div className="page home-page">
      <div className="hero">
        <h1>Welcome to TodoApp</h1>
        {isLoggedIn ? (
          <>
            <p>Good to see you back, <strong>{user.username}</strong>!</p>
            <button className="btn btn-primary" onClick={() => onNavigate('todos')}>
              Go to My Todos
            </button>
          </>
        ) : (
          <>
            <p>A simple, secure place to keep track of what matters.</p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => onNavigate('register')}>
                Get Started
              </button>
              <button className="btn btn-secondary" onClick={() => onNavigate('login')}>
                Log In
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

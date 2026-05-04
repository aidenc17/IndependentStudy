import { useAuth } from '../context/AuthContext';

export default function Home({ setCurrentPage }) {
  const { isLoggedIn, user } = useAuth();

  const containerStyle = {
    maxWidth: '600px',
    margin: '80px auto',
    textAlign: 'center',
    padding: '0 24px',
  };

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#1e293b' }}>
        Welcome to TodoApp
      </h1>
      {isLoggedIn ? (
        <>
          <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '24px' }}>
            Hello, <strong>{user.username}</strong>! Manage your tasks below.
          </p>
          <button
            onClick={() => setCurrentPage('todos')}
            style={{
              padding: '12px 28px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Go to My Todos
          </button>
        </>
      ) : (
        <>
          <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '24px' }}>
            A simple, secure app to track your tasks. Register or log in to get started.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => setCurrentPage('register')}
              style={{
                padding: '12px 28px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              Get Started
            </button>
            <button
              onClick={() => setCurrentPage('login')}
              style={{
                padding: '12px 28px',
                backgroundColor: 'transparent',
                color: '#3b82f6',
                border: '2px solid #3b82f6',
                borderRadius: '6px',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              Login
            </button>
          </div>
        </>
      )}
    </div>
  );
}

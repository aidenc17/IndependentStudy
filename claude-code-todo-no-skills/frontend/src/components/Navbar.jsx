import { useAuth } from '../context/AuthContext';

export default function Navbar({ currentPage, setCurrentPage }) {
  const { isLoggedIn, user, logout } = useAuth();

  function handleLogout() {
    logout();
    setCurrentPage('home');
  }

  const navStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    backgroundColor: '#1e293b',
    color: '#f8fafc',
  };

  const brandStyle = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#f8fafc',
    textDecoration: 'none',
  };

  const linkStyle = (page) => ({
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: '4px',
    backgroundColor: currentPage === page ? '#3b82f6' : 'transparent',
    color: '#f8fafc',
    border: 'none',
    fontSize: '0.95rem',
  });

  return (
    <nav style={navStyle}>
      <span style={brandStyle} onClick={() => setCurrentPage('home')}>
        TodoApp
      </span>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button style={linkStyle('home')} onClick={() => setCurrentPage('home')}>
          Home
        </button>
        <button style={linkStyle('about')} onClick={() => setCurrentPage('about')}>
          About
        </button>
        {isLoggedIn ? (
          <>
            <button style={linkStyle('todos')} onClick={() => setCurrentPage('todos')}>
              Todos
            </button>
            {user?.isAdmin && (
              <button style={linkStyle('admin')} onClick={() => setCurrentPage('admin')}>
                Admin
              </button>
            )}
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', marginLeft: '8px' }}>
              {user?.username}
            </span>
            <button
              style={{ ...linkStyle(''), backgroundColor: '#ef4444' }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button style={linkStyle('login')} onClick={() => setCurrentPage('login')}>
              Login
            </button>
            <button style={linkStyle('register')} onClick={() => setCurrentPage('register')}>
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

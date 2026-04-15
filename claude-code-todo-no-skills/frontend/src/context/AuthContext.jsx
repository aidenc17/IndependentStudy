import { createContext, useContext, useState } from 'react';
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '../utils/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUserState] = useState(() => getUser());

  const isLoggedIn = Boolean(token);

  function login(newToken, newUser) {
    setToken(newToken);
    setUser(newUser);
    setTokenState(newToken);
    setUserState(newUser);
  }

  function logout() {
    removeToken();
    removeUser();
    setTokenState(null);
    setUserState(null);
  }

  function getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  return (
    <AuthContext.Provider value={{ token, user, isLoggedIn, login, logout, getHeaders }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

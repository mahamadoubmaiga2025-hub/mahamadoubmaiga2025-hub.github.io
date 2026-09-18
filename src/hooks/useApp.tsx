import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { AppState, AppView, User } from '@/types';
import { DEMO_USER, DEMO_WALLETS, DEMO_TRANSACTIONS } from '@/data/mockData';

type Action =
  | { type: 'NAVIGATE'; payload: AppView }
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'TOGGLE_DARK'; payload?: boolean };

const initialState: AppState = {
  view: 'landing',
  user: null,
  isAuthenticated: false,
  wallets: DEMO_WALLETS,
  transactions: DEMO_TRANSACTIONS,
  isDark: false,
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, view: action.payload };
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true, view: 'dashboard' };
    case 'LOGOUT':
      return { ...initialState, view: 'landing' };
    case 'TOGGLE_DARK': {
      const next = action.payload !== undefined ? action.payload : !state.isDark;
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return { ...state, isDark: next };
    }
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  navigate: (view: AppView) => void;
  login: (user?: User) => void;
  logout: () => void;
  toggleDark: (value?: boolean) => void;
  setUser: (user: User) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const navigate = useCallback((view: AppView) => {
    dispatch({ type: 'NAVIGATE', payload: view });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const login = useCallback((user?: User) => {
    dispatch({ type: 'LOGIN', payload: user ?? DEMO_USER });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const toggleDark = useCallback((value?: boolean) => {
    dispatch({ type: 'TOGGLE_DARK', payload: value });
  }, []);

  const setUser = useCallback((user: User) => {
    dispatch({ type: 'LOGIN', payload: user });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, navigate, login, logout, toggleDark, setUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

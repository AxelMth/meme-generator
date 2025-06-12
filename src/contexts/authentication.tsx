import { jwtDecode } from 'jwt-decode';
import { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react';

export type AuthenticationState =
  | {
      isAuthenticated: true;
      token: string;
      userId: string;
    }
  | {
      isAuthenticated: false;
    };

export type Authentication = {
  state: AuthenticationState;
  authenticate: (token: string) => void;
  signout: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthenticationContext = createContext<Authentication | undefined>(undefined);

export const AuthenticationProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AuthenticationState>(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return { isAuthenticated: false };
    }
    return generateStateFromToken(token);
  });

  const authenticate = useCallback(
    (token: string) => {
      localStorage.setItem('token', token);
      setState(generateStateFromToken(token));
    },
    [setState]
  );

  const signout = useCallback(() => {
    localStorage.removeItem('token');
    setState({ isAuthenticated: false });
  }, [setState]);

  const contextValue = useMemo(() => ({ state, authenticate, signout }), [state, authenticate, signout]);

  return <AuthenticationContext.Provider value={contextValue}>{children}</AuthenticationContext.Provider>;
};

function generateStateFromToken(token: string): AuthenticationState {
  return { isAuthenticated: true, token, userId: jwtDecode<{ id: string }>(token).id };
}

import { createContext } from 'react';
import { IUser } from 'data';

interface ContextProps {
  token?: string;
  setToken: (e: any) => any;
  user?: IUser | null;
  setUser: (e: any) => any;

  login: (token: { token: string; type?: string }, userId: number, saveInStorage: boolean) => any;
  logout: () => any;
}

export const LoginContext = createContext<ContextProps>({
  user: undefined,
  setUser: (e: any) => {},
  token: undefined,
  setToken: (e: any) => {},

  login: (token: { token: string; type?: string }, userId: number, saveInStorage: boolean) => {},
  logout: () => {},
});

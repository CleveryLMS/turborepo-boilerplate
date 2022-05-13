import { createContext } from 'react';

interface ContextProps {
  themeMode?: 'light' | 'dark';
  setThemeMode: (e: any) => void;
}

export const ThemeContext = createContext<ContextProps>({
  themeMode: 'light',
  setThemeMode: (e: any) => {},
});

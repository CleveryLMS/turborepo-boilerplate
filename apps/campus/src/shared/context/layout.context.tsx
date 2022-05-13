import { createContext } from 'react';

interface ContextProps {
  showHeader?: boolean;
  setShowHeader: (e: any) => void;

  showSidebar?: boolean;
  setShowSidebar: (e: any) => void;

  onOpenSidebar?: (e: any) => void;

  isMobile?: any;
}

export const LayoutContext = createContext<ContextProps>({
  showHeader: true,
  setShowHeader: (e: any) => {},
  showSidebar: true,
  setShowSidebar: (e: any) => {},
});

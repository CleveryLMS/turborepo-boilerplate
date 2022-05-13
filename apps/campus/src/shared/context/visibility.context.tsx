import { createContext } from 'react';

export enum CampusPages {
  HOME = 'home',
  CURSOS = 'cursos',
  CERTIFICACIONES = 'certificaciones',
  FORO = 'foro',
  COMUNIDAD = 'comunidad',
  PERFIL = 'perfil',
  FAVORITOS = 'favoritos',
  REGISTER = 'register',
  PROCESOS = 'procesos',
  ROADMAP = 'roadmap',
  ONBOARDING = 'onboarding',
}

interface ContextProps {
  disabledPages?: CampusPages[];
  setDisabledPages: (pages: CampusPages[]) => void;
}

export const VisibilityContext = createContext<ContextProps>({
  disabledPages: [],
  setDisabledPages: (pages: CampusPages[]) => {},
});

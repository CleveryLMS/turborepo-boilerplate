import { createContext } from 'react';

import { IForoVoto } from 'data';

interface ContextProps {
  votos: IForoVoto[];
  addVoto: (voto: IForoVoto, tipo: 'pregunta' | 'respuesta') => void;
  updateVoto: (voto: IForoVoto, tipo: 'pregunta' | 'respuesta') => void;
  removeVoto: (voto: IForoVoto, tipo: 'pregunta' | 'respuesta') => void;
  filterVotos: (query: string) => void;
}

export const VotosContext = createContext<ContextProps>({
  votos: [],
  addVoto: (e: any, t: 'respuesta' | 'pregunta') => {},
  updateVoto: (e: any, t: 'respuesta' | 'pregunta') => {},
  removeVoto: (e: any, t: 'respuesta' | 'pregunta') => {},
  filterVotos: (q: string) => {},
});

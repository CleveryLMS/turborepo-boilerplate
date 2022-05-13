import { ApiItem, ICurso, IModulo, IUser } from '..';

export interface IForoTema extends ApiItem {
  titulo: string;
  descripcion: string;

  publicado: boolean;
  cursoId: number;
  moduloId?: number;
  fijado: boolean;

  curso?: ICurso;
  modulo?: IModulo;

  preguntas?: IForoPregunta[];

  meta?: {
    totalPreguntas?: number;
    totalVotosPositivos?: number;
    totalVotosNegativos?: number;
  };
}

export interface IForoPregunta extends ApiItem {
  titulo: string;
  contenido: string;

  temaId?: number;
  tema?: IForoTema;

  fijado: boolean;

  tipo: PreguntaTipoEnum;

  userId: number;
  user?: IUser;

  votos?: IForoVoto[];
  respuestas?: IForoRespuesta[];

  meta?: { totalRespuestas?: number; totalVotosPositivos?: number; totalVotosNegativos?: number };
}

export interface IForoRespuesta extends ApiItem {
  contenido: string;

  userId: number;
  preguntaId: number;

  fijado: boolean;

  votos?: IForoVoto[];

  user?: IUser;

  meta?: {
    totalVotosPositivos?: number;
    totalVotosNegativos?: number;
  };
}

export interface IForoVoto extends ApiItem {
  userId: number;
  positivo: boolean;

  preguntaId?: number;
  respuestaId?: number;
}

export enum PreguntaTipoEnum {
  ANUNCIO = 'anuncio',
  AYUDA = 'ayuda',
  NOTIFICACION_ERROR = 'notificacion_error',
  SUGERENCIA = 'sugerencia',
  PROYECTO = 'proyecto',
}

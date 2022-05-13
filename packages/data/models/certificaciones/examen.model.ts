import { ICurso } from '..';

import { ApiItem, ApiFile } from '../common.model';
import { ICertificacion } from './certificacion.model';

export interface IExamen extends ApiItem {
  nombre: string;
  duracion: number;
  publicado: boolean;
  esCertificacion: boolean;

  certificacionId?: number;
  certificacion?: ICertificacion;

  cursoId?: number;
  curso?: ICurso;

  descripcion: string;
  imagen?: ApiFile;
  numIntentos: number;
  numPreguntas: number;

  preguntas?: IPregunta[];

  meta?: {
    isActive: boolean;
    isCompleted: boolean;
  };
}

export interface IPregunta extends ApiItem {
  contenido: string;
  publicado: boolean;

  examenId: number;
  examen?: IExamen;

  respuestas?: IRespuesta[];
}

export interface IRespuesta extends ApiItem {
  contenido: string;
  publicado: boolean;

  correcta: boolean;

  preguntaId: number;
  pregunta?: IPregunta;
}

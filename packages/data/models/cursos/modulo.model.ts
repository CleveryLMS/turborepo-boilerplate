import { ApiItem } from '../common.model';

import { ICurso } from './curso.model';
import { ILeccion } from './leccion.model';

export interface IModulo extends ApiItem {
  titulo: string;
  cursoId: number;
  curso?: ICurso;
  orden: number;
  publicado: boolean;
  lecciones?: ILeccion[];

  meta?: {
    isBlocked: boolean;
    duracionTotal: number | null;
    leccionesCount: number;
    progresos_count: number;
  };
}

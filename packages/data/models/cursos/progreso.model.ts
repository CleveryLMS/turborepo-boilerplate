import { ApiItem } from '../common.model';

import { ICurso } from './curso.model';
import { IModulo } from './modulo.model';
import { ILeccion } from './leccion.model';

import { IRuta } from '../roadmap/ruta.model';
import { IUser } from '../usuarios/user.model';

export enum ProgresoTipoEnum {
  VISTO = 'visto',
  COMPLETADO = 'completado',
}

export interface IProgreso extends ApiItem {
  userId: number;
  user?: IUser;

  cursoId: number;
  curso?: ICurso;

  moduloId: number;
  modulo?: IModulo;

  leccionId: number;
  leccion?: ILeccion;

  tipo: ProgresoTipoEnum;
}

export interface IProgresoGlobal extends ApiItem {
  ruta?: IRuta;
  rutaId: number;
  rutasCompletadas?: string;

  user?: IUser;
  userId: number;

  cursosIniciados: string;
  cursosCompletados: string;

  certificacionesIniciadas: string;
  certificacionesCompletadas: string;

  tiempoTotal: number;
  progresoLecciones: any;

  meta?: {
    cursosIniciados: number[];
    cursosCompletados: number[];
    certificacionesIniciadas: number[];
    certificacionesCompletadas: number[];

    progresoCursos: number;
  };
}

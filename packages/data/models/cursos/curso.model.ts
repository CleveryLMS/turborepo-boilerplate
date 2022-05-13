import { ApiFile } from '..';
import { IUser } from '../usuarios/user.model';
import { ApiItem } from '../common.model';
import { IModulo } from './modulo.model';

export enum CursoNivelEnum {
  INICIAL = 'inicial',
  INTERMEDIO = 'intermedio',
  AVANZADO = 'avanzado',
  EXTRA = 'extra',
}

export interface ICurso extends ApiItem {
  titulo: string;
  publicado: boolean;
  disponible: boolean;
  descripcion: string;

  icono: string;
  iconoMonocromo?: string;

  profesorId: number;
  profesor?: IUser;

  imagen?: ApiFile;
  extra?: boolean;

  nivel: CursoNivelEnum;
  modulos?: IModulo[];

  meta?: {
    leccionesCount: number;
    progreso_count: number;
    modulosCompletados: number;
    isActive: boolean;
    isBlocked: boolean;
    isCompleted: boolean;
    duracionTotal: number;
  };
}

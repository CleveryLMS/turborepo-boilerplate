import { IHabilidad } from '..';
import { IExamen } from './examen.model';
import { ApiFile, ApiItem } from '../common.model';

export interface ICertificacion extends ApiItem {
  nombre: string;
  publicado: boolean;
  disponible: boolean;

  nivel: number;
  descripcion: string;

  imagen?: ApiFile;

  habilidadId: number;
  habilidad?: IHabilidad;

  examenes?: IExamen[];

  meta?: {
    isActive: boolean;
    isCompleted: boolean;
    duracionExamenes: number;
    examenesCount: string;
    examenesCompletados: number;
  };
}

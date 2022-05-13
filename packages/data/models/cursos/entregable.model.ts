import { ICurso, ILeccion, IUser } from '..';
import { ApiItem, ApiFile } from '../common.model';

export interface IEntregable extends ApiItem {
  userId: number;
  leccionId: number;
  contenido: string;

  puntuacion?: number;
  fechaEntrega?: any;
  fechaCorreccion?: any;
  observaciones?: string;
  correccionVista: boolean;
  estado: EntregableEstadoEnum;

  adjunto?: ApiFile;
  enlaceGithub?: string;

  cursoId?: number;
  moduloId?: number;

  user?: IUser;
  curso?: ICurso;

  leccion?: ILeccion;
}

export enum EntregableEstadoEnum {
  PENDIENTE_ENTREGA = 'pendiente_entrega',
  PENDIENTE_CORRECCION = 'pendiente_correccion',
  CORRECTO = 'correcto',
  ERROR = 'error',
}

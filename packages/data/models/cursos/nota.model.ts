import { ApiItem } from '../common.model';
import { IUser, ILeccion } from '..';

export interface INota extends ApiItem {
  titulo: string;
  contenido: string;

  user?: IUser;
  userId?: number;

  leccionId: number;
  leccion?: ILeccion;
}

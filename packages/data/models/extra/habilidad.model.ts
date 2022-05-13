import { ICertificacion } from '..';
import { ApiItem } from '../common.model';

export interface IHabilidad extends ApiItem {
  nombre: string;
  publicado: boolean;

  certificaciones?: ICertificacion[];
}

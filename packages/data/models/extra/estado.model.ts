import { ApiItem } from '../common.model';

export interface IEstado extends ApiItem {
  id: number;
  nombre: string;
  bandera: boolean;

  paisId: number;
}

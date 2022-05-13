import { ApiItem } from '../common.model';

export interface IPais extends ApiItem {
  id: number;
  nombre: string;
  bandera: boolean;
}

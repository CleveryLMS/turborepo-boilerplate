import { ApiItem } from '../common.model';

export interface IRuta extends ApiItem {
  nombre: string;
  itinerario: string;

  privada?: boolean;

  meta?: {
    itinerario: number[];
  };
}

import { IRuta } from '../roadmap/ruta.model';
import { ApiFile, ApiItem } from '../common.model';

export enum ProcesoRemotoEnum {
  PRESENCIAL = 'presencial',
  REMOTO = 'remoto',
  MIXTO = 'mixto',
}

export interface IProceso extends ApiItem {
  titulo: string;
  descripcion: string;

  tipoPuesto: string;
  tipoContrato: string;

  publicado: boolean;

  imagen?: ApiFile;

  numPlazas: number;
  salarioMax: number;
  salarioMin: number;
  habilidades?: string[];

  remoto: ProcesoRemotoEnum;
  localidad: string;
  bonificaciones: string;

  rutaId: number;
  ruta?: IRuta;
}

import { ApiItem } from '../common.model';
import { ICurso, IModulo, ILeccion, IProceso, IProyecto, IEntregable, ICertificacion } from '..';

export enum FavoritoTipoEnum {
  CURSO = 'curso',
  MODULO = 'modulo',
  LECCION = 'leccion',
  PROCESO = 'proceso',
  PROYECTO = 'proyecto',
  ENTREGABLE = 'entregable',
  CERTIFICACION = 'certificacion',
}

export interface IFavorito extends ApiItem {
  userId: number;
  objetoId: number;

  objeto?: ICurso | IModulo | ILeccion | IProceso | IProyecto | IEntregable | ICertificacion;

  tipo: FavoritoTipoEnum;
}

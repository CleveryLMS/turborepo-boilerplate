import { IUser } from './user.model';

export interface IStats extends IUser {
  actividadReciente?: UsuarioActividadEnum;
  porcentajeCompletadoRuta?: number;
}

export enum UsuarioActividadEnum {
  MUY_ACTIVO = 'muy_activo',
  ACTIVO = 'activo',
  SIN_ACTIVIDAD = 'sin_actividad',
}

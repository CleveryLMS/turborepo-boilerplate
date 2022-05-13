import { ApiItem } from '..';

export enum NotificacionTipoEnum {
  TODO = 'TODO',
}

export enum NotificacionOrigenEnum {
  CURSO = 'Curso',
  TEMA = 'Tema',
  PREGUNTA = 'Pregunta',
  CERTIFICACION = 'Certificacion',
}
export interface INotificacion extends ApiItem {
  titulo: string;
  contenido: string;

  origen: NotificacionOrigenEnum;

  relaciones: string[];
  tipo: NotificacionTipoEnum;
}

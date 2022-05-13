import { IModulo } from './modulo.model';
import { ApiItem } from '../common.model';
import { ISolucion } from '..';

export enum LeccionTipoEnum {
  VIDEO = 'video',
  MARKDOWN = 'markdown',
  DIAPOSITIVA = 'diapositiva',
  ENTREGABLE = 'entregable',
  RECURSO = 'recurso',
  ZOOM = 'zoom',
  AUTOCORREGIBLE = 'autocorregible',
}

export enum LeccionTipoContenidoEnum {
  TEXTO = 'texto',
  VIMEO = 'vimeo',
  YOUTUBE = 'youtube',
  SLIDES = 'slides',
  PPTX = 'pptx',
  PDF = 'pdf',
}

export interface ILeccion extends ApiItem {
  titulo: string;
  contenido: string;
  descripcion: string;
  duracion: number;
  tiempoDisponible?: number;

  solucion?: ISolucion;

  tipo: LeccionTipoEnum;
  tipoContenido?: LeccionTipoContenidoEnum;

  moduloId: number;
  modulo?: IModulo;

  orden: number;
  publicado: boolean;
  puntosClave?: IPuntoClave[];

  fechaPublicacion?: string;

  meta?: {
    isBlocked?: boolean;
    isCompleted?: boolean;
    indexOverModelo?: number;
  };
}

export interface IPuntoClave extends ApiItem {
  segundos: number;
  titulo: string;
  publicado: boolean;
  leccionId: number;
  leccion?: ILeccion;
}

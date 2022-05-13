import { ApiItem, ICertificacion, ICurso, IUser } from '..';

export interface IGrupo extends ApiItem {
  nombre: string;
  descripcion: string;

  rutaId?: number;
  isFundae?: boolean;

  users?: IUser[];
  cursos?: ICurso[];
  certificaciones?: ICertificacion[];
}

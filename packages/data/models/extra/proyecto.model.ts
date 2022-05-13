import { IHabilidad, IUser } from '..';
import { ApiFile, ApiItem } from '../common.model';

export interface IProyecto extends ApiItem {
  titulo: string;
  contenido: string;
  imagen?: ApiFile;

  publico: boolean;
  habilidades?: IHabilidad[];

  userId: number;
  user?: IUser;

  enlaceDemo: string;
  enlaceGithub: string;

  meta?: {
    isFavved: boolean;
    totalFavoritos: number;
  };
}

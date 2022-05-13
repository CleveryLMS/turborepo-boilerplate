import { IUser, ApiItem } from '..';

export interface ISesion extends ApiItem {
  userId?: number;
  user?: IUser;

  segundos: number;
}

// TODO
/**
 * Guardar el tiempo cuando empieza la sesión (a post)
 * createdAt: lo pongo manualmente
 * segundos: total de segundos de la sesión activa
 *
 * https://www.npmjs.com/package/react-idle-timer
 */

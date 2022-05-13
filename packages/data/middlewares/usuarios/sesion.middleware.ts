import { ISesion } from '../../models';
import { get, post, put } from '../../services';
import { POST_HttpResponse, PropsByID, PUT_HttpResponse } from '../_middleware';

const ENDPOINT = '/openAPI/sesiones/';

export const addSesion = (sesion: { createdAt: any; segundos: any }) => {
  return post(ENDPOINT, sesion)
    .then((response: POST_HttpResponse) => ({
      message: `Sesión creada correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: POST_HttpResponse) => {
      throw {
        title: 'Error inesperado',
        message:
          error.message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

export const getSesionActual = () => {
  return get('/openAPI/sesionactual')
    .then((response: any) => ({
      message: `Sesión actual encontrada.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: any) => error);
};

export const updateSesion = ({
  id,
  sesion,
}: PropsByID & { sesion: ISesion }) => {
  return put(ENDPOINT + id, sesion)
    .then((response: PUT_HttpResponse) => ({
      message: `Sesión actualizada correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: PUT_HttpResponse) => {
      throw {
        title: 'Error inesperado',
        message:
          error.message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

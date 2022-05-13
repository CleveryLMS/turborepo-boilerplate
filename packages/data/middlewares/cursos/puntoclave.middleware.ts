import { extractQuery } from '../_utils';
import { IPuntoClave } from '../../models';
import { get, post, put, remove } from '../../services';
import {
  GETID_HttpResponse,
  POST_HttpResponse,
  PropsByID,
  PropsByQuery,
  PUT_HttpResponse,
  REMOVE_HttpResponse,
} from '..';

const ENDPOINT_ADMIN = '/godAPI/puntosClave/';

export const getPuntosClave = async ({ query }: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  let dataPuntosClave: GETID_HttpResponse = await get(
    ENDPOINT_ADMIN + queryTxt
  );

  if (!dataPuntosClave || dataPuntosClave instanceof Error) return undefined;
  else return dataPuntosClave.data.data;
};

export const addPuntoClave = ({ puntoClave }: { puntoClave: IPuntoClave }) => {
  return post(ENDPOINT_ADMIN, puntoClave)
    .then((response: POST_HttpResponse) => ({
      message: `Punto clave creado correctamente.`,
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

export const updatePuntoClave = ({
  id,
  puntoClave,
}: PropsByID & { puntoClave: any }) => {
  return put(ENDPOINT_ADMIN + id, puntoClave)
    .then((response: PUT_HttpResponse) => ({
      message: `Punto clave ${puntoClave.titulo} actualizado correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: PUT_HttpResponse) => {
      let message;

      if (error.errors && error.errors.length > 0)
        message = error.errors.reduce(
          (acc, err) => (acc += `\n${err.message}`),
          ''
        );
      else message = error.message;

      throw {
        title: 'Error inesperado',
        message:
          message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

export const removePuntoClave = ({ id }: PropsByID) => {
  return remove(ENDPOINT_ADMIN + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Punto clave ${response.data} eliminado correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: REMOVE_HttpResponse) => {
      throw {
        title: 'Error inesperado',
        message:
          error.message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

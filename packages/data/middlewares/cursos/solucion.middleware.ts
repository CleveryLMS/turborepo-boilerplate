import { extractQuery } from '../_utils';
import { ISolucion } from '../../models';
import { get, post, put, remove } from '../../services';
import {
  PropsByQuery,
  GET_HttpResponse,
  POST_HttpResponse,
  PropsByID,
  PUT_HttpResponse,
  REMOVE_HttpResponse,
} from '..';

const ENDPOINT_ADMIN = '/godAPI/soluciones/';

export const getSoluciones = async ({ query }: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  let dataSolucions: GET_HttpResponse = await get(ENDPOINT_ADMIN + queryTxt);

  if (!dataSolucions || dataSolucions instanceof Error) return undefined;
  else return dataSolucions.data;
};

export const addSolucion = ({ solucion }: { solucion: ISolucion }) => {
  return post(ENDPOINT_ADMIN, solucion)
    .then((response: POST_HttpResponse) => ({
      message: `Solucion creada correctamente.`,
      value: response.data.data,
      fullResponse: response,
    }))
    .catch((error: POST_HttpResponse) => {
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

export const updateSolucion = ({
  id,
  solucion,
}: PropsByID & { solucion: any }) => {
  return put(ENDPOINT_ADMIN + id, solucion)
    .then((response: PUT_HttpResponse) => ({
      message: `Solucion actualizada correctamente.`,
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

export const removeSolucion = ({ id }: PropsByID) => {
  return remove(ENDPOINT_ADMIN + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Solucion eliminada correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: REMOVE_HttpResponse) => {
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

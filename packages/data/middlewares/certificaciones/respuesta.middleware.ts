import { IRespuesta } from '../../models';
import { get, post, put, remove } from '../../services';
import {
  GET_HttpResponse,
  POST_HttpResponse,
  PropsByID,
  PropsByQuery,
  PUT_HttpResponse,
  REMOVE_HttpResponse,
} from '../_middleware';
import { extractQuery } from '../_utils';

const ENDPOINT = '/godAPI/respuestas/';

export const getRespuestas = async ({
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const dataRespuestas: GET_HttpResponse = await get(`${ENDPOINT}${queryTxt}`);

  if (!dataRespuestas || dataRespuestas instanceof Error) return undefined;
  else return dataRespuestas.data;
};

export const addRespuesta = ({ respuesta }: { respuesta: IRespuesta }) => {
  return post(ENDPOINT, respuesta)
    .then((response: POST_HttpResponse) => ({
      message: `Respuesta creada correctamente.`,
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

export const updateRespuesta = ({
  id,
  respuesta,
}: PropsByID & { respuesta: IRespuesta }) => {
  return put(ENDPOINT + id, respuesta)
    .then((response: PUT_HttpResponse) => ({
      message: `Respuesta actualizada correctamente.`,
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

export const removeRespuesta = ({ id }: PropsByID) => {
  return remove(ENDPOINT + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Respuesta eliminada correctamente.`,
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

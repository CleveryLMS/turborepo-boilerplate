import { IPregunta } from '../../models';
import { extractQuery } from '../_utils';
import { get, post, put, remove } from '../../services';
import { PropsByID, PropsByQuery } from './../_middleware';
import {
  GET_HttpResponse,
  POST_HttpResponse,
  PUT_HttpResponse,
  REMOVE_HttpResponse,
} from '../_middleware';

const ENDPOINT = '/godAPI/preguntas/';

export const getPreguntas = async ({
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const dataPreguntas: GET_HttpResponse = await get(`${ENDPOINT}${queryTxt}`);

  if (!dataPreguntas || dataPreguntas instanceof Error) return undefined;
  else return dataPreguntas.data;
};

export const addPregunta = ({ pregunta }: { pregunta: IPregunta }) => {
  return post(ENDPOINT, pregunta)
    .then((response: POST_HttpResponse) => ({
      message: `Pregunta creada correctamente.`,
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

export const updatePregunta = ({
  id,
  pregunta,
}: PropsByID & { pregunta: IPregunta }) => {
  return put(ENDPOINT + id, pregunta)
    .then((response: PUT_HttpResponse) => ({
      message: `Pregunta actualizada correctamente.`,
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

export const removePregunta = ({ id }: PropsByID) => {
  return remove(ENDPOINT + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Pregunta eliminada correctamente.`,
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

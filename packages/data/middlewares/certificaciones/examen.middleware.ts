import { PropsByID, PropsByQuery } from './../_middleware';
import useSWR from 'swr';

import { IExamen } from '../../models';
import { get, post, put, remove } from '../../services';
import {
  GET_HttpResponse,
  GETID_HttpResponse,
  POST_HttpResponse,
  PUT_HttpResponse,
  REMOVE_HttpResponse,
} from '../_middleware';
import { extractQuery, shouldFetch } from '../_utils';

const ENDPOINT_ADMIN = '/godAPI/examenes/';
const ENDPOINT_CAMPUS = '/openAPI/examenes/';

export const useExamenes = ({
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR(
    shouldFetch(strategy, query) ? ENDPOINT_CAMPUS + queryTxt : null,
    get
  );

  return {
    examenes: data?.data?.data,
    isLoading: !error && !data,
    isError: error !== undefined || data?.error === 404,
  };
};

export const getExamenes = async ({
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);

  const dataExamenes: GET_HttpResponse = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + queryTxt
  );

  if (!dataExamenes || dataExamenes instanceof Error) return undefined;
  else return dataExamenes.data;
};

export const getExamenByID = async ({ id, client }: PropsByID) => {
  const dataExamen: GETID_HttpResponse = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id
  );

  if (!dataExamen || dataExamen instanceof Error) return undefined;
  else return dataExamen.data;
};

export const hacerExamen = async ({
  id,
  respuestas,
}: PropsByID & { respuestas: any }) => {
  const results: any = await post('/openAPI/especial/hacerExamen/' + id, {
    respuestas,
  });

  if (results instanceof Error || results.isAxiosError)
    return Promise.reject('Ha ocurrido un error inesperado');
  else {
    const data: {
      aprobada: true;
      totalCorrectas: number;
      totalPreguntas: number;
    } = results.data.data;

    return data;
  }
};

export const addExamen = ({ examen }: { examen: IExamen }) => {
  return post(ENDPOINT_ADMIN, examen)
    .then((response: POST_HttpResponse) => ({
      message: `Examen ${examen.nombre} creada correctamente.`,
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

export const updateExamen = ({
  id,
  examen,
}: PropsByID & { examen: IExamen }) => {
  return put(ENDPOINT_ADMIN + id, examen)
    .then((response: PUT_HttpResponse) => ({
      message: `Examen ${examen.nombre} actualizada correctamente.`,
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

export const removeExamen = ({ id }: PropsByID) => {
  return remove(ENDPOINT_ADMIN + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Examen eliminado correctamente.`,
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

import useSWR from 'swr';

import {
  PropsByID,
  PropsByQuery,
  PUT_HttpResponse,
  GET_HttpResponse,
  POST_HttpResponse,
  GETID_HttpResponse,
  REMOVE_HttpResponse,
} from '../_middleware';
import { INota } from '../../models';
import { extractQuery, shouldFetch } from '../_utils';
import { get, post, put, remove } from '../../services';

const ENDPOINT = '/openAPI/notas/';

export const useNota = ({
  id = 0,
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByID) => {
  const { data, error } = useSWR(
    shouldFetch(strategy, query, true, id) ? ENDPOINT + id : null,
    get
  );

  return {
    nota: data?.data,
    isLoading: !error && !data,
    isError: error !== undefined || data?.error === 404,
  };
};

export const useNotas = ({
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR(
    shouldFetch(strategy, query) ? `${ENDPOINT}${queryTxt}` : null,
    get
  );

  return {
    notas: data?.data?.data,
    isLoading: !error && !data,
    isError: error !== undefined || data?.error === 404,
  };
};

export const getNotas = async ({
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const dataNotas: GET_HttpResponse = await get(`${ENDPOINT}${queryTxt}`);

  if (!dataNotas || dataNotas instanceof Error) return undefined;
  else return dataNotas.data;
};

export const getNotaByID = async ({ id }: PropsByID) => {
  const dataNota: GETID_HttpResponse = await get(ENDPOINT + id);

  if (!dataNota || dataNota instanceof Error) return undefined;
  else return dataNota.data;
};

export const addNota = ({ nota }: { nota: INota }) => {
  return post(ENDPOINT, nota)
    .then((response: POST_HttpResponse) => ({
      message: `Nota creada correctamente.`,
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

export const updateNota = ({ id, nota }: PropsByID & { nota: any }) => {
  return put(ENDPOINT + id, nota)
    .then((response: PUT_HttpResponse) => ({
      message: `Nota actualizada correctamente.`,
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

export const deleteNota = ({ id }: PropsByID) => {
  return remove(ENDPOINT + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Nota eliminada correctamente.`,
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

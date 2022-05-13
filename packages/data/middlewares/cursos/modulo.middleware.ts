import useSWR from 'swr';

import {
  PropsByID,
  PropsByQuery,
  GET_HttpResponse,
  GETID_HttpResponse,
  POST_HttpResponse,
  PUT_HttpResponse,
  REMOVE_HttpResponse,
} from '../_middleware';
import { IModulo } from '../../models';
import { extractQuery, shouldFetch } from '../_utils';
import { get, post, put, remove } from '../../services';

const ENDPOINT_ADMIN = '/godAPI/modulos/';
const ENDPOINT_CAMPUS = '/openAPI/modulos/';

export const getModulos = async ({
  query = [],
  client = 'campus',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const dataModulos: GET_HttpResponse = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + queryTxt
  );

  if (!dataModulos || dataModulos instanceof Error) return undefined;
  else return dataModulos.data;
};

export const getModuloByID = async ({ id, client }: PropsByID) => {
  const dataModulo: GETID_HttpResponse = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id
  );

  if (!dataModulo || dataModulo instanceof Error) return undefined;
  else return dataModulo.data;
};

export const useModulos = ({
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR(
    shouldFetch(strategy, query)
      ? (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + queryTxt
      : null,
    get
  );

  return {
    modulos: data?.error === undefined ? data?.data?.data : undefined,
    isLoading: !error && !data,
    isError: error !== undefined || data?.error === 404,
  };
};

export const addModulo = ({ modulo }: { modulo: IModulo }) => {
  return post(ENDPOINT_ADMIN, modulo)
    .then((response: POST_HttpResponse) => ({
      message: `Modulo ${modulo.titulo} creado correctamente.`,
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

export const updateModulo = ({ id, modulo }: PropsByID & { modulo: any }) => {
  return put(ENDPOINT_ADMIN + id, modulo)
    .then((response: PUT_HttpResponse) => ({
      message: `Modulo ${modulo.titulo} actualizado correctamente.`,
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

export const removeModulo = ({ id }: PropsByID) => {
  return remove(ENDPOINT_ADMIN + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Modulo ${response.data} eliminado correctamente.`,
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

import useSWR from 'swr';

import {
  GET_HttpResponse,
  GETID_HttpResponse,
  POST_HttpResponse,
  PUT_HttpResponse,
  REMOVE_HttpResponse,
  PropsByID,
  PropsByQuery,
} from '..';
import { IGrupo } from '../../models';
import { extractQuery, shouldFetch } from '../_utils';
import { get, post, put, remove } from '../../services';

const ENDPOINT_ADMIN = '/godAPI/grupos/';
const ENDPOINT_CAMPUS = '/openAPI/grupos/';

export const useGrupos = ({
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR(
    shouldFetch(strategy, query) ? ENDPOINT_ADMIN + queryTxt : null,
    get
  );

  return {
    grupos: data?.data,
    isLoading: !error && !data,
    isError: error !== undefined || data?.error === 404,
  };
};

export const getGrupos = async ({
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  let dataGrupos: GET_HttpResponse = await get(ENDPOINT_ADMIN + queryTxt);

  if (!dataGrupos || dataGrupos instanceof Error) return undefined;
  else return dataGrupos.data;
};

export const getGrupoByID = async ({ id }: PropsByID) => {
  let dataGrupo: GETID_HttpResponse = await get(ENDPOINT_ADMIN + id);

  if (!dataGrupo || dataGrupo instanceof Error) return undefined;
  else return dataGrupo.data;
};

export const addGrupo = ({ grupo }: { grupo: IGrupo }) => {
  return post(ENDPOINT_ADMIN, grupo)
    .then((response: POST_HttpResponse) => ({
      message: `Grupo creado correctamente.`,
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

export const updateGrupo = ({ id, grupo }: PropsByID & { grupo: any }) => {
  return put(ENDPOINT_ADMIN + id, grupo)
    .then((response: PUT_HttpResponse) => ({
      message: `Grupo actualizado correctamente.`,
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

export const removeGrupo = ({ id }: PropsByID) => {
  return remove(ENDPOINT_ADMIN + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Grupo eliminado correctamente.`,
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

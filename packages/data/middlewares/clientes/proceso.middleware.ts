import useSWR from 'swr';

import { getRutaByID } from '..';
import { IProceso } from '../../models';
import { get, post, put, remove } from '../../services';
import {
  POST_HttpResponse,
  GET_HttpResponse,
  PropsByID,
  PropsByQuery,
  PUT_HttpResponse,
  REMOVE_HttpResponse,
  GETID_HttpResponse,
} from '../_middleware';
import { extractQuery, shouldFetch } from '../_utils';

const ENDPOINT_ADMIN = '/godAPI/procesos/';
const ENDPOINT_CAMPUS = '/openAPI/procesos/';

export const getProcesos = async ({
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  if (!shouldFetch(strategy, query)) return undefined;

  let [queryTxt, errors] = extractQuery(query);
  let dataProcesos: GET_HttpResponse = await get(ENDPOINT_ADMIN + queryTxt);

  if (!dataProcesos || dataProcesos instanceof Error) return undefined;
  else return dataProcesos.data;
};

export const getProceso = async ({
  id,
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
}: PropsByID) => {
  if (!shouldFetch(strategy, query, true, id)) return undefined;

  let dataProceso: GETID_HttpResponse = await get(ENDPOINT_ADMIN + id);

  if (!dataProceso || dataProceso instanceof Error) return undefined;
  else return dataProceso.data;
};

export const useProceso = ({
  id = 0,
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
}: PropsByID) => {
  const { data, error } = useSWR(
    shouldFetch(strategy, query, true, id) ? ENDPOINT_CAMPUS + id : null,
    (e) =>
      get(e).then((data) => treatDataProceso({ dataProceso: data, client }))
  );

  return {
    proceso: data?.error === undefined ? data : undefined,
    isLoading: !error && !data,
    isError: error !== undefined || data?.error === 404,
  };
};

const treatDataProceso = async ({
  dataProceso,
  client = 'campus',
}: {
  dataProceso: any;
  client: 'admin' | 'campus';
}) => {
  if (!dataProceso?.data) return undefined;

  const dataRuta = await getRutaByID({ id: dataProceso.data.rutaId, client });

  dataProceso.data.ruta = dataRuta;

  return dataProceso.data;
};

export const useProcesos = ({
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR(
    shouldFetch(strategy, query) ? ENDPOINT_CAMPUS + queryTxt : null,
    get
  );

  return {
    procesos: data?.data,
    isLoading: !error && !data,
    isError: error !== undefined || data?.error === 404,
  };
};

export const useCheckProceso = ({
  id = 0,
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByID) => {
  const { data, error } = useSWR(
    shouldFetch(strategy, query, true, id)
      ? '/openAPI/checkProceso/' + id
      : null,
    get
  );

  return {
    isAbleToApply: data?.data,
    isLoading: !error && !data,
    isError: error !== undefined || data?.error === 404,
  };
};

export const applyToProceso = async ({ id }: PropsByID) => {
  return post(`/openAPI/applyToProceso/${id}`, {})
    .then((response: POST_HttpResponse) => ({
      message: `Suscripción a vacante procesada correctamente.`,
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

export const removeFromProceso = async ({ id }: PropsByID) => {
  return remove(`/openAPI/removeFromProceso/${id}`)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Se ha eliminado la suscripción a la vacante.`,
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

export const addProceso = ({ proceso }: { proceso: IProceso }) => {
  return post(ENDPOINT_ADMIN, proceso)
    .then((response: POST_HttpResponse) => ({
      message: `Proceso ${proceso.titulo} creado correctamente.`,
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

export const updateProceso = ({
  id,
  client = 'campus',
  proceso,
}: PropsByID & { proceso: any }) => {
  return put(ENDPOINT_ADMIN + id, proceso)
    .then((response: PUT_HttpResponse) => ({
      message: `Proceso actualizado correctamente.`,
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

export const removeProceso = ({ id, client }: PropsByID) => {
  return remove(ENDPOINT_ADMIN + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Proceso eliminado correctamente.`,
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

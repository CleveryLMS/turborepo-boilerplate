import useSWR from 'swr';
import { ILeccion } from '../../models';

import { get, post, put, remove } from '../../services';
import {
  GETID_HttpResponse,
  GET_HttpResponse,
  POST_HttpResponse,
  PropsByID,
  PropsByQuery,
  PUT_HttpResponse,
  REMOVE_HttpResponse,
} from '../_middleware';
import { extractQuery, shouldFetch } from '../_utils';

const ENDPOINT_ADMIN = '/godAPI/lecciones/';
const ENDPOINT_CAMPUS = '/openAPI/lecciones/';

export const getLecciones = async ({
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const dataLecciones: GET_HttpResponse = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + queryTxt
  );

  if (!dataLecciones || dataLecciones instanceof Error) return undefined;
  else return dataLecciones.data;
};

export const getLeccionByID = async ({ id, client }: PropsByID) => {
  const dataLeccion: GETID_HttpResponse = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id
  );

  if (!dataLeccion || dataLeccion instanceof Error) return undefined;
  else return dataLeccion.data;
};

export const useLeccion = ({
  id = 0,
  client,
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByID) => {
  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR(
    shouldFetch(strategy, query, true, id)
      ? `${
          client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS
        }${id}${queryTxt}`
      : null,
    (e: any) => get(e)
  );

  return {
    leccion: data?.error === undefined ? data?.data : undefined,
    isLoading: !error && !data,
    isError: error || data?.error === 404,
  };
};

export const useLecciones = ({
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
    lecciones: data?.error === undefined ? data?.data?.data : undefined,
    isLoading: !error && !data,
    isError: error !== undefined || data?.error === 404,
  };
};

export const useLeccionesCalendario = ({
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const { data, error } = useSWR(
    shouldFetch(strategy, query)
      ? '/openAPI/leccionesCalendario/' + queryTxt
      : null,
    get
  );

  return {
    eventos: data?.error === undefined ? data?.data?.data : undefined,
    isLoading: !error && !data,
    isError: error !== undefined || data?.error === 404,
  };
};

export const addLeccion = ({ leccion }: { leccion: ILeccion }) => {
  return post(ENDPOINT_ADMIN, leccion)
    .then((response: POST_HttpResponse) => ({
      message: `Lección ${leccion.titulo} creada correctamente.`,
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

export const updateLeccion = ({
  id,
  leccion,
  client = 'campus',
}: PropsByID & { leccion: any }) => {
  return put(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id,
    leccion
  )
    .then((response: PUT_HttpResponse) => ({
      message: `Lección ${leccion.titulo} actualizada correctamente.`,
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

export const removeLeccion = (id?: number) => {
  return remove(ENDPOINT_ADMIN + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Lección ${response.data} eliminada correctamente.`,
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

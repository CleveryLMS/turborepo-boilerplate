import useSWR from 'swr';
import {
  PropsByQuery,
  GET_HttpResponse,
  GETID_HttpResponse,
  POST_HttpResponse,
  PropsByID,
  PUT_HttpResponse,
  REMOVE_HttpResponse,
} from '..';
import { IPlantilla } from '../../models';
import { get, post, put, remove } from '../../services';
import { extractQuery, shouldFetch } from '../_utils';

const ENDPOINT_ADMIN = '/godAPI/plantillas/';
const ENDPOINT_CAMPUS = '/openAPI/plantillas/';

export const usePlantillas = ({
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
    data: data?.data,
    isLoading: !error && !data,
    isError: error !== undefined || data?.error === 404,
  };
};

export const getPlantillas = async ({
  query = [],
  client = 'campus',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const dataPlantillas: GET_HttpResponse = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + queryTxt
  );

  if (!dataPlantillas || dataPlantillas instanceof Error) return undefined;
  else return dataPlantillas.data;
};

export const getPlantilla = async ({ id, client }: PropsByID) => {
  const dataPlantilla: GETID_HttpResponse = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id
  );

  if (!dataPlantilla || dataPlantilla instanceof Error) return undefined;
  else return dataPlantilla.data;
};

export const addPlantilla = ({ plantilla }: { plantilla: IPlantilla }) => {
  return post(ENDPOINT_ADMIN, plantilla)
    .then((response: POST_HttpResponse) => ({
      message: `Plantilla ${plantilla.titulo} creado correctamente.`,
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

export const updatePlantilla = ({
  id,
  plantilla,
}: PropsByID & { plantilla: any }) => {
  return put(ENDPOINT_ADMIN + id, plantilla)
    .then((response: PUT_HttpResponse) => ({
      message: `Plantilla actualizada correctamente.`,
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

export const removePlantilla = ({ id }: PropsByID) => {
  return remove(ENDPOINT_ADMIN + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Plantilla eliminada correctamente.`,
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

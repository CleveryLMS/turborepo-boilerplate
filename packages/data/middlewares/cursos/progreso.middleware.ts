import { extractQuery } from '../_utils';
import { IProgreso } from '../../models';
import { get, post } from '../../services';
import {
  PropsByID,
  GET_HttpResponse,
  GETID_HttpResponse,
  POST_HttpResponse,
  PropsByQuery,
} from '../_middleware';

const ENDPOINT = '/openAPI/progresos/';

export const getProgresos = async ({ query }: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);

  const dataProgresos: GET_HttpResponse = await get(ENDPOINT + queryTxt);

  if (!dataProgresos || dataProgresos instanceof Error) return undefined;
  else return dataProgresos.data;
};

export const getProgresoByID = async ({ id }: PropsByID) => {
  const dataProgreso: GETID_HttpResponse = await get(ENDPOINT + id);

  if (!dataProgreso || dataProgreso instanceof Error) return undefined;
  else return dataProgreso.data;
};

export const addProgreso = ({ progreso }: { progreso: IProgreso }) => {
  return post(ENDPOINT, progreso)
    .then((response: POST_HttpResponse) => ({
      message: `Progreso creado correctamente.`,
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

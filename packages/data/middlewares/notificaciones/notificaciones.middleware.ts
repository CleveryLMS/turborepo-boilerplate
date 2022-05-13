import {
  PropsByID,
  PropsByQuery,
  PUT_HttpResponse,
  GET_HttpResponse,
} from '../_middleware';
import { extractQuery } from '../_utils';
import { get, post, put } from '../../services';

const ENDPOINT_CAMPUS = '/openAPI/notificaciones/';

export const getNotificaciones = async ({
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);

  const dataNotificaciones: GET_HttpResponse = await get(
    `${ENDPOINT_CAMPUS}${queryTxt}`
  );

  if (!dataNotificaciones || dataNotificaciones instanceof Error)
    return undefined;
  else return dataNotificaciones.data;
};

export const updateNotificacion = ({ id }: PropsByID) => {
  return put(ENDPOINT_CAMPUS + id, {})
    .then((response: PUT_HttpResponse) => ({
      message: `Notificacion actualizada correctamente.`,
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

export const subscribeNotificaciones = ({
  lista,
  subscribe,
}: {
  lista: string;
  subscribe?: boolean;
}) => {
  return post(ENDPOINT_CAMPUS + (subscribe ? 'subscribe' : 'unsubscribe'), {
    lista,
  })
    .then((response: PUT_HttpResponse) => ({
      message: `${
        subscribe ? 'Suscrito a' : 'Desuscrito de'
      } la lista de notificaciones correctamente`,
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

import useSWR from 'swr';

import {
  PropsByID,
  PropsByQuery,
  GET_HttpResponse,
  GETID_HttpResponse,
  POST_HttpResponse,
  PUT_HttpResponse,
} from '../_middleware';
import { get, post, put } from '../../services';
import { getCursos } from '../cursos/curso.middleware';
import { IEntregable, EntregableEstadoEnum } from '../../models';
import { extractQuery, shouldFetch } from '../_utils';

const ENDPOINT_ADMIN = '/godAPI/entregables/';
const ENDPOINT_CAMPUS = '/openAPI/entregables/';

export const getEntregables = async ({
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  if (!shouldFetch(strategy, query)) return undefined;

  let [queryTxt, errors] = extractQuery(query);

  const dataEntregables: GET_HttpResponse = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + queryTxt
  );

  if (!dataEntregables || dataEntregables instanceof Error) return undefined;
  else if (client === 'campus') return dataEntregables.data;
  else return await treatData({ dataEntregables, client });
};

export const useEntregables = ({
  query,
  client = 'campus',
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR(
    shouldFetch(strategy, query)
      ? (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + queryTxt
      : null,
    (e) =>
      get(e).then((data) => {
        if (data.isAxiosError) return { error: data };
        else if (client === 'campus') return data?.data;
        else return treatData({ dataEntregables: data, client });
      })
  );

  return {
    data: data?.error === undefined ? data : undefined,
    isLoading: !error && !data,
    isError: error !== undefined || data?.error === 404,
  };
};

export const getEntregableByID = async ({ id, client }: PropsByID) => {
  let dataEntregable: GETID_HttpResponse = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id
  );

  if (!dataEntregable || dataEntregable instanceof Error) return undefined;
  else return dataEntregable.data;
};

export const addEntregable = ({ entregable }: { entregable: IEntregable }) => {
  return post(ENDPOINT_CAMPUS, entregable)
    .then((response: POST_HttpResponse) => ({
      message: `Entregable creado correctamente.`,
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

export const updateEntregable = ({
  id,
  entregable,
  client = 'campus',
}: PropsByID & { entregable: any }) => {
  return put(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id,
    entregable
  )
    .then((response: PUT_HttpResponse) => ({
      message: `Entregable actualizado correctamente.`,
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

export const removeEntregableAdjunto = ({ id }: PropsByID) => {
  return put(ENDPOINT_CAMPUS + id + '?borra_adjunto=true', {})
    .then((response: PUT_HttpResponse) => ({
      message: `Entregable borrado correctamente.`,
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

export const removeEntregableGithub = ({ id }: PropsByID) => {
  return put(ENDPOINT_CAMPUS + id + '?borra_github=true', {})
    .then((response: PUT_HttpResponse) => ({
      message: `Entregable borrado correctamente.`,
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

export const uploadAdjuntoEntregable = ({
  id,
  adjunto,
}: PropsByID & { adjunto: File }) => {
  const form = new FormData();

  form.append('adjunto', adjunto);
  form.append('estado', EntregableEstadoEnum.PENDIENTE_CORRECCION);
  form.append('fechaEntrega', new Date().toISOString());

  return put(ENDPOINT_CAMPUS + id, form)
    .then((response: PUT_HttpResponse) => ({
      message: `Adjunto subido correctamente.`,
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

const treatData = async ({
  dataEntregables,
  client,
}: {
  dataEntregables: any;
  client: 'admin' | 'campus';
}) => {
  if (!dataEntregables?.data) return undefined;

  for (const entregable of dataEntregables.data.data || []) {
    let _curso = await getCursos({
      client,
      strategy: 'invalidate-on-undefined',
      query: [{ leccion_id: entregable?.leccionId }],
    });

    entregable.meta = { curso: _curso?.data[0] };
  }

  return dataEntregables.data;
};

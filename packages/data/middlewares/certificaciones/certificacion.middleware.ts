import useSWR from 'swr';

import {
  PropsByID,
  PropsByQuery,
  GET_HttpResponse,
  GETID_HttpResponse,
  PUT_HttpResponse,
  REMOVE_HttpResponse,
} from '../_middleware';
import { getHabilidadByID } from '..';
import { extractQuery, shouldFetch } from '../_utils';
import { IExamen, ICertificacion } from '../../models';
import { get, post, put, remove } from '../../services';

const ENDPOINT_ADMIN = '/godAPI/certificaciones/';
const ENDPOINT_CAMPUS = '/openAPI/certificaciones/';

export const useCertificacion = ({
  id = 0,
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
  certificacionesIniciadas,
  certificacionesCompletadas,
}: PropsByID & {
  certificacionesIniciadas: number[];
  certificacionesCompletadas: number[];
}) => {
  const { data, error } = useSWR(
    shouldFetch(strategy, query, true, id)
      ? (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id
      : null,
    (e) =>
      get(e).then((e) =>
        treatData(e, certificacionesIniciadas, certificacionesCompletadas)
      )
  );

  const treatData = (
    dataCertificacion: any,
    certificacionesIniciadas: number[],
    certificacionesCompletadas: number[]
  ) => {
    if (!dataCertificacion?.data) return undefined;

    dataCertificacion.data.meta = {
      ...dataCertificacion.data.meta,
      isActive: !!certificacionesIniciadas.find(
        (id) => id === dataCertificacion.data.id
      ),
      isCompleted: !!certificacionesCompletadas.find(
        (id) => id === dataCertificacion.data.id
      ),
      duracionTotal: dataCertificacion.data.examenes.reduce(
        (acc: number, ex: IExamen) => (acc += ex.duracion),
        0
      ),
    };

    return dataCertificacion.data;
  };

  return {
    certificacion: data,
    isLoading: !error && !data,
    isError: error !== undefined || data?.error === 404,
  };
};

export const useCertificaciones = ({
  query = [],
  client = 'campus',
  strategy = 'invalidate-on-undefined',
  certificacionesIniciadas,
  certificacionesCompletadas,
}: PropsByQuery & {
  certificacionesIniciadas?: number[];
  certificacionesCompletadas?: number[];
}) => {
  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR(
    shouldFetch(strategy, query)
      ? (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + queryTxt
      : null,
    (e) =>
      get(e).then((data) => {
        if (data.isAxiosError || data.error) return { error: data };
        else if (client === 'admin') return data?.data;
        else return treatData(data);
      })
  );

  const treatData = (dataCertificaciones: any) => {
    if (!dataCertificaciones?.data) return [];

    for (const certificacion of dataCertificaciones?.data?.data || []) {
      const examenes: IExamen[] = certificacion.examenes || [];

      certificacion.meta = {
        ...certificacion.meta,
        isActive: !!certificacionesIniciadas?.find(
          (id) => id === certificacion.id
        ),
        isCompleted: !!certificacionesCompletadas?.find(
          (id) => id === certificacion.id
        ),
        duracionTotal: examenes.reduce(
          (acc: number, ex: IExamen) => (acc += ex.duracion),
          0
        ),
      };
    }

    return dataCertificaciones.data.data;
  };

  return {
    certificaciones: data?.error === undefined ? data : undefined,
    isLoading: !error && !data,
    isError: error || data?.error,
  };
};

export const getCertificacionesRequeridas = async ({
  query = [],
  certificacionesIniciadas,
  certificacionesCompletadas,
}: PropsByQuery & {
  certificacionesIniciadas: number[];
  certificacionesCompletadas: number[];
}) => {
  let [queryTxt, errors] = extractQuery(query);
  const dataCertis = await get(
    '/openAPI/especial/certificacionesRequeridas/' + queryTxt
  );

  const treatData = (dataCertificaciones: any) => {
    if (!dataCertificaciones?.data) return undefined;

    for (const certificacion of dataCertificaciones.data.data) {
      const examenes: IExamen[] = certificacion.examenes || [];

      certificacion.meta = {
        ...certificacion.meta,
        isActive: !!certificacionesIniciadas.find(
          (id) => id === certificacion.id
        ),
        isCompleted: !!certificacionesCompletadas.find(
          (id) => id === certificacion.id
        ),
        duracionTotal: examenes.reduce(
          (acc: number, ex: IExamen) => (acc += ex.duracion),
          0
        ),
      };
    }

    return dataCertificaciones.data.data;
  };

  return await treatData(dataCertis);
};

export const getCertificaciones = async ({
  query,
  client = 'campus',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const dataCertificaciones: GET_HttpResponse = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + queryTxt
  );

  if (!dataCertificaciones || dataCertificaciones instanceof Error)
    return undefined;
  else {
    for (const certificacion of dataCertificaciones.data.data) {
      const examenes: IExamen[] = certificacion.examenes || [];

      const habilidad = await getHabilidadByID({
        id: certificacion.habilidadId,
        client,
      });
      certificacion.habilidad = habilidad;

      certificacion.meta = {
        ...certificacion.meta,
        duracionTotal: examenes.reduce(
          (acc: number, ex: IExamen) => (acc += ex.duracion),
          0
        ),
      };
    }

    return dataCertificaciones.data;
  }
};

export const getCertificacionByID = async ({ id, client }: PropsByID) => {
  const dataCertificacion: GETID_HttpResponse = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id
  );

  if (!dataCertificacion || dataCertificacion instanceof Error)
    return undefined;
  else {
    const examenes: IExamen[] = dataCertificacion.data.examenes || [];

    dataCertificacion.data.meta = {
      duracionTotal: examenes.reduce(
        (acc: number, ex: IExamen) => (acc += ex.duracion),
        0
      ),
    };

    return dataCertificacion.data;
  }
};

export const addCertificacion = async ({
  certificacion,
  client = 'campus',
}: {
  certificacion: ICertificacion;
  client?: 'admin' | 'campus';
}) => {
  return post(
    client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS,
    certificacion
  )
    .then((response: PUT_HttpResponse) => {
      return {
        message: `Certificación creada correctamente.`,
        value: response.data,
        fullResponse: response,
      };
    })
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

export const updateCertificacion = ({
  id,
  certificacion,
  client = 'campus',
}: PropsByID & { certificacion: any }) => {
  return put(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id,
    certificacion
  )
    .then((response: PUT_HttpResponse) => ({
      message: `Certificación actualizada correctamente.`,
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

export const removeCertificacion = ({ id, client }: PropsByID) => {
  return remove((client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Certificación eliminada correctamente.`,
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

export const empezarCertificacion = async ({ id }: PropsByID) => {
  if (!id) return Promise.reject('ID es indefinida');

  return await post('/openAPI/especial/empezarCertificacion/' + id, {});
};

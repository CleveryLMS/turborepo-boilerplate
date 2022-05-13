import useSWR from 'swr';

import {
  PropsByQuery,
  PropsByID,
  GET_HttpResponse,
  POST_HttpResponse,
  PUT_HttpResponse,
  REMOVE_HttpResponse,
} from '../_middleware';
import { extractQuery, shouldFetch } from '../_utils';
import { get, post, put, remove } from '../../services';
import {
  IForoPregunta,
  IForoRespuesta,
  IForoTema,
  IForoVoto,
} from '../../models';

const ENDPOINT_TEMAS = '/openAPI/foro/temas/';
const ENDPOINT_VOTOS = '/openAPI/foro/votos/';
const ENDPOINT_PREGUNTAS = '/openAPI/foro/preguntas/';
const ENDPOINT_RESPUESTAS = '/openAPI/foro/respuestas/';

export const useForoTemas = ({
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR(
    shouldFetch(strategy, query) ? `${ENDPOINT_TEMAS}${queryTxt}` : null,
    get
  );

  const temas: IForoTema[] = data?.data?.data;

  return {
    data: temas,
    isLoading: !error && !data,
    isError: error !== undefined || data?.error === 404,
  };
};

export const useForoTema = ({
  id = '',
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByID) => {
  let [queryTxt, errors] = extractQuery(query);
  const { data, error } = useSWR(
    shouldFetch(strategy, query, true, id)
      ? `${ENDPOINT_TEMAS}${id}${queryTxt}`
      : null,
    get
  );

  const tema: IForoTema = data?.data;

  return {
    data: tema,
    isLoading: !error && !data,
    isError: error !== undefined || data?.error === 404,
  };
};

export const addForoTema = ({ tema }: { tema: IForoTema }) => {
  return post(ENDPOINT_TEMAS, tema)
    .then((response: POST_HttpResponse) => ({
      message: `Tema creado correctamente.`,
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

export const useForoPreguntas = ({
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const { data, error } = useSWR(
    shouldFetch(strategy, query) ? `${ENDPOINT_PREGUNTAS}${queryTxt}` : null,
    get
  );

  const preguntas: IForoPregunta[] = data?.data?.data;

  return {
    data: preguntas,
    isLoading: !error && !data,
    isError: error !== undefined || data?.error === 404,
  };
};

export const useForoPregunta = ({
  id = '',
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByID) => {
  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR(
    shouldFetch(strategy, query)
      ? `${ENDPOINT_PREGUNTAS}${id}${queryTxt}`
      : null,
    get
  );

  const pregunta: IForoPregunta = data?.data;

  return {
    data: pregunta,
    isLoading: !error && !data,
    isError: error !== undefined || data?.error === 404,
  };
};

export const useForoRespuestas = ({
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const { data, error } = useSWR(
    shouldFetch(strategy, query) ? `${ENDPOINT_RESPUESTAS}${queryTxt}` : null,
    get
  );

  const respuestas: IForoRespuesta[] = data?.data?.data;

  return {
    data: respuestas,
    isLoading: !error && !data,
    isError: error !== undefined || data?.error === 404,
  };
};

export const addForoPregunta = ({ pregunta }: { pregunta: IForoPregunta }) => {
  return post(ENDPOINT_PREGUNTAS, pregunta)
    .then((response: POST_HttpResponse) => ({
      message: `Pregunta creada correctamente.`,
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

export const addForoRespuesta = ({
  respuesta,
}: {
  respuesta: IForoRespuesta;
}) => {
  return post(ENDPOINT_RESPUESTAS, respuesta)
    .then((response: POST_HttpResponse) => ({
      message: `Respuesta creada correctamente.`,
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

export const updateForoRespuesta = ({
  id,
  respuesta,
}: PropsByID & { respuesta: any }) => {
  return put(`${ENDPOINT_RESPUESTAS}${id}`, respuesta)
    .then((response: PUT_HttpResponse) => ({
      message: `Respuesta actualizado correctamente.`,
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

export const updateForoPregunta = ({
  id,
  pregunta,
}: PropsByID & { pregunta: any }) => {
  return put(`${ENDPOINT_PREGUNTAS}${id}`, pregunta)
    .then((response: PUT_HttpResponse) => ({
      message: `Pregunta actualizado correctamente.`,
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

export const updateForoTema = ({ id, tema }: PropsByID & { tema: any }) => {
  return put(`${ENDPOINT_TEMAS}${id}`, tema)
    .then((response: PUT_HttpResponse) => ({
      message: `Tema actualizado correctamente.`,
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

export const getVotos = async ({
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const dataVotos: GET_HttpResponse = await get(ENDPOINT_VOTOS + queryTxt);

  if (!dataVotos || dataVotos instanceof Error) return undefined;
  else return dataVotos.data.data;
};

export const addVoto = ({ voto }: { voto: IForoVoto }) => {
  return post(ENDPOINT_VOTOS, voto)
    .then((response: POST_HttpResponse) => ({
      message: `Voto creado correctamente.`,
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

export const updateVoto = ({ id, voto }: PropsByID & { voto: any }) => {
  return put(`${ENDPOINT_VOTOS}${id}`, voto)
    .then((response: PUT_HttpResponse) => ({
      message: `Voto actualizado correctamente.`,
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

export const removeVoto = ({ id }: PropsByID) => {
  return remove(`${ENDPOINT_VOTOS}${id}`)
    .then((response: REMOVE_HttpResponse) => ({
      message: `Voto actualizado correctamente.`,
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

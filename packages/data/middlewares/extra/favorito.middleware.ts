import useSWR from 'swr';

import { get, post, remove } from '../../services';
import { extractQuery, shouldFetch } from '../_utils';
import { FavoritoTipoEnum, IFavorito } from '../../models';
import {
  GET_HttpResponse,
  POST_HttpResponse,
  PropsByID,
  PropsByQuery,
  REMOVE_HttpResponse,
} from '../_middleware';

const ENDPOINT = '/openAPI/favoritos/';

export const getFavoritoById = async ({
  id,
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByID) => {
  if (!shouldFetch(strategy, query, true, id)) return undefined;

  let [queryTxt, errors] = extractQuery(query);
  const dataFavorito: GET_HttpResponse = await get(
    `${ENDPOINT}${id}${queryTxt}`
  );

  if (!dataFavorito || dataFavorito instanceof Error) return undefined;
  else return dataFavorito.data;
};

export const getFavoritos = async ({
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  if (!shouldFetch(strategy, query)) return undefined;

  let [queryTxt, errors] = extractQuery(query);
  const dataFavoritos: GET_HttpResponse = await get(`${ENDPOINT}${queryTxt}`);

  for (let favorito of dataFavoritos?.data?.data || []) {
    favorito = await loadEagerData({ favorito });
  }

  if (!dataFavoritos || dataFavoritos instanceof Error) return undefined;
  else return dataFavoritos.data;
};

export const useFavoritos = ({
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR(
    shouldFetch(strategy, query) ? `${ENDPOINT}${queryTxt}` : null,
    get
  );

  return {
    favoritos: data?.error === undefined ? data?.data?.data : undefined,
    isLoading: !error && !data,
    isError: error !== undefined || data?.error === 404,
  };
};

const loadEagerData = async ({ favorito }: { favorito: IFavorito }) => {
  switch (favorito?.tipo) {
    case FavoritoTipoEnum.CURSO: {
      const objetoData = await get(`/openAPI/cursos/${favorito?.objetoId}`);
      favorito.objeto = objetoData?.data || undefined;
      break;
    }

    case FavoritoTipoEnum.LECCION: {
      const objetoData = await get(`/openAPI/lecciones/${favorito?.objetoId}`);
      favorito.objeto = objetoData?.data || undefined;
      break;
    }

    case FavoritoTipoEnum.PROYECTO: {
      const objetoData = await get(`/openAPI/proyectos/${favorito?.objetoId}`);
      favorito.objeto = objetoData?.data || undefined;
      break;
    }

    case FavoritoTipoEnum.CERTIFICACION: {
      const objetoData = await get(
        `/openAPI/certificaciones/${favorito?.objetoId}`
      );
      favorito.objeto = objetoData?.data || undefined;
      break;
    }
  }

  return favorito;
};

export const addFavorito = ({ favorito }: { favorito: IFavorito }) => {
  return post(ENDPOINT, favorito)
    .then((response: POST_HttpResponse) => ({
      message: `Favorito creado correctamente.`,
      value: response?.data?.data,
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

export const removeFavorito = ({ id }: PropsByID) => {
  return remove(`${ENDPOINT}${id}`)
    .then((response: REMOVE_HttpResponse) => ({
      value: response?.data,
      fullResponse: response,
      message: `Voto actualizado correctamente.`,
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

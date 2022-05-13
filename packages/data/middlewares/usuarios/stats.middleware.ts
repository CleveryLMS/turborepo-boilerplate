import useSWR from 'swr';

import { get } from '../../services';
import { extractQuery, shouldFetch } from '../_utils';
import {
  PropsByQuery,
  GET_HttpResponse,
  PropsByID,
  GETID_HttpResponse,
} from '..';

const ENDPOINT = '/godAPI/stats/';

export const getUsersStats = async ({
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  let dataUsers: GET_HttpResponse = await get(ENDPOINT + queryTxt);

  if (!dataUsers || dataUsers instanceof Error) return undefined;
  else return dataUsers.data;
};

export const getUserStats = async ({ id }: PropsByID) => {
  let dataUsers: GETID_HttpResponse = await get(ENDPOINT + id);

  if (!dataUsers || dataUsers instanceof Error) return undefined;
  else return dataUsers.data;
};

export const useUsersStats = ({
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR(
    shouldFetch(strategy, query) ? ENDPOINT + queryTxt : null,
    (e) => get(e).then((data) => treatData(data?.data))
  );

  const treatData = (stats: any[] | any) => {
    if (stats?.error || !stats) return stats;

    return stats;
  };

  return {
    data: data?.error === undefined ? data : undefined,
    isLoading: !error && !data,
    isError: error !== undefined || data?.error === 404,
  };
};

export const useUserStats = ({
  id,
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByID) => {
  let [queryTxt, errors] = extractQuery(query);

  const { data, error } = useSWR(
    shouldFetch(strategy, query, true, id) ? ENDPOINT + id + queryTxt : null,
    (e) => get(e).then((data) => treatData(data?.data))
  );

  const treatData = (stats: any[] | any) => {
    if (stats?.error || !stats) return stats;

    return stats;
  };

  return {
    data: data?.error === undefined ? data : undefined,
    isLoading: !error && !data,
    isError: error !== undefined || data?.error === 404,
  };
};

/** Query puede ser una query para el index global, o el índice de las stats por curso */
export const getStatsByCurso = async ({
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  let dataStats: GET_HttpResponse = await get(
    '/godAPI/statsByCurso/' + queryTxt
  );

  if (!dataStats || dataStats instanceof Error) return undefined;
  else return dataStats.data;
};

/** Query puede ser una query para el index global, o el índice de las stats por habilidadId */
export const getStatsByHabilidad = async ({
  id,
  query = [],
  strategy = 'invalidate-on-undefined',
}: PropsByID) => {
  let [queryTxt, errors] = extractQuery(query);
  let dataStats: GET_HttpResponse = await get(
    '/godAPI/statsByHabilidad/' + id + queryTxt
  );

  if (!dataStats || dataStats instanceof Error) return undefined;
  else return dataStats.data;
};

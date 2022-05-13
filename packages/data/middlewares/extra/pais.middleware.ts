import useSWR from 'swr';

import { IHabilidad } from '../../models';
import { PropsByQuery } from '../_middleware';
import { get, post, put, remove } from '../../services';
import { GET_HttpResponse } from '../_middleware';
import { extractQuery } from '../_utils';

const ENDPOINT_CAMPUS = '/openAPI/paises';

export const getPaises = async ({ query = [] }: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const dataPaises: GET_HttpResponse = await get(ENDPOINT_CAMPUS + queryTxt);
  if (!dataPaises || dataPaises instanceof Error) return undefined;
  else return dataPaises.data;
};

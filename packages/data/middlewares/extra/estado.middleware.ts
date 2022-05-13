import { get } from '../../services';
import { extractQuery } from '../_utils';
import { PropsByQuery, GET_HttpResponse } from '../_middleware';

const ENDPOINT_CAMPUS = '/openAPI/estados';

export const getEstados = async ({ query = [] }: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const dataPaises: GET_HttpResponse = await get(ENDPOINT_CAMPUS + queryTxt);
  if (!dataPaises || dataPaises instanceof Error) return undefined;
  else return dataPaises.data;
};

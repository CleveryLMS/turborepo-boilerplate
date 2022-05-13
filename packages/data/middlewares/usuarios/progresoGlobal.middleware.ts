import { get, put } from '../../services';
import {
  PropsByID,
  GETID_HttpResponse,
  PUT_HttpResponse,
} from '../_middleware';

const ENDPOINT_ADMIN = '/godAPI/progresosGlobales/';
const ENDPOINT_CAMPUS = '/openAPI/progresosGlobales/';

export const updateProgresoGlobal = ({
  id,
  client = 'campus',
  progresoGlobal,
}: PropsByID & { progresoGlobal: any }) => {
  return put(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id,
    progresoGlobal
  )
    .then((response: PUT_HttpResponse) => ({
      message: `Progreso global actualizado correctamente.`,
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

export const getProgresoGlobalByID = async ({ id, client }: PropsByID) => {
  const dataProgresoGlobal: GETID_HttpResponse = await get(
    (client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + id
  );

  if (!dataProgresoGlobal || dataProgresoGlobal instanceof Error)
    return undefined;
  else return dataProgresoGlobal.data;
};

import {
  PropsByQuery,
  PropsByID,
  GETID_HttpResponse,
  GET_HttpResponse,
  PUT_HttpResponse,
  POST_HttpResponse,
} from '../_middleware';
import { ICurso } from '../../models';
import { getCursos } from '../cursos/curso.middleware';
import { put, get, post } from '../../services';
import { fmtTiempoTotal, stringToNumArray } from 'utils';
import { extractQuery } from '../_utils';

const ENDPOINT_ADMIN = '/godAPI/users/';
const ENDPOINT_CAMPUS = '/openAPI/users/';

export const getUsers = async ({ query = [], client = 'campus' }: PropsByQuery) => {
  let [queryTxt, errors] = extractQuery(query);
  const dataUsers: GET_HttpResponse = await get((client === 'admin' ? ENDPOINT_ADMIN : ENDPOINT_CAMPUS) + queryTxt);

  if (!dataUsers || dataUsers instanceof Error) return undefined;
  else return dataUsers.data;
};

export const getUserByID = async ({ id, client = 'campus' }: PropsByID) => {
  if (client === 'admin') {
    const dataUser: GETID_HttpResponse = await get(ENDPOINT_ADMIN + id);

    if (!dataUser || dataUser?.isAxiosError) return undefined;
    else return dataUser.data;
  }

  const dataUser: GETID_HttpResponse = await get(ENDPOINT_CAMPUS + id);

  if (!dataUser || !dataUser.data || dataUser?.isAxiosError) return undefined;
  else {
    const indexCertisToFilter: number[] = [];

    dataUser?.data?.certificaciones?.forEach((certificacion: any, index: number) => {
      if (
        !dataUser?.data?.certificaciones?.find(
          (c: any) => c.id === certificacion.id && c.meta.pivot_intento > certificacion.meta.pivot_intento
        )
      )
        indexCertisToFilter.push(index);
    });

    dataUser.data.certificaciones = dataUser.data?.certificaciones?.filter((c: any, index: number) =>
      indexCertisToFilter.includes(index)
    );

    const rutasCompletadas = stringToNumArray(dataUser.data.rutasCompletadas || ''),
      rutaActual = stringToNumArray(dataUser.data.progresoGlobal?.ruta?.itinerario || ''),
      _cursosIniciados = stringToNumArray(dataUser.data.progresoGlobal?.cursosIniciados || ''),
      _cursosCompletados = stringToNumArray(dataUser.data.progresoGlobal?.cursosCompletados || ''),
      _certificacionesIniciadas = stringToNumArray(dataUser.data.progresoGlobal?.certificacionesIniciadas || ''),
      _certificacionesCompletadas = stringToNumArray(dataUser.data.progresoGlobal?.certificacionesCompletadas || '');

    const cursos: ICurso[] = await getCursos({
      query: [{ ruta: `[${rutaActual || ''}]` }],
      userId: +(id || 0),
      client: 'campus',
    });

    const progresoTotal =
      cursos?.map((curso) => curso?.meta?.progreso_count)?.reduce((prev: any, next: any) => prev + next, 0) || 0;

    const porcentajeProgresoTotal = (progresoTotal / (cursos?.length * 100)) * 100;

    dataUser.data.meta = { rutasCompletadas_list: rutasCompletadas };

    if (dataUser.data.progresoGlobal) {
      dataUser.data.progresoGlobal.tiempoTotal = fmtTiempoTotal(dataUser.data.progresoGlobal?.tiempoTotal);

      dataUser.data.progresoGlobal.meta = {
        progresoCursos: Math.min(100, Math.floor(porcentajeProgresoTotal)),
        cursosIniciados: _cursosIniciados,
        cursosCompletados: _cursosCompletados,
        certificacionesIniciadas: _certificacionesIniciadas,
        certificacionesCompletadas: _certificacionesCompletadas,
      };

      dataUser.data.progresoGlobal.ruta.meta = {
        itinerario: stringToNumArray(dataUser?.data?.progresoGlobal?.ruta?.itinerario || ''),
      };
    }

    let subsList: string[] = dataUser.data.meta?.subscriptions || [];

    dataUser.data.isSubscribedTo = (lista: string) => subsList.includes(lista);

    return dataUser.data;
  }
};

export const removeAvatar = ({ id }: PropsByID) => {
  if (!id) return Promise.reject('UserID es indefinido al borrar avatar');

  return put(ENDPOINT_CAMPUS + '?borra_avatar=true', {})
    .then((response: PUT_HttpResponse) => ({
      message: `Avatar borrado correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: PUT_HttpResponse) => {
      throw {
        title: 'Error inesperado',
        message: error.message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

// Para crear users desde el onboarding de OpenBootcamp
export const createUser = ({ user }: { user: any }) => {
  return post(`/authAPI/publicRegister`, user)
    .then((response: PUT_HttpResponse) => ({
      message: `Usuario creado correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: PUT_HttpResponse) => {
      throw {
        title: 'Error inesperado',
        message: error.message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

export const updateUser = ({ id, client = 'campus', user }: PropsByID & { user: any }) => {
  return put(client === 'admin' ? ENDPOINT_ADMIN + id : ENDPOINT_CAMPUS, user)
    .then((response: PUT_HttpResponse) => ({
      message: `Usuario actualizado correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: PUT_HttpResponse) => {
      throw {
        title: 'Error inesperado',
        message: error.message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

export const uploadAvatar = ({ files }: { files: File[] }) => {
  const formData = new FormData();
  formData.append('avatar', files[0]);

  return put(`${ENDPOINT_CAMPUS}`, formData)
    .then((response: PUT_HttpResponse) => ({
      message: `Avatar del usuario actualizado correctamente.`,
      value: response.data,
      fullResponse: response,
    }))
    .catch((error: PUT_HttpResponse) => {
      throw {
        title: 'Error inesperado',
        message: error.message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

/**
 *
 * Deshabilitamos la sesión de onboarding para nuevos usuarios,
 * para que dicho hashCode sea inválido.
 */
export const disableOnboardingSession = ({ hashCode }: { hashCode: string }) => {
  return post(`/openAPI/disableOnboardingSession`, { hashCode })
    .then((res) => res)
    .catch((error) => {
      throw { error, message: error.response.data.message };
    });
};

/** Habilitamos el factor de doble autenticación */
export const enableUser2FA = () => {
  return post('/openAPI/especial/enable2FA', {})
    .then((res) => res)
    .catch((error) => {
      throw { error, message: error.response.data.message };
    });
};

export const addUser = ({ user }: { user: any }) => {
  return post(ENDPOINT_ADMIN, user)
    .then((response: POST_HttpResponse) => ({
      message: `Usuario ${user?.username} creado correctamente.`,
      value: response.data.data,
      fullResponse: response,
    }))
    .catch((error: POST_HttpResponse) => {
      let message;

      if (error.errors && error.errors.length > 0) message = error.errors.reduce((acc, err) => (acc += `\n${err.message}`), '');
      else message = error.message;

      throw {
        title: 'Error inesperado',
        message: message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

export const resendCredentials = ({ id }: PropsByID) => {
  return post('/godAPI/resendCredentials/' + id, {})
    .then((response: POST_HttpResponse) => ({
      message: `Credenciales reenviadas`,
      value: response.data.data,
      fullResponse: response,
    }))
    .catch((error: POST_HttpResponse) => {
      let message;

      if (error.errors && error.errors.length > 0) message = error.errors.reduce((acc, err) => (acc += `\n${err.message}`), '');
      else message = error.message;

      throw {
        title: 'Error inesperado',
        message: message || 'Por favor, prueba otra vez o contacta con soporte.',
        error,
      };
    });
};

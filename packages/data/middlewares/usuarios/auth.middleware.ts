import { post } from '../../services';

export const LOGIN_USER = 'loginUser';
export const LOGIN_TOKEN = 'loginToken';

const ENDPOINT = '/authAPI/login/';

export const login = ({
  email,
  password,
  code,
}: {
  email: string;
  password: string;
  code?: string;
}) => {
  email = email.trim().toLowerCase();

  if (code)
    return post('/authAPI/verify2FAToken', { email, password, code })
      .then((res) => {
        if (!res.data?.token) return { error: res.data || 'Error inesperado' };

        return res.data;
      })
      .catch((error) => {
        throw { error, message: error.response.data.message };
      });
  return post(ENDPOINT, { email, password })
    .then((res) => {
      if (!res.data?.token) return { error: res.data || 'Error inesperado' };

      return res.data;
    })
    .catch((error) => {
      throw { error, message: error.response?.data?.message };
    });
};

export const recoverRequest = ({ email }: { email: string }) => {
  email = email.trim().toLowerCase();

  return post('/authAPI/recoverRequest', { email })
    .then((res) => res)
    .catch((error) => {
      throw { error, message: error.response.data.message };
    });
};

export const checkCode = ({ hashCode }: { hashCode: string }) => {
  return post(`/authAPI/checkCode`, { hashCode })
    .then((res) => res)
    .catch((error) => {
      throw { error, message: error.response.data.message };
    });
};

/**
 * Detectamos si el hashCode es válido
 */
export const checkHashOnboarding = ({ hashCode }: { hashCode: string }) => {
  return post(`/authAPI/checkHashOnboarding`, { hashCode })
    .then((res) => {
      if (!res?.data?.token) return { error: res?.data || 'Error inesperado' };

      return res?.data;
    })
    .catch((error) => {
      throw { error, message: error?.response?.data.message };
    });
};

export const resetPassword = ({
  hashCode,
  password,
}: {
  hashCode: string;
  password: string;
}) => {
  return post('/authAPI/resetPassword', { hashCode, password })
    .then((res) => {
      if (!res.data?.token) return { error: res.data || 'Error inesperado' };

      return res.data;
    })
    .catch((error) => {
      throw { error, message: error.response.data.message };
    });
};

export const loginViaId = ({ userId }: { userId: number }) => {
  return post('/authAPI/loginViaId', { userId })
    .then((res) => res.data)
    .catch((error) => {
      throw { error, message: error.response.data.message };
    });
};

/**
 * Buscamos si el nombre de usuario ya existe en la BBDD
 *
 * @param username Nombre a comprobar
 * @returns 404 - El nombre no se repite | 200 - El nombre está repetido
 */
export const checkIfUsernameExists = async ({
  username,
}: {
  username: string;
}) =>
  await post('/authAPI/userNameExists', { username })
    .then((res) => res)
    .catch((err) => err?.response?.data || { message: 'Error inesperado' });

/**
 * Buscamos si el nombre de usuario ya existe en la BBDD
 *
 * @param email Email a comprobar
 * @returns 404 - El email está disponible | 200 - El email está repetido
 */
export const checkIfEmailExists = async ({ email }: { email: string }) =>
  await post('/authAPI/mailExists', { email })
    .then((res) => res)
    .catch((err) => err?.response?.data || { message: 'Error inesperado' });

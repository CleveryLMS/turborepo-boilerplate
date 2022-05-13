export const setItemWithExpire = (key: string, value: any) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    throw {
      message: 'Error inesperado al guardar datos en sessionStorage',
      error,
    };
  }
};

export const setItem = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    throw {
      message: 'Error inesperado al guardar datos en localstorage',
      error,
    };
  }
};

export const getItem = (key: string) => {
  try {
    let itemStr = localStorage.getItem(key);

    // Si no existe el item, buscamos en la sessionStorage
    if (!itemStr) itemStr = sessionStorage.getItem(key);

    if (!itemStr) return null;
    else return JSON.parse(itemStr);
  } catch (error) {
    throw {
      message: 'Error inesperado al obtener datos del localstorage',
      error,
    };
  }
};

export const removeItem = (key: string) => {
  try {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  } catch (error) {
    throw {
      message: 'Error inesperado al eliminar los datos del localstorage',
      error,
    };
  }
};

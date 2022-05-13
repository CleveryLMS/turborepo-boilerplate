/** Convertimos la query de array en texto */
export const extractQuery = (query: any[] = []) => {
  let queryTxt: string = '?',
    errors: string[] = [];

  query?.forEach((item: any) => {
    let [key, value] = Object.entries(item)[0];

    if (Object.entries(item).length > 1)
      errors.push('Encontrada query con más de una entrada');

    if (key) queryTxt += `&${key}=${value}`;
  });

  return [queryTxt, errors];
};

/**
 * Si la estrategia es 'accept-all', devolveremos 'true' para ejecutar la petición.
 * Si la estrategia es 'invalidate-on-undefined', devolveremos 'false' si encontramos
 * algún valor inválido (-1, 0, undefined) en los parámetros de la query.
 *
 * @param strategy Estrategia de validación de datos de la query
 * @param query Listado de parametros
 * @param useId Si es true, tendremos en cuenta el ID como parametro junto a la query.
 * @param id ID de la petición Http.
 * @returns Devolvemos un booleano en función de si podemos ejecutar la petición (true).
 */
export const shouldFetch = (
  strategy: 'accept-all' | 'invalidate-on-undefined',
  query: any[] = [],
  useId?: boolean,
  id?: number | string
): boolean => {
  // Caso ESPECIAL - REFACTOR: Si el ID no es un numero, cancelamos TODO
  if (id === NaN) return false;
  // Caso 1: La estrategia es 'accept-all'.
  // Devolvemos siempre TRUE como respuesta
  if (strategy === 'accept-all') return true;
  // Caso 2: La estrategia es 'invalidate-on-undefined' y pasamos ID
  // Devolvemos TRUE o FALSE en función de la query y el ID
  else if (strategy === 'invalidate-on-undefined' && useId) {
    return (
      id !== 0 &&
      id !== NaN &&
      id !== null &&
      id !== undefined &&
      strategy === 'invalidate-on-undefined' &&
      query?.find((item) => {
        if (!item) return true;

        let values = Object.values(item);

        if (!values || values?.length !== 1) return true;
        let value = values[0];

        if (
          value === 0 ||
          value === '' ||
          value === '0' ||
          value === NaN ||
          value === null ||
          value === undefined
        )
          return true;
        else if (value === '[]' || value === '[0]' || value === '[undefined]')
          return true;
        else return false;
      }) === undefined
    );
  }

  // Caso 3: La estrategia es 'invalidate-on-undefined'
  // Devolvemos TRUE o FALSE en función de la query
  else if (strategy === 'invalidate-on-undefined') {
    return (
      strategy === 'invalidate-on-undefined' &&
      query?.find((item) => {
        if (!item) return true;

        let values = Object.values(item);

        if (!values || values?.length !== 1) return true;
        let value = values[0];

        if (
          value === 0 ||
          value === '' ||
          value === '0' ||
          value === NaN ||
          value === null ||
          value === undefined
        )
          return true;
        else if (value === '[]' || value === '[0]' || value === '[undefined]')
          return true;
        else return false;
      }) === undefined
    );
  }

  // CASO DEFAULT
  // Nunca debería ejecutarse. Pasamos FALSE y lanzamos error.
  else {
    console.error('❌ Devolviendo FALSE por defecto en shouldFetch(). ❌');
    console.error('❌ Esto no debería ejecutarse. ❌');
    return false;
  }
};

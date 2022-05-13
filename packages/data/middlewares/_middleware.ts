export type PropsByID = {
  /** ID del objeto a solicitar */
  id: number | string;
  /** Parámetros adicionales de la petición, a modo de listado de objetos.
   * Por cada objeto, la key es el nombre del parámetro y el valor, su valor. */
  query?: any[];
  /** Origen de la petición
   * 1. Admin: La petición se hace desde el panel de administración.
   * 2. Campus: La petición se hace desde el campus virtual. */
  client?: 'admin' | 'campus';
  /** Estrategia de carga sobre la query
  1. Invalidate on undefined: Cancelamos la petición si un valor de la query es indefinido, null o 0.
  2. Aceptamos todo tipo de valores. Nunca cancelamos la petición. */
  strategy?: 'invalidate-on-undefined' | 'accept-all';
};

export type PropsByQuery = {
  /** Parámetros adicionales de la petición, a modo de listado de objetos.
   * Por cada objeto, la key es el nombre del parámetro y el valor, su valor.
   */
  query?: any[];
  /** Origen de la petición
   * 1. Admin: La petición se hace desde el panel de administración.
   * 2. Campus: La petición se hace desde el campus virtual. */
  client?: 'admin' | 'campus';
  /** Estrategia de carga sobre la query
  1. Invalidate on undefined: Cancelamos la petición si un valor de la query es indefinido, null o 0.
  2. Aceptamos todo tipo de valores. Nunca cancelamos la petición. */
  strategy?: 'invalidate-on-undefined' | 'accept-all';
};

export interface GET_HttpResponse {
  data: {
    meta: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
      first_page: number;
      first_page_url: string | null;
      last_page_url: string | null;
      next_page_url: string | null;
      previous_page_url: string | null;
    };
    data: any[];
  };
  message?: string; // Error message
}

export interface GETID_HttpResponse {
  data: any;
  message?: string; // Error message

  isAxiosError?: boolean;
}

export interface PUT_HttpResponse {
  data?: any;
  message?: string; // Error message
  errors?: { rule: string; field: string; message: string }[];
}

export interface POST_HttpResponse {
  data?: any;
  message?: string; // Error message
  errors?: { rule: string; field: string; message: string }[];
}

export interface REMOVE_HttpResponse {
  data?: any;
  message?: string; // Error message
  errors?: { rule: string; field: string; message: string }[];
}

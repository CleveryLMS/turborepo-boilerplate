export type IPerfilConfig = {
  /** Permisos de lectura sobre la página del perfil */
  PAGE_VIEW: { label: 'Permisos de lectura sobre la página del perfil'; value: boolean };

  /** Permisos de lectura sobre el tab de cuenta */
  ACCOUNT_VIEW: { label: 'Permisos de lectura sobre el tab de cuenta'; value: boolean };
  /** Permisos de edición del avatar del usuario */
  ACCOUNT_EDIT_AVATAR: { label: 'Permisos de edición del avatar del usuario'; value: boolean };
  /** Permisos de edición del avatar del usuario, Gifs incluidos */
  ACCOUNT_EDIT_AVATAR_GIF: { label: 'Permisos de edición del avatar del usuario, Gifs incluidos'; value: boolean };
  /** Permisos de edición del nombre completo del usuario */
  ACCOUNT_EDIT_FULLNAME: { label: 'Permisos de edición del nombre completo del usuario'; value: boolean };
  /** Permisos para activar el factor de doble autenticación */
  ACCOUNT_ENABLE_2FA: { label: 'Permisos para activar el factor de doble autenticación'; value: boolean };

  /** Permisos de lectura sobre el tab de datos */
  DATA_VIEW: { label: 'Permisos de lectura sobre el tab de datos'; value: boolean };
  /** Permisos de edición del país del usuario */
  DATA_EDIT_COUNTRY: { label: 'Permisos de edición del país del usuario'; value: boolean };
  /** Permisos de edición de la ciudad del usuario */
  DATA_EDIT_CITY: { label: 'Permisos de edición de la ciudad del usuario'; value: boolean };
  /** Permisos de edición de la presencialidad del usuario */
  DATA_EDIT_REMOTE: { label: 'Permisos de edición de la presencialidad del usuario'; value: boolean };
  /** Permisos de edición de la posibilidad de traslado del usuario */
  DATA_EDIT_MOVE: { label: 'Permisos de edición de la posibilidad de traslado del usuario'; value: boolean };

  /** Permisos de lectura sobre el tab de apariencia */
  STYLES_VIEW: { label: 'Permisos de lectura sobre el tab de apariencia'; value: boolean };
  /** Permisos de edición del tema del campus */
  STYLES_EDIT_THEME: { label: 'Permisos de edición del tema del campus'; value: boolean };

  /** Permisos de lectura sobre el tab de hoja de ruta */
  ROADMAP_VIEW: { label: 'Permisos de lectura sobre el tab de hoja de ruta'; value: boolean };
  /** Permisos de edición de la hoja de ruta del usuario */
  ROADMAP_EDIT_ROADMAP: { label: 'Permisos de edición de la hoja de ruta del usuario'; value: boolean };
};

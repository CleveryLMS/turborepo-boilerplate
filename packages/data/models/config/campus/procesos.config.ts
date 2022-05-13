export type IProcesosConfig = {
  /** Permisos de lectura sobre la página de procesos */
  PAGE_VIEW: { label: 'Permisos de lectura sobre la página de procesos'; value: boolean };
  /** Permisos de filtrado sobre el listado de procesos */
  PAGE_FILTER: { label: 'Permisos de filtrado sobre el listado de procesos'; value: boolean };

  /** Permisos de lectura sobre la portada de un proceso */
  COVER_VIEW: { label: 'Permisos de lectura sobre la portada de un proceso'; value: boolean };
  /** Permisos inscripción sobre un proceso */
  COVER_ENROLL: { label: 'Permisos inscripción sobre un proceso'; value: boolean };
  /** Permisos de seguir la hoja de ruta de un proceso */
  COVER_ROADMAP_FOLLOW: { label: 'Permisos de seguir la hoja de ruta de un proceso'; value: boolean };
  /** Permisos para ir a la portada del curso de la hoja de ruta del proceso */
  COVER_COURSE_LINK: { label: 'Permisos para ir a la portada del curso de la hoja de ruta del proceso'; value: boolean };
  /** Permisos para ir a la portada de la certificación del listado de certificaciones requeridas del proceso */
  COVER_CERTIFICATION_LINK: {
    label: 'Permisos para ir a la portada de la certificación del listado de certificaciones requeridas del proceso';
    value: boolean;
  };
};

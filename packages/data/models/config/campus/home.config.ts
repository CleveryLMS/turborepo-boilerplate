export type IHomeConfig = {
  /** Permisos para ir a la portada del curso */
  PAGE_SHOW_COURSES: { label: 'Permisos para ir a la portada del curso'; value: boolean };

  /** Permisos para ir a la portada de la certificación */
  PAGE_SHOW_CERTIFICATIONS: { label: 'Permisos para ir a la portada de la certificación'; value: boolean };

  /** Permisos para mostrar el widget de la hoja de ruta */
  PAGE_SHOW_ROADMAP: { label: 'Permisos para mostrar el widget de la hoja de ruta'; value: boolean };

  /** Permisos para mostrar el widget de los eventos del calendario */
  PAGE_SHOW_EVENTS: { label: 'Permisos para mostrar el widget de los eventos del calendario'; value: boolean };

  /** Permisos para mostrar el widget de las métricas del usuario */
  PAGE_SHOW_METRICS: { label: 'Permisos para mostrar el widget de las métricas del usuario'; value: boolean };

  /** Permisos para mostrar el apartado de cursos en el widget de métricas */
  PAGE_SHOW_METRICS_COURSES: { label: 'Permisos para mostrar el apartado de cursos en el widget de métricas'; value: boolean };

  /** Permisos para mostrar el apartado de certificaciones en el widget de métricas */
  PAGE_SHOW_METRICS_CERTIFICATIONS: {
    label: 'Permisos para mostrar el apartado de certificaciones en el widget de métricas';
    value: boolean;
  };

  /** Permisos para mostrar el apartado de tiempo total en el widget de métricas */
  PAGE_SHOW_METRICS_DURATION: {
    label: 'Permisos para mostrar el apartado de tiempo total en el widget de métricas';
    value: boolean;
  };
};

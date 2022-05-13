import { UserRolEnum } from '../..';

import { IForoConfig } from './foro.config';
import { IHomeConfig } from './home.config';
import { ICampusConfig } from './campus.config';
import { ICursosConfig } from './cursos.config';
import { IPerfilConfig } from './perfil.config';
import { IRoadmapConfig } from './roadmap.config';
import { IProcesosConfig } from './procesos.config';
import { IComunidadConfig } from './comunidad.config';
import { IOnboardingConfig } from './onboarding.config';
import { ICertificacionesConfig } from './certificaciones.config';

export type IConfig = {
  campus: ICampusConfig;
  certificaciones: ICertificacionesConfig;
  comunidad: IComunidadConfig;
  cursos: ICursosConfig;
  foro: IForoConfig;
  home: IHomeConfig;
  onboarding: IOnboardingConfig;
  perfil: IPerfilConfig;
  procesos: IProcesosConfig;
  roadmap: IRoadmapConfig;
};

const RolConfig: IConfig = {
  campus: {
    CERTIFICACIONES_SHOW: {
      label: 'Activar página de certificaciones',
      value: true,
    },

    COMUNIDAD_SHOW: {
      label: 'Activar página de comunidad',
      value: true,
    },

    CURSOS_SHOW: {
      label: 'Activar página de cursos',
      value: true,
    },

    FAVORITOS_SHOW: {
      label: 'Activar página de favoritos',
      value: true,
    },
    FORO_SHOW: {
      label: 'Activar página de foro',
      value: true,
    },
    ONBOARDING_SHOW: {
      label: 'Activar página de onboarding',
      value: true,
    },
    PERFIL_SHOW: {
      label: 'Activar página de perfil',
      value: true,
    },
    PROCESOS_SHOW: {
      label: 'Activar página de procesos',
      value: true,
    },
    ROADMAP_SHOW: {
      label: 'Activar página de hoja de ruta',
      value: true,
    },
    CALENDAR_SHOW: {
      label: 'Mostrar calendario de eventos a los usuarios',
      value: true,
    },
    SEARCHBAR_SHOW: {
      label: 'Mostrar barra de búsqueda a los usuarios',
      value: true,
    },
  },
  certificaciones: {
    PAGE_VIEW: {
      label: 'Permisos de lectura sobre la página de certificaciones',
      value: true,
    },
  },
  comunidad: {
    PAGE_VIEW: {
      label: 'Permisos de lectura sobre la página de comunidad',
      value: true,
    },
    PAGE_PROYECTO_NEW: {
      label: 'Permisos de creación de nuevos proyectos',
      value: false,
    },
  },
  cursos: {
    PAGE_VIEW: {
      label: 'Permisos de lectura sobre la página de cursos',
      value: true,
    },
  },
  foro: {
    PAGE_VIEW: {
      label: 'Permisos de lectura sobre la página del foro',
      value: true,
    },
    PAGE_FILTER: {
      label: 'Permisos para filtrar los temas del foro',
      value: true,
    },
    PAGE_NEW_SUBJECT: {
      label: 'Permisos para añadir nuevos temas al foro',
      value: true,
    },
    SUBJECT_VIEW: {
      label: 'Permisos de lectura sobre la página del tema',
      value: true,
    },
    SUBJECT_FILTER: {
      label: 'Permisos para filtrar las preguntas del tema',
      value: true,
    },
    SUBJECT_PIN_UP: {
      label: 'Permisos para fijar temas en el foro',
      value: true,
    },
    SUBJECT_NEW_QUESTION: {
      label: 'Permisos para añadir nuevas preguntas al tema',
      value: true,
    },
    QUESTION_VIEW: {
      label: 'Permisos de lectura sobre la página de la pregunta',
      value: true,
    },
    QUESTION_VOTE: {
      label: 'Permisos para votar la pregunta',
      value: true,
    },
    QUESTION_PIN_UP: {
      label: 'Permisos para fijar preguntas en el tema',
      value: true,
    },
    QUESTION_NEW_COMMENT: {
      label: 'Permisos para añadir nuevas respuestas a la pregunta',
      value: true,
    },
    QUESTION_PIN_UP_COMMENT: {
      label: 'Permisos para fijar respuestas en el tema',
      value: true,
    },
    QUESTION_VOTE_COMMENT: {
      label: 'Permisos para votar la respuesta',
      value: true,
    },
  },
  home: {
    PAGE_SHOW_COURSES: {
      label: 'Permisos para ir a la portada del curso',
      value: true,
    },
    PAGE_SHOW_CERTIFICATIONS: {
      label: 'Permisos para ir a la portada de la certificación',
      value: true,
    },
    PAGE_SHOW_ROADMAP: {
      label: 'Permisos para mostrar el widget de la hoja de ruta',
      value: true,
    },
    PAGE_SHOW_EVENTS: {
      label: 'Permisos para mostrar el widget de los eventos del calendario',
      value: true,
    },
    PAGE_SHOW_METRICS: {
      label: 'Permisos para mostrar el widget de las métricas del usuario',
      value: true,
    },
    PAGE_SHOW_METRICS_COURSES: {
      label: 'Permisos para mostrar el apartado de cursos en el widget de métricas',
      value: true,
    },
    PAGE_SHOW_METRICS_CERTIFICATIONS: {
      label: 'Permisos para mostrar el apartado de certificaciones en el widget de métricas',
      value: true,
    },
    PAGE_SHOW_METRICS_DURATION: {
      label: 'Permisos para mostrar el apartado de tiempo total en el widget de métricas',
      value: true,
    },
  },
  onboarding: {
    PAGE_VIEW: {
      label: 'Permisos de lectura sobre la página del onboarding',
      value: true,
    },
  },
  perfil: {
    PAGE_VIEW: {
      label: 'Permisos de lectura sobre la página del perfil',
      value: true,
    },
    ACCOUNT_VIEW: {
      label: 'Permisos de lectura sobre el tab de cuenta',
      value: true,
    },
    ACCOUNT_EDIT_AVATAR: {
      label: 'Permisos de edición del avatar del usuario',
      value: true,
    },
    ACCOUNT_EDIT_AVATAR_GIF: {
      label: 'Permisos de edición del avatar del usuario, Gifs incluidos',
      value: true,
    },
    ACCOUNT_EDIT_FULLNAME: {
      label: 'Permisos de edición del nombre completo del usuario',
      value: true,
    },
    ACCOUNT_ENABLE_2FA: {
      label: 'Permisos para activar el factor de doble autenticación',
      value: true,
    },
    DATA_VIEW: {
      label: 'Permisos de lectura sobre el tab de datos',
      value: true,
    },
    DATA_EDIT_COUNTRY: {
      label: 'Permisos de edición del país del usuario',
      value: true,
    },
    DATA_EDIT_CITY: {
      label: 'Permisos de edición de la ciudad del usuario',
      value: true,
    },
    DATA_EDIT_REMOTE: {
      label: 'Permisos de edición de la presencialidad del usuario',
      value: true,
    },
    DATA_EDIT_MOVE: {
      label: 'Permisos de edición de la posibilidad de traslado del usuario',
      value: true,
    },
    STYLES_VIEW: {
      label: 'Permisos de lectura sobre el tab de apariencia',
      value: true,
    },
    STYLES_EDIT_THEME: {
      label: 'Permisos de edición del tema del campus',
      value: true,
    },
    ROADMAP_VIEW: {
      label: 'Permisos de lectura sobre el tab de hoja de ruta',
      value: true,
    },
    ROADMAP_EDIT_ROADMAP: {
      label: 'Permisos de edición de la hoja de ruta del usuario',
      value: true,
    },
  },
  procesos: {
    PAGE_VIEW: {
      label: 'Permisos de lectura sobre la página de procesos',
      value: true,
    },
    PAGE_FILTER: {
      label: 'Permisos de filtrado sobre el listado de procesos',
      value: true,
    },
    COVER_VIEW: {
      label: 'Permisos de lectura sobre la portada de un proceso',
      value: true,
    },
    COVER_ENROLL: {
      label: 'Permisos inscripción sobre un proceso',
      value: true,
    },
    COVER_ROADMAP_FOLLOW: {
      label: 'Permisos de seguir la hoja de ruta de un proceso',
      value: true,
    },
    COVER_COURSE_LINK: {
      label: 'Permisos para ir a la portada del curso de la hoja de ruta del proceso',
      value: true,
    },
    COVER_CERTIFICATION_LINK: {
      label: 'Permisos para ir a la portada de la certificación del listado de certificaciones requeridas del proceso',
      value: true,
    },
  },
  roadmap: {
    PAGE_VIEW: {
      label: 'Permisos de lectura sobre la página de hoja de ruta',
      value: true,
    },
    PAGE_COURSE_LINK: {
      label: 'Permisos para ir a la portada del curso de la hoja de ruta',
      value: true,
    },
  },
};

export const CampusConfig = {
  [UserRolEnum.ADMIN]: RolConfig,
  [UserRolEnum.SUPERVISOR]: RolConfig,
  [UserRolEnum.PROFESOR]: RolConfig,
  [UserRolEnum.EDITOR]: RolConfig,
  [UserRolEnum.ESTUDIANTE]: RolConfig,
};

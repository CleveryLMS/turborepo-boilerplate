export type IForoConfig = {
  /** Permisos de lectura sobre la página del foro */
  PAGE_VIEW: { label: 'Permisos de lectura sobre la página del foro'; value: boolean };
  /** Permisos para filtrar los temas del foro */
  PAGE_FILTER: { label: 'Permisos para filtrar los temas del foro'; value: boolean };
  /** Permisos para añadir nuevos temas al foro */
  PAGE_NEW_SUBJECT: { label: 'Permisos para añadir nuevos temas al foro'; value: boolean };

  /** Permisos de lectura sobre la página del tema */
  SUBJECT_VIEW: { label: 'Permisos de lectura sobre la página del tema'; value: boolean };
  /** Permisos para filtrar las preguntas del tema */
  SUBJECT_FILTER: { label: 'Permisos para filtrar las preguntas del tema'; value: boolean };
  /** Permisos para fijar temas en el foro */
  SUBJECT_PIN_UP: { label: 'Permisos para fijar temas en el foro'; value: boolean };
  /** Permisos para añadir nuevas preguntas al tema */
  SUBJECT_NEW_QUESTION: { label: 'Permisos para añadir nuevas preguntas al tema'; value: boolean };

  /** Permisos de lectura sobre la página de la pregunta */
  QUESTION_VIEW: { label: 'Permisos de lectura sobre la página de la pregunta'; value: boolean };
  /** Permisos para votar la pregunta */
  QUESTION_VOTE: { label: 'Permisos para votar la pregunta'; value: boolean };
  /** Permisos para fijar preguntas en el tema */
  QUESTION_PIN_UP: { label: 'Permisos para fijar preguntas en el tema'; value: boolean };
  /** Permisos para añadir nuevas respuestas a la pregunta */
  QUESTION_NEW_COMMENT: { label: 'Permisos para añadir nuevas respuestas a la pregunta'; value: boolean };
  /** Permisos para fijar respuestas en el tema */
  QUESTION_PIN_UP_COMMENT: { label: 'Permisos para fijar respuestas en el tema'; value: boolean };
  /** Permisos para votar la respuesta */
  QUESTION_VOTE_COMMENT: { label: 'Permisos para votar la respuesta'; value: boolean };
};

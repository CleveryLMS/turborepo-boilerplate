export enum EncuestaPerfilEnum {
  EMPRESA_ORGANIZADORA = 'Empresa Organizadora',
}

export enum EncuestaModalidadEnum {
  TELEFORMACION = 'Teleformación',
}

export enum EncuestaSexoEnum {
  MUJER = 'Mujer',
  VARON = 'Varón',
}

export enum EncuestaTitulacionEnum {
  SIN_TITULACION = 'Sin titulación',
  PROFESIONALIDAD_NVL_1 = 'Certificado de Profesionalidad Nivel 1',
  PRIMARIA = 'Educación Primaria',
  FP_BASICA = 'Formación Profesional Básica',
  ESO = 'Título de graduado E.S.O / Graduado escolar',
  PROFESIONALIDAD_NVL_2 = 'Certificado de Profesionalidad Nivel 2',
  BACHILLERATO = 'Título de Bachiller',
  FP_MEDIO = 'Título de Técnico / FP Grado Medio',
  ENSEÑAZAS_MUSICA = 'Título Profesional enseñanzas música-danza',
  PROFESIONALIDAD_NVL_3 = 'Certificado de Profesionalidad Nivel 3',
  FP_SUPERIOR = 'Título de Técnico Superior / FP Grado Medio',
  DIPLOMATURA = 'E. Universitarios 1º ciclo (Diplomatura)',
  HASTA_240_CREDITOS = 'Grados universitarios de hasta 240 créditos',
  LICENCIATURA = 'E. Universitarios 2º ciclo (Licenciatura-Máster)',
  MAS_240_CREDITOS = 'Grados universitarios de más 240 créditos',
  MASTER = 'Másteres oficiales universitarios',
  RESIDENTES = 'Especialidades en CC. salud (residentes)',
  DOCTORANDO = 'E. Universitarios 3º ciclo (Doctor)',
  DOCTORADO = 'Título de Doctor',
}

export enum EncuestaOtraTitulacionEnum {
  CARNET_PROFESIONAL = 'Carnet profesional / Profesiones reguladas',
  A1 = 'Nivel de idioma A1 del MCER',
  A2 = 'Nivel de idioma A2 del MCER',
  B1 = 'Nivel de idioma B1 del MCER',
  B2 = 'Nivel de idioma B2 del MCER',
  C1 = 'Nivel de idioma C1 del MCER',
  C2 = 'Nivel de idioma C2 del MCER',
}

export enum EncuestaCategoriaEnum {
  DIRECTIVO = 'Directivo/a',
  MANDO_INTERMEDIO = 'Mando Intermedio',
  TECNICO = 'Técnico/a',
  TRABAJADOR_CUALIFICADO = 'Trabajador/a cualificado/a',
  TRABAJADOR_BAJA_CUALIFICACION = 'Trabajador/a de baja cualificación',
}

export enum EncuestaHorarioEnum {
  DENTRO = 'Dentro de la jornada laboral',
  FUERA = 'Fuera de la jornada laboral',
  AMBAS = 'Ambas',
}

export enum EncuestaJornadaEnum {
  MENOS_25 = 'Menos del 25%',
  ENTRE_25_Y_50 = 'Entre el 25% al 50%',
  MAS_50 = 'Más del 50%',
}

export enum EncuestaEmpleadosEnum {
  ENTRE_1_Y_9 = 'De 1 a 9 empleados',
  ENTRE_10_Y_49 = 'De 10 a 49 empleados',
  ENTRE_50_Y_99 = 'De 50 a 99 empleados',
  ENTRE_100_Y_250 = 'De 100 a 250 empleados',
  MAS_250 = 'De más de 250 empleados',
}

type Valoracion = 1 | 2 | 3 | 4;

export interface IEncuesta {
  /** Datos acción formativa */
  n_expediente: string;
  perfil: EncuestaPerfilEnum; // ¿Qué más tipos hay?
  cif_empresa: string;
  n_accion: number;
  n_grupo: number;
  denominacion_accion: string;
  modalidad: EncuestaModalidadEnum; // ¿Qué más tipos hay?

  /** Datos clasificación participante */
  edad: number;
  sexo: EncuestaSexoEnum;
  titulacion: EncuestaTitulacionEnum;
  otra_titulacion: EncuestaOtraTitulacionEnum | string;
  provincia_trabajo: string;
  categoria_profesional: EncuestaCategoriaEnum | string;
  horario_curso: EncuestaHorarioEnum;
  porcentaje_jornada: EncuestaJornadaEnum;
  num_empleados: EncuestaEmpleadosEnum;

  /** Valoración de las acciones formativas */
  // 1. Organización del curso
  organizacion_curso: Valoracion;
  numero_alumnos: Valoracion;

  // 2. Contenidos y metodología de impartición
  contenidos_curso: Valoracion;
  combinacion_teoria_practica: Valoracion;

  // 3. Duración y horario
  duracion_cursos: Valoracion;
  horario_curso_asistencia: Valoracion;

  // 4. Formadores / Tutores
  forma_impartir_tutor?: Valoracion;
  forma_impartir_formador?: Valoracion;
  conocimiento_tutor?: Valoracion;
  conocimiento_formador?: Valoracion;

  // 5. Medios didácticos
  documentacion_materiales: Valoracion;
  medios_actualizados: Valoracion;

  // 6. Instalaciones y medios técnicos
  instalaciones_adecuadas: Valoracion;
  medios_tecnicos_adecuados: Valoracion;

  // 7. Modalidad telemática o a distancia
  guias_didacticas_telematicas: Valoracion;
  medios_apoyo: Valoracion;

  // 8. Mecanismos para la evaluación del aprendizaje
  pruebas_evaluacion_aprendizaje: boolean;
  acreditacion_cualificacion: boolean;

  // 9. Valoración general del curso
  incorporacion_mercado_trabajo: Valoracion;
  nuevas_habilidades_trabajo: Valoracion;
  posibilidades_cambio_trabajo: Valoracion;
  ampliacion_conocimientos: Valoracion;
  desarrollo_personal: Valoracion;

  // 10. Grado de satisfacción general con el curso
  satisfaccion_general: Valoracion;

  // 11. Observaciones
  observaciones: string;
}

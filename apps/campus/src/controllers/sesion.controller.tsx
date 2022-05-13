import { useEffect, useState, useContext } from 'react';

import { addSesion, updateSesion, getSesionActual, getUserByID } from 'data';
import { LoginContext, ProgresoGlobalContext } from '../shared/context';
import { useSessionTimeout, DEFAULT_EVENTS, useInterval } from 'utils';

/** Cerraremos la sesión actual, haciendo el último post,
 *  cada X segundos, siendo X el valor de esta constante. */
const TEMPORIZADOR_INACTIVIDAD = 60;

/** Actualizaremos el valor de la sesión actual cada
 *  X segundos, siendo X el valor de esta constante. */
const TEMPORIZADOR_ACTUALIZAR_SESION = 60;

/** Cada X segundos, siendo X el valor de esta constante,
 * enviaremos un evento de actividad de video en ejecución. */
const TEMPORIZADOR_ACTIVIDAD_VIDEOS = 30;

/** Evento a ejecutar cuando el usuario empieza un video */
const EVENTO_VIDEO_PLAY = 'leccion_on_play';

/** Evento a ejecutar cuando el usuario pausa un video */
const EVENTO_VIDEO_PAUSE = 'leccion_on_pause';

export const SesionController = () => {
  const { user } = useContext(LoginContext);
  const { setProgresoGlobal } = useContext(ProgresoGlobalContext);

  const [currentSesion, setCurrentSesion] = useState<any>();

  useEffect(() => {
    // Cuando cerramos el navegador, tenemos que guardar la sesión también
    window.onbeforeunload = (e) => onIdle();
  }, []);

  useEffect(() => {
    refreshSesionState();
  }, [user]);

  /**
   * Método para actualizar el objeto Sesion activo en el campus. (Sólo útil si no tenemos guardado en el estado una sesión.)
   *
   * Caso 1: El usuario entra por primera vez al campus -> Se crea una nueva Sesion.
   * Caso 2: El usuario entra al campus, habiendo entrado no hace más de 5 minutos -> Se recupera la sesión anterior con getSesionActual()
   * Caso 3: El usuario ya está iniciado en el campus, pero este método se ejecuta igualmente -> No hacemos nada.
   */
  const refreshSesionState = async () => {
    // Al abrir el navegador (Siempre y cuando estemos registrados), empezamos una nueva sesión.
    if (user && !currentSesion) {
      const sesion = await getSesionActual();

      if (sesion?.value?.id) setCurrentSesion(sesion?.value);
      else
        await addSesion({
          createdAt: new Date().toISOString().substring(0, 19),
          segundos: 0,
        })
          .then((response) => setCurrentSesion({ ...response?.value?.data }))
          .catch((error) => error);
    }
  };

  useEffect(() => {
    refreshProgresoContext();
  }, [currentSesion]);

  /**
   * Sobre cada cambio de la sesión actual,
   * actualizamos el contexto del progreso global.
   */
  const refreshProgresoContext = async () => {
    if (user?.id) {
      const _user = await getUserByID({ id: user?.id, client: 'campus' });

      setProgresoGlobal(_user?.progresoGlobal ? { ..._user.progresoGlobal } : null);
    }
  };

  /**
   * Método utilizado para actualizar el estado de la sesión actual, añadiendo segundos al objeto.
   * Si no existe una sesión (porque se ha ejecutado el método onIdle, que borra el estado), creamos una sesión nueva.
   */
  const updateSesionState = async (updateInterval: number) => {
    // Si se ejecuta el método onIdle, dejamos currentSesion a undefined
    // por lo que hace falta crear una nueva sesión.

    if (user && !currentSesion?.id) {
      return await addSesion({
        createdAt: new Date().toISOString().substring(0, 19),
        segundos: 60,
      })
        .then((response) => response?.value?.data)
        .catch((error) => error);
    } else if (user) {
      // Le pasamos el intervalo de segundos que ha pasado, no los segundos totales
      return await updateSesion({
        id: currentSesion.id,
        sesion: { segundos: updateInterval },
      })
        .then((response) => response?.value?.data)
        .catch((error) => error);
    }
  };

  /**
   * Ejecutaremos este método cuando el usuario deje de interactuar
   * con el campus.
   */
  const onIdle = () => {
    if (!currentSesion?.id) return undefined;

    const startTime = new Date(getLasttimeActive());
    const endTime = new Date();

    updateSesion({
      id: currentSesion.id,
      sesion: {
        segundos: Math.floor((endTime.getTime() - startTime.getTime()) / 1000),
      },
    })
      .then((response) => setCurrentSesion(undefined))
      .catch((error) => error);
  };

  /**
   * Ejecutaremos este método cuando el usuario vuelva a interactuar
   * con el campus, estando previamente en el estado 'idle'.
   *
   * TODO: El método no se ejecuta desde useSessionTimeout. Revisar si hace falta este método para algo.
   */
  const onAction = () => updateSesionState(TEMPORIZADOR_ACTUALIZAR_SESION);

  const { timer, getLasttimeActive } = useSessionTimeout({
    timeout: TEMPORIZADOR_INACTIVIDAD,
    onIdle: onIdle,
    onAction: onAction,
    events: [...DEFAULT_EVENTS, EVENTO_VIDEO_PLAY, EVENTO_VIDEO_PAUSE], // Eventos para detectar si el usuario interactua con el campus
  });

  useInterval(async () => {
    if (timer) {
      const resultado = await updateSesionState(TEMPORIZADOR_ACTUALIZAR_SESION);
      setCurrentSesion({ ...resultado });
    }
  }, 1000 * TEMPORIZADOR_ACTUALIZAR_SESION);

  return <></>;
};

export {
  TEMPORIZADOR_ACTUALIZAR_SESION,
  TEMPORIZADOR_INACTIVIDAD,
  TEMPORIZADOR_ACTIVIDAD_VIDEOS,
  EVENTO_VIDEO_PLAY,
  EVENTO_VIDEO_PAUSE,
};

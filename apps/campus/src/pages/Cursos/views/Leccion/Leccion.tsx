import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { isMobile as isMobileBrowser } from 'react-device-detect';
import { BiCheck, BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';

import { Button, Flex, Icon, useToast, Tooltip, Spinner, useMediaQuery } from '@chakra-ui/react';

import { onFailure } from 'utils';
import { getCurso, addProgreso, getLeccionByID, getProgresoGlobalByID } from 'data';
import { LayoutContext, LoginContext, ProgresoGlobalContext } from '../../../../shared/context';
import { getProgresos, ICurso, IExamen, ILeccion, LeccionTipoEnum, ProgresoTipoEnum } from 'data';

import { ZoomLeccion } from './ZoomLeccion';
import { VideoLeccion } from './VideoLeccion';
import { SlidesLeccion } from './SlidesLeccion';
import { RecursoLeccion } from './RecursoLeccion';
import { MarkdownLeccion } from './MarkdownLeccion';
import { EntregableLeccion } from './EntregableLeccion/EntregableLeccion';
import { NotasDnd } from '../../components/Leccion/NotasDnd/NotasDnd';
import SidebarLeccion from '../../components/Leccion/Sidebar/Sidebar';
import { LeccionHeader } from '../../components/Leccion/Header/Header';
import ResponsiveSidebarLeccion from '../../components/Leccion/Sidebar/ResponsiveSidebar';

enum ModeEnum {
  BLOQUEADA = 'blocked',
  DESBLOQUEADA = 'unblocked',
  CARGANDO = 'loading',
  SIGUIENTE = 'next',
}

const Leccion = () => {
  const navigate = useNavigate();
  const [isMobile] = useMediaQuery('(max-width: 968px)');

  const { cursoId, leccionId } = useParams<any>();

  const { user } = useContext(LoginContext);
  const { setShowHeader, setShowSidebar } = useContext(LayoutContext);
  const { progresoGlobal, setProgresoGlobal } = useContext(ProgresoGlobalContext);

  const [curso, setCurso] = useState<ICurso>();
  const [leccion, setLeccion] = useState<ILeccion>();
  const [openNotas, setOpenNotas] = useState<boolean>(false);
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [nextIsBlocked, setNextIsBlocked] = useState<boolean>(false);
  const [prevIsBlocked, setPrevIsBlocked] = useState<boolean>(false);

  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [mode, setMode] = useState<ModeEnum>(ModeEnum.BLOQUEADA);

  const toast = useToast();

  useEffect(() => {
    setShowHeader(false);
    setShowSidebar(false);
  }, []);

  useEffect(() => {
    refreshState();
  }, [cursoId, leccionId]);

  const refreshState = async (updateProgresoGlobal?: boolean) => {
    const cursoData = await getCurso({
      id: +(cursoId || 0),
      userId: user?.id,
      strategy: 'invalidate-on-undefined',
    });

    if (cursoData?.error === 404) navigate('/');
    if (!leccionId) return;

    setCurso(cursoData);

    const leccionData = await getLeccionByID({ id: +(leccionId || 0) });
    setLeccion(leccionData);

    if (updateProgresoGlobal) {
      const lastModulo = cursoData?.modulos?.length > 0 ? cursoData.modulos[cursoData.modulos.length - 1] : undefined;

      const firstLeccion = cursoData?.modulos?.length > 0 ? cursoData.modulos[0].lecciones[0] : undefined;

      const lastLeccion =
        lastModulo?.lecciones?.length > 0 ? lastModulo?.lecciones[lastModulo?.lecciones?.length - 1] : undefined;

      // Si acabamos de empezar un curso, o lo hemos terminado, actualizamos el progresoGlobal de la context.
      if (firstLeccion?.id === +leccionId || lastLeccion?.id === +leccionId) {
        const _progresoGlobal = await getProgresoGlobalByID({
          id: progresoGlobal?.id || 0,
        });

        if (_progresoGlobal) setProgresoGlobal({ ..._progresoGlobal });
      }
    }
  };

  useEffect(() => {
    if (!leccion) return;
    if (!curso) return;

    const _modulo = curso?.modulos?.find((m: any) => leccion?.moduloId === m.id);
    const _leccion = _modulo?.lecciones?.find((l: any) => leccion?.id === l.id);

    if (_leccion?.meta?.isBlocked) {
      onFailure(toast, 'Redirigiendo a la portada del curso', 'Has intentado entrar en una lección bloqueada');
      navigate(`/cursos/${curso?.id}`);
    }
  }, [leccion, curso]);

  /** Detectamos si la lección está completada */
  useEffect(() => {
    if (!curso) return;
    if (!leccion) return;

    let _isCompleted = getLeccionCompleted();
    setIsCompleted(_isCompleted || false);
  }, [leccion, curso]);

  const getLeccionCompleted = () => {
    const _modulo = curso?.modulos?.find((m: any) => leccion?.moduloId === m.id);
    const _leccion = _modulo?.lecciones?.find((l: any) => leccion?.id === l.id);

    return _leccion?.meta?.isCompleted;
  };

  /** Si la lección está completada, cambiamos el mode a Siguiente */
  useEffect(() => {
    setMode(isCompleted ? ModeEnum.SIGUIENTE : ModeEnum.BLOQUEADA);
  }, [leccionId, isCompleted]);

  /**
   * Cuando empezamos una nueva lección, creamos un nuevo progreso del tipo "visto".
   *
   * @param leccion Lección sobre la que crear el progreso.
   */
  const onLeccionStarted = async (leccion: ILeccion) => {
    if (user?.id && curso?.id && leccion.id && leccion.moduloId) {
      let progresoExists = await checkIfProgresoDuplicado(user.id, leccion.id, ProgresoTipoEnum.VISTO);

      if (!progresoExists)
        await addProgreso({
          progreso: {
            userId: user?.id,
            cursoId: curso?.id,
            leccionId: leccion.id,
            moduloId: leccion.moduloId,
            tipo: ProgresoTipoEnum.VISTO,
          },
        }).catch((error) => {
          console.log('Error al crear el progreso', { error });
        });
    }
  };

  /**
   * Cuando hemos terminado la lección, creamos un nuevo progreso del tipo "completado".
   *
   * @param leccion Lección sobre la que crear el progreso.
   */
  const onLeccionCompleted = async (leccion: ILeccion) => {
    if (user?.id && curso?.id && leccion?.id && leccion?.moduloId) {
      let progresoExists = await checkIfProgresoDuplicado(user.id, leccion.id, ProgresoTipoEnum.COMPLETADO);

      if (!progresoExists)
        await addProgreso({
          progreso: {
            userId: user?.id,
            cursoId: curso?.id,
            leccionId: leccion.id,
            moduloId: leccion.moduloId,
            tipo: ProgresoTipoEnum.COMPLETADO,
          },
        })
          .then((message: any) => refreshState(true))
          .catch((error) => {
            console.log('Error al crear el progreso', { error });
          });
    }
  };

  const checkIfProgresoDuplicado = async (userId: any, leccionId: any, tipo: ProgresoTipoEnum = ProgresoTipoEnum.VISTO) => {
    // Comprobamos que no exista un progreso ya creado para esta lección y este usuario.
    const progresoDuplicado = await getProgresos({
      query: [{ user_id: userId }, { leccion_id: leccionId }, { tipo }],
    });

    // Si hay progresos en la lista entonces no creamos uno nuevo para evitar el 400.
    return (progresoDuplicado?.data?.length || 0) > 0;
  };

  const onPrevLeccion = () => {
    if (!leccion) return;

    let prevLeccion: any;

    // Usamos .find para parar el bucle al encontrar la lección.
    curso?.modulos?.find((modulo: any, index: number) => {
      // Buscamos el módulo de la lección seleccionada
      if (leccion?.moduloId === modulo.id) {
        // Si es la primera lección de módulo, seleccionamos el modulo anterior.
        if (leccion?.id === modulo.lecciones[0].id) {
          const prevModulo = curso?.modulos ? curso?.modulos[index - 1] : undefined;

          if (prevModulo)
            prevLeccion = prevModulo?.lecciones ? prevModulo?.lecciones[prevModulo.lecciones.length - 1] : undefined;
        } else {
          // Si aún quedan lecciones en el módulo, escogemos la anterior.
          const index = modulo.lecciones?.findIndex((l: any) => l.id === leccion.id);

          if (index > -1) prevLeccion = modulo.lecciones[index - 1];
        }
      }

      // Si la lección anterior está bloqueada (O no existe), bloqueamos el botón.
      setPrevIsBlocked(!prevLeccion || prevLeccion?.meta?.isBlocked === true);

      // Si la lección siguiente estaba bloquedada y hemos podido pasar de lección,
      // desbloqueamos el botón de la lección anterior
      if (nextIsBlocked && prevLeccion) setNextIsBlocked(false);

      // Si la hemos encontrado, devolvemos 'true' para terminar con el find
      return prevLeccion !== undefined;
    });

    if (prevLeccion) navigate(`/cursos/${curso?.id}/leccion/${prevLeccion.id}`);
  };

  const getNextLeccion = () => {
    if (!leccion) return undefined;

    let nextLeccion: any;

    // Usamos .find para parar el bucle al encontrar la lección.
    curso?.modulos?.find((modulo: any, index: number) => {
      // Buscamos el módulo de la lección seleccionada
      if (leccion?.moduloId === modulo.id) {
        // Si es la última lección de módulo, seleccionamos el modulo siguiente
        if (leccion?.id === modulo.lecciones[modulo.lecciones?.length - 1].id) {
          const nextModulo = curso?.modulos ? curso?.modulos[index + 1] : undefined;

          if (nextModulo) nextLeccion = nextModulo?.lecciones ? nextModulo?.lecciones[0] : undefined;
        } else {
          // Si aún quedan lecciones en el módulo, escogemos la siguiente.
          const index = modulo.lecciones?.findIndex((l: any) => l.id === leccion?.id);

          if (index > -1) nextLeccion = modulo.lecciones[index + 1];
        }
      }

      // Si la siguiente lección está bloqueada (O no existe), bloqueamos el botón
      setNextIsBlocked(!nextLeccion || nextLeccion?.meta?.isBlocked === true);

      // Si la lección anterior estaba bloquedada, y hemos podido pasar de lección,
      // desbloqueamos el botón de la lección anterior
      if (prevIsBlocked && nextLeccion) setPrevIsBlocked(false);

      // Si la hemos encontrado, devolvemos 'true' para terminar con el find
      return nextLeccion !== undefined;
    });

    return nextLeccion;
  };

  const delay = (delayInms: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  };

  /* Método para navegar a la siguiente lección */
  const onNextLeccion = async () => {
    const nextLeccion: ILeccion = getNextLeccion();

    if (isCompleted && nextLeccion?.meta?.isBlocked === false) {
      navigate(`/cursos/${curso?.id}/leccion/${nextLeccion.id}`);
    } else if (!isCompleted) {
      if (nextLeccion) {
        setMode(ModeEnum.CARGANDO);
        nextLeccion.meta = { ...nextLeccion.meta, isBlocked: false };

        if (leccion) {
          onLeccionCompleted(leccion);
          setMode(ModeEnum.DESBLOQUEADA);

          await delay(1000);
          setMode(ModeEnum.SIGUIENTE);
        }
      } else if (!nextLeccion) return;
    }
  };

  return (
    <Flex minW="100vw" maxH="100%" overflow="hidden">
      {isMobileBrowser || isMobile ? (
        <ResponsiveSidebarLeccion
          curso={curso}
          leccion={leccion}
          onLeccionCompleted={onLeccionCompleted}
          state={{ isOpen: openSidebar, onClose: () => setOpenSidebar(false) }}
          onExamenSelect={(examen: IExamen) => navigate(`/cursos/${cursoId}/test/${examen.id}`)}
          onLeccionSelect={(leccion: ILeccion) => navigate(`/cursos/${cursoId}/leccion/${leccion.id}`)}
        />
      ) : (
        <Flex
          bg="white"
          maxH="100%"
          overflow="auto"
          overflowX="hidden"
          w={openSidebar ? '400px' : '0px'}
          minW={openSidebar ? '400px' : '0px'}
          style={{ transition: 'all 0.6s ease-in-out' }}
          borderRight="1px solid var(--chakra-colors-gray_3)"
        >
          <SidebarLeccion
            curso={curso}
            leccion={leccion}
            onLeccionCompleted={onLeccionCompleted}
            state={{
              isOpen: openSidebar,
              onClose: () => setOpenSidebar(false),
            }}
            onExamenSelect={(examen: IExamen) => navigate(`/cursos/${cursoId}/test/${examen.id}`)}
            onLeccionSelect={(leccion: ILeccion) => navigate(`/cursos/${cursoId}/leccion/${leccion.id}`)}
          />
        </Flex>
      )}

      <Flex
        pb="48px"
        boxSize="100%"
        align="center"
        direction="column"
        overflowY="scroll"
        overflowX="hidden"
        px={{ base: '10px', sm: '40px' }}
      >
        <LeccionHeader
          showSearchbar
          curso={curso}
          openNotas={openNotas}
          showSidebar={!openSidebar}
          openNotes={() => setOpenNotas(!openNotas)}
          openSidebar={() => setOpenSidebar(true)}
        />

        <Flex
          w="100%"
          bg="white"
          maxW="1320px"
          rounded="20px"
          p={{ base: '20px', sm: '40px' }}
          m={{ base: '5px', sm: '24px 40px 20px' }}
        >
          {leccion?.tipo === LeccionTipoEnum.ENTREGABLE || leccion?.tipo === LeccionTipoEnum.AUTOCORREGIBLE ? (
            <EntregableLeccion leccion={leccion} onLeccionCompleted={onLeccionCompleted} />
          ) : leccion?.tipo === LeccionTipoEnum.ZOOM ? (
            <ZoomLeccion leccion={leccion} onLeccionCompleted={onLeccionCompleted} />
          ) : leccion?.tipo === LeccionTipoEnum.MARKDOWN ? (
            <MarkdownLeccion leccion={leccion} />
          ) : leccion?.tipo === LeccionTipoEnum.DIAPOSITIVA ? (
            <SlidesLeccion leccion={leccion} />
          ) : leccion?.tipo === LeccionTipoEnum.VIDEO ? (
            <VideoLeccion
              leccion={leccion}
              enableKeyboard={!openNotas}
              onLeccionStarted={onLeccionStarted}
              onLeccionCompleted={onLeccionCompleted}
            />
          ) : leccion?.tipo === LeccionTipoEnum.RECURSO ? (
            <RecursoLeccion leccion={leccion} />
          ) : (
            <Flex h="500px" />
          )}
        </Flex>

        <Flex w="100%" px="10px" gap="20px" maxW="1320px" align="center" justify="space-between">
          <Tooltip label={prevIsBlocked ? '¡No hay más lecciones antes que esta!' : ''}>
            <Button
              h="52px"
              bg="gray_3"
              rounded="14px"
              data-cy="on_prev_leccion"
              w="fit-content"
              onClick={onPrevLeccion}
              pr={isMobile ? '8px' : ''}
              isDisabled={prevIsBlocked}
              children={isMobile ? '' : 'Lección anterior'}
              leftIcon={<Icon as={BiLeftArrowAlt} boxSize="24px" />}
            />
          </Tooltip>

          <Tooltip label={nextIsBlocked ? '¡Completa el módulo actual para seguir con la siguiente lección!' : ''}>
            <Button
              h="52px"
              rounded="14px"
              data-cy="on_next_leccion"
              w="fit-content"
              isLoading={mode === ModeEnum.CARGANDO}
              onClick={onNextLeccion}
              _hover={{ opacity: '0.8' }}
              bg={mode === ModeEnum.DESBLOQUEADA ? 'primary' : 'gray_3'}
            >
              {mode === ModeEnum.BLOQUEADA ? (
                <Flex align="center" gap="13px">
                  {isMobile ? '' : 'Completar Lección '}
                  <Icon as={BiCheck} boxSize="24px" />
                </Flex>
              ) : mode === ModeEnum.CARGANDO ? (
                <Spinner />
              ) : mode === ModeEnum.DESBLOQUEADA ? (
                <Icon as={BiCheck} color="primary" bg="#FFF" rounded="full" mx={{ base: '3px', md: '70px' }} />
              ) : (
                <Flex align="center" gap="13px">
                  {isMobile ? '' : 'Siguiente Leccion '}
                  <Icon as={BiRightArrowAlt} boxSize="24px" />
                </Flex>
              )}
            </Button>
          </Tooltip>
        </Flex>
      </Flex>

      <NotasDnd leccion={leccion} state={{ isOpen: openNotas, onClose: () => setOpenNotas(false) }} />
    </Flex>
  );
};

export default Leccion;

import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMediaQuery, Text, Flex, Box, Grid } from '@chakra-ui/react';

import { ICurso, useLeccion, UserRolEnum, filterCursosByRuta } from 'data';
import { LoginContext, RoadmapContext, ProgresoGlobalContext } from '../../../shared/context';
import { useCurso, useCursos } from 'data';
import { GlobalCard, GlobalCardType } from '../../../shared/components';

import { CursoItem } from '../components/CursoItem';
import { AdminWidget } from '../components/DashboardWidgets/Admin';
import { DiscordWidget } from '../components/DashboardWidgets/Discord';
import { RoadmapWidget } from '../components/DashboardWidgets/Roadmap';
import { ComoFunciona } from '../components/DashboardWidgets/ComoFunciona';

import gradientStyle from './Dashboard.module.scss';

export const HomeDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(LoginContext);
  const { ruta } = useContext(RoadmapContext);
  const { progresoGlobal } = useContext(ProgresoGlobalContext);

  const [isScreenLargerThan1025] = useMediaQuery('(min-width: 1025px)');
  const [isScreenLargerThan850] = useMediaQuery('(min-width: 850px)');
  const [isScreenLargerThan600] = useMediaQuery('(min-width: 500px)');

  const [cursoInicialId, setCursoInicialId] = useState(
    progresoGlobal?.ruta?.meta?.itinerario ? progresoGlobal?.ruta?.meta?.itinerario[0] : 1
  );

  useEffect(() => {
    if (progresoGlobal?.ruta?.meta?.itinerario) setCursoInicialId(progresoGlobal?.ruta?.meta?.itinerario[0] || 1);
  }, [progresoGlobal?.ruta?.meta?.itinerario]);

  const { curso: cursoInicial, isLoading: isLoading_Inicial } = useCurso({
    id: cursoInicialId,
    userId: user?.id,
    strategy: 'invalidate-on-undefined',
  });

  const { cursos: cursoActivo, isLoading: isLoading_Activo } = useCursos({
    userId: user?.id,
    strategy: 'invalidate-on-undefined',
    query: [{ leccion_id: progresoGlobal?.progresoLecciones?.lastPlayed }],
  });

  const { cursos, isLoading } = useCursos({
    userId: user?.id,
    strategy: 'invalidate-on-undefined',
    query: [{ limit: 4 }],
  });

  const { cursos: cursos_Roadmap, isLoading: isLoading_Roadmap } = useCursos({
    userId: user?.id,
    strategy: 'invalidate-on-undefined',
    query: [{ ruta: ruta?.itinerario }],
  });

  const [leccionActivaId, setLeccionActivaId] = useState(progresoGlobal?.progresoLecciones?.lastPlayed);

  const { leccion: leccionActiva } = useLeccion({
    id: leccionActivaId,
    strategy: 'invalidate-on-undefined',
  });

  /** Primer curso incompleto de la ruta */
  const _roadmap = filterCursosByRuta(ruta?.meta?.itinerario, cursos_Roadmap);

  const siguienteCurso = _roadmap?.filter((c: ICurso) => c.meta?.isCompleted === false);

  useEffect(() => {
    // Si ya ha cargado el curso inicial, y no hemos visto aún ninguna lección,
    // cargamos como leccionActivaId la primera lección de cursoInicial
    if (cursoInicial && !progresoGlobal?.progresoLecciones?.lastPlayed) {
      let newLeccionId = ((cursoInicial?.modulos || [])[0]?.lecciones || [])[0]?.id;

      setLeccionActivaId(newLeccionId);
    }
  }, [cursoInicial]);

  return (
    <Flex
      w="100%"
      align="flex-start"
      p={{ base: '0px', sm: '34px' }}
      gap={{ base: '30px', xl: '80px' }}
      direction={{ base: 'column', md: 'row' }}
    >
      {/* LEFT WIDE COLUMN */}
      <Flex flex={2} gap="62px" direction="column" w={{ base: '100%', md: '65%' }} pb={{ base: '0px', md: '40px' }}>
        {/* BIENVENIDO AL CAMPUS */}
        {!isLoading_Inicial
          ? cursoInicial &&
            !cursoActivo && (
              <Flex direction="column" gap="20px" order={0}>
                <GreetingsTitle nombre={user?.nombre} type="greetings" />

                <GlobalCard
                  maxPerRow={1}
                  gapBetween="28px"
                  type={GlobalCardType.CURSO_ACTIVO}
                  rounded={{ base: 'none', sm: '2xl' }}
                  props={{
                    curso: cursoInicial,
                    leccion: leccionActiva,
                    isFirstCurso: true,
                  }}
                />
              </Flex>
            )
          : cursoInicial &&
            !cursoActivo && (
              <Flex direction="column" gap="20px" order={0}>
                <GreetingsTitle nombre={user?.nombre} type="greetings" />

                <GlobalCard
                  maxPerRow={1}
                  gapBetween="28px"
                  type={GlobalCardType.CURSO_ACTIVO}
                  rounded={{ base: 'none', sm: '2xl' }}
                  props={{ isLoading: true }}
                />
              </Flex>
            )}

        {/* CONTINUA POR DONDE LO DEJASTE */}
        {!isLoading_Activo
          ? cursoActivo?.length === 1 &&
            cursoActivo[0] &&
            !cursoActivo[0]?.meta?.isCompleted && (
              <Flex direction="column" gap="20px" order={0}>
                <GreetingsTitle nombre={user?.nombre} type="continue" />

                <GlobalCard
                  maxPerRow={1}
                  gapBetween="28px"
                  type={GlobalCardType.CURSO_ACTIVO}
                  rounded={{ base: 'none', sm: '2xl' }}
                  props={{
                    curso: cursoActivo[0],
                    leccion: leccionActiva,
                  }}
                />
              </Flex>
            )
          : cursoActivo?.length === 1 &&
            cursoActivo[0] &&
            !cursoActivo[0]?.meta?.isCompleted && (
              <Flex direction="column" gap="20px" order={0}>
                <GreetingsTitle nombre={user?.nombre} type="continue" />

                <GlobalCard
                  maxPerRow={1}
                  gapBetween="28px"
                  type={GlobalCardType.CURSO_ACTIVO}
                  rounded={{ base: 'none', sm: '2xl' }}
                  props={{ isLoading: true }}
                />
              </Flex>
            )}

        {/* SIGUE TU HOJA DE RUTA */}
        {!isLoading_Roadmap
          ? siguienteCurso &&
            ((cursoActivo && cursoActivo[0]?.meta?.isCompleted) || !cursoActivo) &&
            (cursoInicial?.meta?.isCompleted || !cursoInicial) && (
              <Flex direction="column" gap="20px" order={0}>
                <GreetingsTitle nombre={user?.nombre} type="next_route" />

                <GlobalCard
                  maxPerRow={1}
                  gapBetween="28px"
                  type={GlobalCardType.CURSO_ACTIVO}
                  rounded={{ base: 'none', sm: '2xl' }}
                  props={{
                    curso: siguienteCurso && siguienteCurso[0],
                    leccion: leccionActiva,
                    isFirstCurso: true,
                  }}
                />
              </Flex>
            )
          : siguienteCurso &&
            !cursoActivo &&
            !cursoInicial && (
              <Flex direction="column" gap="20px" order={0}>
                <GreetingsTitle nombre={user?.nombre} type="next_route" />

                <GlobalCard
                  maxPerRow={1}
                  gapBetween="28px"
                  type={GlobalCardType.CURSO_ACTIVO}
                  rounded={{ base: 'none', sm: '2xl' }}
                  props={{ isLoading: true }}
                />
              </Flex>
            )}

        <RightColumn user={user} display={{ base: 'flex', md: 'none' }} />

        {/* QUÉ MÁS PUEDES APRENDER */}
        <Flex
          gap="20px"
          align="start"
          direction="column"
          justify-content="space-between"
          order={{ base: 2, md: 0 }}
          px={{ base: '34px', sm: '0px' }}
          pb={{ base: '40px', md: '0px' }}
        >
          <Flex w="100%" justify="space-between">
            <Box fontWeight="bold" fontSize={{ base: '16px', sm: '18px' }}>
              Cursos mejor valorados {process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' && 'de OpenBootcamp'}
              {process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS' && 'de OpenMarketers'}
            </Box>

            <Box
              color="#8B8FA1"
              cursor="pointer"
              fontSize="15px"
              lineHeight="18px"
              whiteSpace="nowrap"
              fontWeight="semibold"
              textDecoration="underline"
              onClick={() => navigate('/cursos')}
            >
              Ver todos
            </Box>
          </Flex>

          {isScreenLargerThan1025 ? (
            <Flex gap="21px" wrap="wrap" w="100%" direction="row" data-cy="home_cursos_recomendados">
              {isLoading
                ? [0, 1, 2, 3].map((c) => <CursoItem isLoading key={c} />)
                : cursos
                    ?.filter((c: ICurso) => c.disponible)
                    ?.map((c: ICurso, i: number) => (
                      <GlobalCard
                        key={i}
                        maxPerRow={4}
                        gapBetween="21px"
                        type={GlobalCardType.CURSO}
                        props={{ curso: c, showProgress: false }}
                        onClick={() => navigate(`/cursos/${c?.id}`)}
                      />
                    ))}
            </Flex>
          ) : (
            <Grid
              gap={4}
              boxSize="100%"
              data-cy="home_cursos_recomendados"
              templateRows={
                isScreenLargerThan850 ? 'repeat(2, 1fr)' : isScreenLargerThan600 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'
              }
              templateColumns={
                isScreenLargerThan850 ? 'repeat(3, 1fr)' : isScreenLargerThan600 ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)'
              }
            >
              {isLoading
                ? [0, 1, 2, 3].map((c) => <CursoItem isLoading key={c} />)
                : cursos
                    ?.filter((c: ICurso) => c.disponible)
                    ?.map((c: ICurso, i: number) => (
                      <GlobalCard
                        key={i}
                        maxPerRow={4}
                        gapBetween="21px"
                        type={GlobalCardType.CURSO}
                        props={{ curso: c, showProgress: false }}
                        onClick={() => navigate(`/cursos/${c?.id}`)}
                      />
                    ))}
            </Grid>
          )}
        </Flex>

        {/* CÓMO FUNCIONA OB */}
        {process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' && (
          <Flex h="100%" gap="20px" direction="column" order={{ base: 1, md: 0 }} px={{ base: '34px', sm: '0px' }}>
            <Flex direction="column" gap="10px">
              <Text fontWeight="bold" fontSize={{ base: '16px', sm: '18px' }}>
                ¿En qué fase de OpenBootcamp estás?
              </Text>

              <Text fontSize="15px">
                OB ha nacido para poder cambiar la forma en la que los desarrolladores se forman y consiguen sus empleos.
                Nuestra misión es formarte en la últimas tecnologías y frameworks para que puedas acceder a puestos laborales
                acorde a tus necesidades. Estas son nuestras fases:
              </Text>
            </Flex>

            <ComoFunciona />
          </Flex>
        )}
      </Flex>
      <RightColumn user={user} display={{ base: 'none', md: 'flex' }} />
    </Flex>
  );
};

const RightColumn = ({ display, user }: { display: any; user: any }) => {
  return (
    <Flex flex={1} minW="30%" gap="60px" boxSize="100%" display={display} direction="column" pb={{ base: '40px', md: '0px' }}>
      {user?.rol && user?.rol !== UserRolEnum.ESTUDIANTE && (
        <Flex px={{ base: '34px', sm: '0px' }}>
          <AdminWidget />
        </Flex>
      )}

      {/* TU HOJA DE RUTA */}
      <DiscordWidget />

      <Flex px={{ base: '34px', sm: '0px' }}>
        <RoadmapWidget />
      </Flex>
    </Flex>
  );
};

const GreetingsTitle = ({
  nombre = 'Anónimo',
  type = 'greetings',
}: {
  nombre?: string;
  type: 'greetings' | 'continue' | 'next_route';
}) => (
  <Flex gap="4px" w="100%" pb="0px" wrap="wrap" align="center" p={{ base: '34px', sm: '0px' }}>
    <Flex align="center" wrap="nowrap" fontWeight="bold" fontSize={{ base: '22px', sm: '28px' }} lineHeight="33.89px">
      <span role="img" aria-label="Hola">
        👋 ¡Hola {<span className={gradientStyle.nameGradient}>{nombre}</span>}, {''}
      </span>
    </Flex>

    <Flex wrap="nowrap" fontWeight="bold" lineHeight="33.89px" fontSize={{ base: '22px', sm: '28px' }}>
      {type === 'greetings'
        ? `empieza a aprender con ${
            process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP'
              ? 'OpenBootcamp'
              : process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS'
              ? 'OpenMarketers'
              : 'Imagina'
          }!`
        : type === 'continue'
        ? 'continua por donde lo habías dejado!'
        : 'continua tu hoja de ruta!'}
    </Flex>
  </Flex>
);

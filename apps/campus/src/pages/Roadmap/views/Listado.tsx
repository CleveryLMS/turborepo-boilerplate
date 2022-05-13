import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Flex } from '@chakra-ui/react';
import { BiBookOpen, BiBookBookmark, BiTimeFive } from 'react-icons/bi';

import { ICurso } from 'data';
import { PageHeader } from '../components/PageHeader';
import { useCursos, filterCursosByRuta } from 'data';
import { GlobalCard, GlobalCardType } from '../../../shared/components';
import { LoginContext, ProgresoGlobalContext, RoadmapContext } from '../../../shared/context';

const RoadmapList = () => {
  const navigate = useNavigate();

  const { user } = useContext(LoginContext);
  const { ruta } = useContext(RoadmapContext);
  const { progresoGlobal } = useContext(ProgresoGlobalContext);

  const { cursos, isLoading, isError } = useCursos({
    userId: user?.id,
    strategy: 'invalidate-on-undefined',
    query: [{ ruta: ruta?.itinerario }, { limit: 100 }],
  });

  return (
    <Flex w="100%" gap="20px" direction="column" p={{ base: '20px', sm: '34px' }}>
      <PageHeader
        kpis={[
          {
            icon: BiBookOpen,
            isProgress: true,
            color: 'primary',
            bgColor: 'primary_light',
            title: 'Progreso Hoja de Ruta',
            progress: progresoGlobal?.meta?.progresoCursos,
            value: `${progresoGlobal?.meta?.progresoCursos || 0}% Completo`,
          },
          {
            color: 'primary',
            bgColor: 'primary_light',
            title: 'Cursos Completados',
            icon: BiBookBookmark,
            value:
              (progresoGlobal?.meta?.cursosCompletados?.filter((id) => ruta?.meta?.itinerario?.includes(id))?.length || 0) +
              ` Curso${
                (progresoGlobal?.meta?.cursosCompletados?.filter((id) => ruta?.meta?.itinerario?.includes(id))?.length || 0) !==
                1
                  ? 's'
                  : ''
              }`,
          },
          {
            icon: BiTimeFive,
            value: progresoGlobal?.tiempoTotal + '',
            color: 'primary',
            bgColor: 'primary_light',
            title: 'Tiempo Total Invertido',
          },
        ]}
      />

      <Flex w="100%" pb="40px" wrap="wrap" gap="27px 12px" data-cy="listado_cursos_roadmap">
        {isLoading || !cursos
          ? Array.from(Array(8).keys())?.map((n) => (
              <GlobalCard
                maxPerRow={5}
                gapBetween="12px"
                type={GlobalCardType.ROADMAP}
                key={'roadmap-card-placeholder' + n}
                props={{ isLoading: true }}
              />
            ))
          : filterCursosByRuta(ruta?.meta?.itinerario, cursos)?.map((curso: ICurso, index: number) => (
              <GlobalCard
                maxPerRow={5}
                gapBetween="12px"
                type={GlobalCardType.ROADMAP}
                key={'roadmap-card-' + index}
                onClick={curso.disponible ? () => navigate(`/cursos/${curso?.id}`) : () => {}}
                cursor={curso.disponible ? 'pointer' : 'not-allowed'}
                props={{
                  curso: curso,
                  index: index + 1,
                  isBlocked: curso?.meta?.isBlocked,
                  isCompleted: curso?.meta?.isCompleted,
                }}
              />
            ))}
      </Flex>
    </Flex>
  );
};

export default RoadmapList;

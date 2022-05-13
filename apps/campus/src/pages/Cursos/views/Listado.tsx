import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { BiChevronDown, BiFilterAlt, BiSortDown, BiSortUp } from 'react-icons/bi';
import { Box, Button, Flex, Icon, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';

import { LoginContext, LayoutContext, RoadmapContext, ProgresoGlobalContext } from '../../../shared/context';
import { ICurso } from 'data';
import { useCursos, filterCursosByRuta } from 'data';
import { GlobalCard, GlobalCardType } from '../../../shared/components';

enum CursoFilter {
  ROADMAP = 'Mi hoja de ruta',
  TODOS = 'Todos',
  EXTRA = 'Extra',
  COMPLETADOS = 'Completados',
}

enum CursoFilter_Incubacion {
  ROADMAP = 'Mi hoja de ruta',
  TODOS = 'Todos',
  COMPLETADOS = 'Completados',
}

enum CursoSortBy {
  // RECOMENDADOS = 'Recomendados',
  ALFABETICO = 'Alfabético',
  ACTUALIZACION = 'Actualizados',
}

enum CursoOrder {
  DESC = 'desc',
  ASC = 'asc',
}

const Listado = () => {
  const navigate = useNavigate();
  const { user } = useContext(LoginContext);
  const { ruta } = useContext(RoadmapContext);
  const { progresoGlobal } = useContext(ProgresoGlobalContext);
  const { setShowHeader, setShowSidebar } = useContext(LayoutContext);

  const [query, setQuery] = useState<any[]>([]);
  const [order, setOrder] = useState<CursoOrder>(CursoOrder.ASC);
  const [filter, setFilter] = useState<CursoFilter>(CursoFilter.ROADMAP);
  const [sortBy, setSortBy] = useState<CursoSortBy>(CursoSortBy.ALFABETICO);

  const { cursos, isLoading } = useCursos({ query: query, userId: user?.id });
  const {
    cursos: cursosIniciados,
    isLoading: isLoading_Iniciados,
    isError: isError_Iniciados,
  } = useCursos({
    query: [{ ruta: progresoGlobal?.cursosIniciados }],
    userId: user?.id,
  });

  useEffect(() => {
    setShowHeader(true);
    setShowSidebar(true);
  }, []);

  useEffect(() => {
    refreshState();
  }, [filter, sortBy, order, ruta]);

  const refreshState = async () => {
    let _query: string | null = '&limit=100';

    if (filter === CursoFilter.ROADMAP) {
      if ((ruta?.meta?.itinerario?.length || 0) === 0) return;

      _query += '&ruta=' + (ruta?.itinerario || '') + '&extra=false';
    } else if (filter === CursoFilter.COMPLETADOS) {
      if ((progresoGlobal?.meta?.cursosCompletados?.length || 0) === 0) return;

      _query += '&ruta=' + (progresoGlobal?.cursosCompletados || '') + '&extra=false';
    } else if (filter === CursoFilter.EXTRA) {
      _query += '&extra=true';
    }

    if (sortBy === CursoSortBy.ACTUALIZACION) _query += `&sort_by=updatedAt`;
    else if (sortBy === CursoSortBy.ALFABETICO) _query += `&sort_by=titulo`;

    _query += `&order=${order}`;

    const auxQuery = _query
      .split('&')
      .map((item: any) => {
        const split = item.split('=');

        if (!split[0] && !split[1]) return undefined;
        else return { [split[0]]: split[1] };
      })
      .filter((v: any) => v);

    setQuery(auxQuery);
  };

  return (
    <Flex w="100%" gridRowGap="68px" direction="column" p={{ base: '20px', sm: '34px' }}>
      {(progresoGlobal?.meta?.cursosIniciados?.length || 0) > 0 && !isError_Iniciados && (
        <Flex direction="column">
          <Box fontSize="19px" fontWeight="bold" mb="20px" lineHeight="100%">
            Continuar
          </Box>

          <Flex w="100%" wrap="wrap" gap="20px 28px">
            {isLoading_Iniciados
              ? Array.from(Array(2).keys()).map((n) => (
                  <GlobalCard
                    maxPerRow={5}
                    gapBetween="28px"
                    type={GlobalCardType.CURSO}
                    props={{ isLoading: true }}
                    key={'curso-item-h-placeholder-' + n}
                  />
                ))
              : (progresoGlobal?.meta?.cursosIniciados?.length || 0) > 0
              ? filterCursosByRuta(ruta?.meta?.itinerario || [], cursosIniciados)?.map((curso: ICurso, index) => (
                  <GlobalCard
                    maxPerRow={5}
                    gapBetween="28px"
                    type={GlobalCardType.CURSO}
                    key={'curso-iniciado-' + index}
                    onClick={() => navigate('/cursos/' + curso.id)}
                    props={{
                      curso: curso,
                      index: index + 1,
                      isBlocked: curso.meta?.isBlocked,
                      isCompleted: curso.meta?.isCompleted,
                    }}
                  />
                ))
              : undefined}
          </Flex>
        </Flex>
      )}

      <Flex direction="column" gap="20px">
        <Flex
          gap="10px"
          justify="space-between"
          align={{ base: 'start', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
        >
          <Box fontSize="19px" fontWeight="bold" lineHeight="100%">
            Cursos
          </Box>

          <Flex gap="10px" align={{ base: 'start', sm: 'end' }} direction={{ base: 'column', sm: 'row' }}>
            <Menu>
              <MenuButton
                as={Button}
                bg="gray_2"
                p="5px 10px"
                rounded="8px"
                _hover={{ filter: 'brightness(90%)' }}
                leftIcon={<Icon as={BiFilterAlt} boxSize="20px" />}
                rightIcon={<Icon as={BiChevronDown} boxSize="20px" />}
              >
                {filter}
              </MenuButton>

              <MenuList color="black" bg="white">
                {Object.values(user?.grupos?.find((g) => g.nombre === 'Incubación') ? CursoFilter_Incubacion : CursoFilter).map(
                  (value, index) => (
                    <MenuItem
                      cursor="pointer"
                      fontSize="16px"
                      fontWeight="bold"
                      _hover={{ bg: 'gray_1' }}
                      _focus={{ bg: 'gray_1' }}
                      key={'cursos-filter-' + index}
                      onClick={() => setFilter(value)}
                    >
                      {value}
                    </MenuItem>
                  )
                )}
              </MenuList>
            </Menu>

            <Menu>
              <MenuButton
                as={Button}
                bg="gray_2"
                p="5px 10px"
                rounded="8px"
                _hover={{ filter: 'brightness(90%)' }}
                rightIcon={<Icon as={BiChevronDown} boxSize="20px" />}
                leftIcon={
                  <Icon
                    as={order === CursoOrder.DESC ? BiSortDown : BiSortUp}
                    boxSize="20px"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOrder(order === CursoOrder.DESC ? CursoOrder.ASC : CursoOrder.DESC);
                    }}
                  />
                }
              >
                {sortBy}
              </MenuButton>

              <MenuList color="black" bg="white">
                {Object.values(CursoSortBy).map((value, index) => (
                  <MenuItem
                    cursor="pointer"
                    fontSize="16px"
                    fontWeight="bold"
                    _hover={{ bg: 'gray_1' }}
                    _focus={{ bg: 'gray_1' }}
                    key={'cursos-filter-' + index}
                    onClick={() => setSortBy(value)}
                  >
                    {value}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        <Flex w="100%" wrap="wrap" gap="20px 28px" data-cy="cursos_listado_bloque-inicial">
          {isLoading || !ruta?.itinerario
            ? Array.from(Array(10).keys()).map((n) => (
                <GlobalCard
                  maxPerRow={5}
                  gapBetween="28px"
                  type={GlobalCardType.CURSO}
                  key={'curso-item-h-placeholder-' + n}
                  props={{ isLoading: true }}
                />
              ))
            : filter === CursoFilter.COMPLETADOS && (progresoGlobal?.meta?.cursosCompletados?.length || 0) === 0
            ? undefined // Si no hay cursos superadas, entonces no mostramos nada... TODO: Debería estar a nivel de back
            : (filter === CursoFilter.ROADMAP ? filterCursosByRuta(ruta?.meta?.itinerario || [], cursos) : cursos)
                ?.filter((c: ICurso) => c.disponible)
                ?.map((c: ICurso) => (
                  <GlobalCard
                    maxPerRow={5}
                    gapBetween="28px"
                    type={GlobalCardType.CURSO}
                    key={'curso-item-' + c.id}
                    data-cy={'curso_' + c.titulo}
                    onClick={() => navigate('/cursos/' + c.id)}
                    props={{ curso: c }}
                  />
                ))}
        </Flex>

        {cursos?.filter((c: ICurso) => !c?.disponible)?.length > 0 ? (
          <Flex direction="column" gap="20px" pb="40px" pt="64px">
            <Flex align="end" justify="space-between" gap="10px">
              <Box fontSize="19px" fontWeight="bold" lineHeight="100%">
                Disponibles próximamente
              </Box>
            </Flex>

            <Flex w="100%" wrap="wrap" gap="28px">
              {isLoading
                ? Array.from(Array(3).keys()).map((n) => (
                    <GlobalCard
                      maxPerRow={5}
                      gapBetween="28px"
                      type={GlobalCardType.CURSO}
                      key={'curso-item-h-placeholder-' + n}
                      props={{ isLoading: true }}
                    />
                  ))
                : cursos
                    ?.filter((c: ICurso) => !c?.disponible)
                    ?.map((c: ICurso, index: number) => (
                      <GlobalCard
                        maxPerRow={5}
                        gapBetween="28px"
                        type={GlobalCardType.CURSO}
                        key={'certificacion-item-' + index}
                        props={{ curso: c, isPublished: false }}
                      />
                    ))}
            </Flex>
          </Flex>
        ) : null}
      </Flex>
    </Flex>
  );
};

export default Listado;

import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { BiTimeFive, BiStar, BiBarChart, BiListOl, BiPlay } from 'react-icons/bi';
import {
  Box,
  Button,
  Flex,
  Image,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Skeleton,
  useToast,
  IconButton,
} from '@chakra-ui/react';
import stc from 'string-to-color';
import { AiFillStar } from 'react-icons/ai';
import { FaRegEyeSlash } from 'react-icons/fa';

import { fmtMnts, onFailure, onWarning } from 'utils';
import { ICurso, IUser, useCurso, useExamenes, useLeccion } from 'data';
import { FavoritoTipoEnum, IFavorito } from 'data';
import { FavoritosContext, LayoutContext, LoginContext } from '../../../../shared/context';

import ColumnaContenido from './ColumnaContenido';
import { TabDescripcion } from './Tabs/TabDescripcion';
import { TabEjercicios } from './Tabs/TabEjercicios';
import { TabPruebas } from './Tabs/TabPruebas';

import { HeaderCurso } from './HeaderCurso';

const Portada = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(LoginContext);
  const { setShowHeader, setShowSidebar } = useContext(LayoutContext);

  const [leccionId, setLeccionId] = useState<number>();

  const { cursoId } = useParams<any>();
  const { curso, isLoading, isError } = useCurso({
    id: +(cursoId || 0),
    userId: user?.id,
    strategy: 'invalidate-on-undefined',
  });

  const { examenes } = useExamenes({
    strategy: 'invalidate-on-undefined',
    query: [{ cursos: `[${cursoId}]` }, { es_certificacion: false }],
  });

  const { leccion } = useLeccion({
    id: +(leccionId || 0),
    strategy: 'invalidate-on-undefined',
  });

  useEffect(() => {
    if ((curso?.modulos?.length || 0) > 0 && (curso?.modulos[0].lecciones?.length || 0) > 0) {
      let _leccionId = curso?.modulos[0].lecciones[0].id;

      curso?.modulos?.find((modulo: any) =>
        modulo.lecciones?.find((leccion: any) => {
          if (!leccion.meta?.isCompleted) {
            _leccionId = leccion.id;

            return true;
          }

          return false;
        })
      );

      setLeccionId(_leccionId);
    }
  }, [curso?.modulos]);

  useEffect(() => {
    setShowHeader(true);
    setShowSidebar(true);
  }, []);

  useEffect(() => {
    const state: any = location.state;

    if (curso?.id && state?.moduloId) {
      const modulo = curso?.modulos?.find((m: any) => m.id == state?.moduloId);

      if ((modulo?.lecciones?.length || 0) > 0) navigate(`/cursos/${cursoId}/leccion/${modulo.lecciones[0].id}`);
    }

    if (curso && !curso.disponible) {
      navigate('/cursos');

      onFailure(toast, 'Curso no disponible', '¡El contenido de este curso aún no está preparado!');
    }
  }, [curso]);

  useEffect(() => {
    if (isError) {
      navigate('/cursos');

      onFailure(toast, 'Error inesperado', 'El curso no existe o no está disponible.');
    }
  }, [isError]);

  const onContinueLeccion = () => {
    let leccionId = curso?.modulos[0].lecciones[0].id;

    curso?.modulos?.find((modulo: any) =>
      modulo.lecciones?.find((leccion: any) => {
        if (!leccion.meta?.isCompleted) {
          leccionId = leccion.id;

          return true;
        }

        return false;
      })
    );

    navigate(`/cursos/${cursoId}/leccion/${leccionId}`);
  };

  return !isLoading ? (
    <Flex
      gap={{ base: '40px', lg: 'unset' }}
      maxW="100%"
      boxSize="100%"
      position="relative"
      px={{ base: '20px', sm: '40px' }}
      pt={{ base: '20px', sm: '40px' }}
      direction={{ base: 'column', lg: 'row' }}
    >
      <Flex w="100%" flex={2} gap="28px" direction="column" mr={{ base: 'unset', lg: '546px' }}>
        {/* HEADER CURSO */}
        <HeaderPortada user={user} curso={curso} onContinueLeccion={onContinueLeccion} />

        {/* DESCRIPCION DEL CURSO */}
        <Flex bg="white" rounded="20px" overflow="hidden" direction="column" mb={{ base: 'unset', lg: '40px' }}>
          <HeaderCurso curso={curso} leccion={leccion} onContinueLeccion={onContinueLeccion} />

          <Tabs w="100%" flex={1} p="33px" mb="15px">
            <TabList
              w="100%"
              gap="40px"
              display="flex"
              borderBottom="none"
              alignContent="start"
              flexDirection={{ base: 'column-reverse', sm: 'row' }}
            >
              <Tab
                w="fit-content"
                px="-3px"
                color="gray_4"
                fontSize="18px"
                fontWeight="bold"
                _selected={{
                  color: 'black',
                  borderBottom: '2px solid var(--chakra-colors-black)',
                }}
              >
                Descripción del curso
              </Tab>

              <Tab
                w="fit-content"
                px="-3px"
                color="gray_4"
                fontSize="18px"
                fontWeight="bold"
                _selected={{
                  color: 'black',
                  borderBottom: '2px solid var(--chakra-colors-black)',
                }}
              >
                Ejercicios
              </Tab>

              <Tab
                w="fit-content"
                px="-3px"
                color="gray_4"
                fontSize="18px"
                fontWeight="bold"
                _selected={{
                  color: 'black',
                  borderBottom: '2px solid var(--chakra-colors-black)',
                }}
              >
                Pruebas de Conocimientos
              </Tab>
            </TabList>

            <TabPanels w="100%" pt="40px" borderTop="2px solid var(--chakra-colors-gray_1)">
              <TabPanel p="0px" w="100%">
                <TabDescripcion curso={curso} />
              </TabPanel>

              <TabPanel p="0px" w="100%">
                <TabEjercicios curso={curso} />
              </TabPanel>

              <TabPanel p="0px" w="100%">
                <TabPruebas curso={curso} examenes={examenes} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Flex>

      <Flex
        flex={1}
        right={{ base: 'unset', lg: 0 }}
        maxW={{ base: 'unset', lg: '556px' }}
        w={{ base: '100%', lg: 'fit-content' }}
        overflow={{ base: 'unset', lg: 'hidden' }}
        position={{ base: 'unset', lg: 'fixed' }}
        paddingBottom={{ base: '50px', lg: '0px' }}
      >
        <ColumnaContenido modulos={curso?.modulos} curso={curso} />
      </Flex>
    </Flex>
  ) : (
    <Flex w="100%" direction={{ base: 'column', lg: 'row' }} p="40px">
      <Flex
        gap="28px"
        minW="480px"
        direction="column"
        maxW={{ base: '100%', lg: '500px' }}
        w={{ base: '100%', lg: 'fit-content' }}
      >
        <Flex h="90px" rounded="20px" align="center">
          <Skeleton h="90px" rounded="20px" w={{ base: '300px', sm: '100%' }} />
        </Flex>

        <Flex direction="column" gap="20px" mt={{ base: '0px', sm: '20px' }}>
          <Skeleton h="20px" w="60px" />
          <Skeleton h="40px" w="100px" />

          <Flex direction="row" align="start" gap="5px">
            <Skeleton h="20px" w="95px" />
            <Skeleton h="20px" w="95px" />
            <Skeleton h="20px" w="95px" />
          </Flex>

          <Skeleton mb="20px" h="120px" w={{ base: '300px', sm: '100%' }} mt={{ base: '0px', sm: '20px' }} />

          <Skeleton h="40px" w="80px" mb="20px" />
        </Flex>

        <Flex direction="column" gap="20px" mt="20px">
          <Flex>
            <Skeleton boxSize="60px" rounded="full" mr="15px" />

            <Flex direction="column" gap="20px">
              <Skeleton h="20px" w="60px" />
              <Skeleton h="20px" w="60px" />
            </Flex>
          </Flex>

          <Flex direction="column" gap="20px" mb="40px">
            <Skeleton h="20px" w="60px" />
            <Skeleton h="20px" w="60px" />
          </Flex>
        </Flex>
      </Flex>

      <Flex direction="column" gap="20px" w="100%">
        <Flex w="100%" justify="space-between" gap={{ base: '5px', sm: '0px' }}>
          <Skeleton h="40px" w="150px" rounded="10px" />
          <Skeleton h="40px" w="150px" rounded="10px" />
        </Flex>

        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((x, i) => (
          <Skeleton boxSize="100%" rounded="20px" key={`skeleton-item-${i}`} />
        ))}
      </Flex>
    </Flex>
  );
};

export default Portada;

const HeaderPortada = ({ user, curso, onContinueLeccion }: { user?: IUser | null; curso?: ICurso; onContinueLeccion: any }) => {
  const { favoritos, addFavorito, removeFavorito } = useContext(FavoritosContext);

  const [cursoFavorito, setCursoFavorito] = useState<IFavorito>();

  useEffect(() => {
    if (favoritos?.length > 0 && curso?.id)
      setCursoFavorito(favoritos?.find((f) => f.tipo === FavoritoTipoEnum.CURSO && f.objetoId === curso?.id));
  }, [favoritos, curso?.id]);

  return (
    <Flex direction="column" gap="28px" w="100%">
      <Flex w="100%" gap="20px" justify="space-between" direction={{ base: 'column', md: 'row' }}>
        {/* INFO CURSO */}
        <Flex gap="28px" w="100%" align="center">
          <Image
            rounded="20px"
            boxSize="75px"
            border="1px solid var(--chakra-colors-gray_3)"
            src={`data:image/svg+xml;utf8,${curso?.icono}`}
            bg={curso?.icono ? 'white' : stc(curso?.titulo || 'Lorem Ipsum')}
          />

          <Flex direction="column" fontWeight="bold">
            <Box data-cy="landing_titulo" fontWeight="bold" textOverflow="ellipsis" fontSize={{ base: '20px', sm: '24px' }}>
              {curso?.titulo}
            </Box>

            <Flex w="100%" gap="12px" wrap="wrap" fontSize="14px" fontWeight="normal">
              <Flex align="center" color="gray_5" w="fit-content" gap={{ base: '4px', sm: '8px' }}>
                <Icon boxSize="15px" as={BiBarChart} color="gray_6" />
                {(curso?.nivel || '').charAt(0).toUpperCase() + curso?.nivel?.slice(1)}
              </Flex>

              <Flex align="center" color="gray_5" w="fit-content" gap={{ base: '4px', sm: '8px' }}>
                <Icon boxSize="15px" as={BiListOl} color="gray_6" />
                {curso?.modulos?.length} módulos
              </Flex>

              <Flex align="center" color="gray_5" w="fit-content" gap={{ base: '4px', sm: '8px' }}>
                <Icon boxSize="15px" as={BiTimeFive} color="gray_6" />
                {fmtMnts(curso?.meta?.duracionTotal)}
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        {/* FAV & EMPEZAR/CONTINUAR */}
        <Flex gap="14px">
          {curso && !curso?.publicado && (
            <Flex align="center" gap="5px">
              <Icon as={FaRegEyeSlash} boxSize="20px" color="cancel" />

              <Box fontSize="14px" whiteSpace="nowrap" color="cancel" lineHeight="16px" fontWeight="semibold">
                No publicado
              </Box>
            </Flex>
          )}

          <IconButton
            data-cy="cursos_landing_favorito"
            aria-label="Añadir a favorito"
            border="none"
            rounded="10px"
            isActive={!!cursoFavorito}
            bg="gray_3"
            _hover={{ bg: 'gray_2' }}
            _active={{
              color: 'primary',
              bg: 'primary_light',
            }}
            onClick={
              cursoFavorito
                ? () => removeFavorito(cursoFavorito)
                : () => {
                    if (curso?.id && user?.id)
                      addFavorito({
                        objetoId: curso?.id,
                        tipo: FavoritoTipoEnum.CURSO,
                        userId: user?.id,
                        objeto: curso,
                      });
                  }
            }
            icon={
              <Icon
                boxSize="20px"
                as={cursoFavorito ? AiFillStar : BiStar}
                color={cursoFavorito ? 'primary_neon' : undefined}
              />
            }
          />

          <Button
            bg="black"
            color="white"
            w="fit-content"
            fontWeight="bold"
            data-cy="cursos_landing_continuar-header"
            onClick={onContinueLeccion}
            mb={{ base: '20px', sm: 'auto' }}
            rightIcon={<Icon boxSize="20px" as={BiPlay} />}
            _hover={{ bg: 'var(--chakra-colors-primary_dark)' }}
            isDisabled={
              !curso?.modulos || (curso?.modulos?.length || 0) === 0 || (curso?.modulos[0].lecciones?.length || 0) === 0
            }
          >
            {(curso?.meta?.progreso_count || 0) > 0 ? 'Continuar curso' : 'Empezar curso'}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

import { Box, Flex, Icon, Text } from '@chakra-ui/react';

import { ICurso, IModulo, ILeccion, LeccionTipoEnum } from 'data';
import { BiCaretRight, BiCheck, BiLockAlt } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

export const TabEjercicios = ({ curso }: { curso?: ICurso }) => {
  return (
    <Flex direction="column" gap="20px" w="100%">
      <Text variant="h1_heading">Ejercicios del curso</Text>

      <Flex direction="column">
        {' '}
        {(curso?.modulos?.length || 0) > 0 ? (
          curso?.modulos?.map((modulo: IModulo, index: number) => {
            return <EjercicioItem key={'curso-modulo-' + index} modulo={modulo} curso={curso} />;
          })
        ) : (
          <Box color="gray_4" fontWeight="bold" fontSize="16px" lineHeight="100%" p="15px 30px">
            No hay ejercicios disponibles
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

const EjercicioItem = ({ modulo, curso }: { modulo?: IModulo; curso?: ICurso }) => {
  const navigate = useNavigate();

  return (
    <Flex direction="column" transition="all ease-in-out 0.5s">
      {modulo?.lecciones &&
        modulo.lecciones
          ?.filter((l: ILeccion) => l.tipo === LeccionTipoEnum.ENTREGABLE || l.tipo === LeccionTipoEnum.AUTOCORREGIBLE)
          .map((leccion: ILeccion, index: number) => (
            <Flex
              w="100%"
              p="15px 25px"
              align="center"
              gridColumnGap="16px"
              key={'leccion-' + leccion.id + '-item-' + index}
              color="black"
              borderBottom="1px solid"
              borderBottomColor="gray_3"
              cursor={modulo.meta?.isBlocked ? 'not-allowed' : 'pointer'}
              title={modulo.meta?.isBlocked ? 'Lección bloqueada' : leccion.titulo}
              onClick={!modulo.meta?.isBlocked ? () => navigate(`/cursos/${curso?.id}/leccion/${leccion?.id}`) : undefined}
              _hover={
                !modulo.meta?.isBlocked
                  ? {
                      bg: 'white',
                      backgroundColor: 'primary_light',
                    }
                  : undefined
              }
            >
              <Flex w="100%" justify="space-between" align="center">
                <Box fontSize="14px" fontWeight="normal">
                  {leccion.titulo}
                </Box>
              </Flex>

              {modulo.meta?.isBlocked ? (
                <Icon as={BiLockAlt} type="solid" color="gray_3" boxSize="24px" />
              ) : (
                <Icon
                  minW="24px"
                  minH="24px"
                  as={leccion.meta?.isCompleted ? BiCheck : BiCaretRight}
                  color={leccion.meta?.isCompleted ? 'primary' : 'gray_4'}
                />
              )}
            </Flex>
          ))}
    </Flex>
  );
};

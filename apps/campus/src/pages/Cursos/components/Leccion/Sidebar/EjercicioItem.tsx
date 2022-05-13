import { useState, useEffect } from 'react';

import { Flex, Icon, Box } from '@chakra-ui/react';
import { BiLockAlt, BiCheck, BiCaretRight } from 'react-icons/bi';

import { IModulo, ILeccion, LeccionTipoEnum } from 'data';

const EjercicioItem = ({
  modulo,
  isOpened,
  leccionId,
  onLeccionSelect,
  onLeccionCompleted,
}: {
  modulo?: IModulo;
  isOpened: boolean;
  leccionId?: number;
  onLeccionSelect: (leccion: ILeccion) => void;
  onLeccionCompleted: (leccion: ILeccion) => void;
}) => {
  const [open, setOpen] = useState<boolean>(isOpened);

  useEffect(() => {
    setOpen(isOpened);
  }, [isOpened]);

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
              borderLeft="4px solid"
              bg={leccion.id === leccionId ? 'primary_light' : undefined}
              borderLeftColor={leccion.id === leccionId ? 'primary' : 'gray_2'}
              borderBottom="1px solid"
              borderBottomColor="gray_3"
              cursor={modulo.meta?.isBlocked ? 'not-allowed' : 'pointer'}
              title={modulo.meta?.isBlocked ? 'Lección bloqueada' : leccion.titulo}
              onClick={!modulo.meta?.isBlocked ? () => onLeccionSelect(leccion) : undefined}
              _hover={
                !modulo.meta?.isBlocked
                  ? {
                      bg: 'white',
                      backgroundColor: 'primary_light',
                      borderLeft: '4px solid',
                      borderLeftColor: 'primary',
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
                  color={leccion.meta?.isCompleted ? 'primary' : leccion.id === leccionId ? 'primary' : 'gray_4'}
                  onClick={leccion.meta?.isCompleted ? undefined : () => onLeccionCompleted(leccion)}
                />
              )}
            </Flex>
          ))}
    </Flex>
  );
};

export default EjercicioItem;

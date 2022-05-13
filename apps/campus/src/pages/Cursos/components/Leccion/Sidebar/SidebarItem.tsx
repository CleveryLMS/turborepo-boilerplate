import { useState, useEffect, useContext } from 'react';

import { FaBookmark } from 'react-icons/fa';
import { Flex, Icon, Box, Collapse, Text } from '@chakra-ui/react';
import { BiLockAlt, BiCheck, BiChevronDown, BiChevronUp, BiCaretRight, BiBookmarks } from 'react-icons/bi';

import { FavoritosContext } from '../../../../../shared/context';
import { IModulo, ILeccion, FavoritoTipoEnum } from 'data';

const SidebarItem = ({
  modulo,
  leccionId,
  isCompleted,
  isOpened,

  onLeccionSelect,
  onLeccionCompleted,
}: {
  modulo?: IModulo;
  leccionId?: number;
  isOpened: boolean;
  isCompleted: boolean;
  onLeccionSelect: (leccion: ILeccion) => void;
  onLeccionCompleted: (leccion: ILeccion) => void;
}) => {
  const [open, setOpen] = useState<boolean>(isOpened);

  const { favoritos } = useContext(FavoritosContext);

  useEffect(() => {
    setOpen(isOpened);
  }, [isOpened]);

  return (
    <Flex
      direction="column"
      transition="all ease-in-out 0.5s"
      borderBottom="1px solid var(--chakra-colors-gray_3)"
      _hover={{ bg: 'gray_2' }}
    >
      <Flex align="center" cursor="pointer" gridColumnGap="16px" p="15px 30px" onClick={() => setOpen(!open)}>
        <Flex direction="column" w="100%" overflow="hidden">
          <Flex justify="space-between" w="100%">
            <Text w="100%" variant="sidebar_title" isTruncated title={modulo?.orden + '.' + modulo?.titulo}>
              {modulo?.orden}.{modulo?.titulo}
            </Text>
          </Flex>

          {!open && (
            <Flex fontSize="13px">
              <Flex color="gray_5" mr="18px">
                {modulo?.lecciones?.filter((l: ILeccion) => l?.meta?.isCompleted).length || 0}/{modulo?.lecciones?.length || 0}
                <Box ml="4px">lecciones</Box>
              </Flex>

              {modulo &&
                (modulo?.lecciones?.filter((l: ILeccion) =>
                  favoritos?.find((f) => f.tipo === FavoritoTipoEnum.LECCION && f.objetoId === l.id)
                ).length || 0) > 0 && (
                  <Flex align="center" color="primary">
                    <Icon as={BiBookmarks} type="solid" boxSize="14px" />

                    {
                      modulo?.lecciones?.filter((l: ILeccion) =>
                        favoritos.find((f) => f.tipo === FavoritoTipoEnum.LECCION && f.objetoId === l.id)
                      ).length
                    }
                  </Flex>
                )}
            </Flex>
          )}
        </Flex>

        <Flex w="fit-content" justify="flex-end">
          {modulo?.meta?.isBlocked && <Icon as={BiLockAlt} type="solid" color="gray_5" boxSize="20px" mr="25px" />}

          {isCompleted && !open && <Icon as={BiCheck} color="primary" boxSize="20px" mr="25px" />}

          <Icon as={open ? BiChevronUp : BiChevronDown} boxSize="20px" color="gray_4" />
        </Flex>
      </Flex>

      <Collapse in={open} animateOpacity unmountOnExit>
        <Flex direction="column" w="100%" bg="gray_2" overflow="hidden">
          {modulo?.lecciones?.map((leccion: ILeccion, index: number) => (
            <Flex
              w="100%"
              p="10px 25px"
              align="center"
              gridColumnGap="16px"
              key={'leccion-' + leccion.id + '-item-' + index}
              color="black"
              bg={leccion.id === leccionId ? 'primary_light' : undefined}
              borderLeft={
                leccion.id === leccionId ? '4px solid var(--chakra-colors-primary)' : '4px solid var(--chakra-colors-gray_2)'
              }
              cursor={modulo.meta?.isBlocked ? 'not-allowed' : 'pointer'}
              title={modulo.meta?.isBlocked ? 'Lección bloqueada' : leccion.titulo}
              onClick={!modulo.meta?.isBlocked ? () => onLeccionSelect(leccion) : undefined}
              _hover={
                !modulo.meta?.isBlocked
                  ? {
                      bg: 'white',
                      backgroundColor: 'primary_light',
                      borderLeft: '4px solid var(--chakra-colors-primary)',
                    }
                  : undefined
              }
            >
              <Flex w="100%" justify="space-between" align="center">
                <Flex align="center" gap="12px">
                  {favoritos.find((f) => f.tipo === FavoritoTipoEnum.LECCION && f.objetoId === leccion.id) && (
                    <Icon boxSize="12px" cursor="pointer" color="primary" as={FaBookmark} />
                  )}

                  <Text variant="sidebar_text" color={leccion.meta?.isCompleted ? 'gray_5' : 'black'}>
                    {leccion.titulo}
                  </Text>
                </Flex>
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
      </Collapse>
    </Flex>
  );
};

export default SidebarItem;

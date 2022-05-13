import { useState, useContext, useEffect } from 'react';

import { es } from 'date-fns/locale';

import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { format, formatDistance, isToday } from 'date-fns';
import { BiBell, BiTimeFive, BiVideo } from 'react-icons/bi';
import { Text, Flex, Box, Icon, Button, Tooltip, useDisclosure } from '@chakra-ui/react';

import { fmtMnts, isRoleAllowed } from 'utils';
import { ModalDnd } from '../../../../shared/components';
import ZoomBg from '../../../../assets/cursos/leccion_zoom_bg.png';
import { FavoritosContext, LoginContext } from '../../../../shared/context';
import { ILeccion, ICurso, FavoritoTipoEnum, IFavorito, UserRolEnum } from 'data';
import { AsistenciaModal } from '../../components/Leccion/AsistenciaModal/AsistenciaModal';
import { OpenParser } from 'ui';

export const ZoomLeccion = ({
  curso,
  leccion,
  onLeccionCompleted,
}: {
  curso?: ICurso;
  leccion?: ILeccion;
  onLeccionCompleted: (e?: any) => void;
}) => {
  const [leccionFavorito, setLeccionFavorito] = useState<IFavorito>();

  const { user } = useContext(LoginContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { favoritos, addFavorito, removeFavorito } = useContext(FavoritosContext);

  useEffect(() => {
    if (favoritos?.length > 0 && leccion?.id)
      setLeccionFavorito(favoritos?.find((f) => f.tipo === FavoritoTipoEnum.LECCION && f.objetoId === leccion?.id));
  }, [addFavorito, removeFavorito]);

  const isLeccionToday = (fecha?: string) => {
    if (!fecha) return false;

    return isToday(new Date(fecha));
  };

  return (
    <Flex direction="column" boxSize="100%" gap="40px">
      <Flex direction="column" gap="10px">
        <Flex align="center" justify="space-between" gap="40px">
          <Text variant="h1_heading" data-cy="cursos_leccion_titulo">
            {leccion?.titulo}
          </Text>

          <Tooltip shouldWrapChildren label={leccionFavorito ? 'Borrar marcador' : 'Guardar marcador'}>
            <Icon
              boxSize="28px"
              cursor="pointer"
              color={leccionFavorito ? 'primary' : 'gray_5'}
              as={leccionFavorito ? FaBookmark : FaRegBookmark}
              onClick={
                leccionFavorito
                  ? () => {
                      removeFavorito(leccionFavorito);
                      setLeccionFavorito(undefined);
                    }
                  : () => {
                      if (leccion?.id && user?.id)
                        addFavorito({
                          objetoId: leccion?.id,
                          tipo: FavoritoTipoEnum.LECCION,
                          userId: user?.id,
                          objeto: leccion,
                        });
                    }
              }
            />
          </Tooltip>
        </Flex>

        <Flex align="center" gap="14px">
          <Flex align="center" gap="10px">
            <Icon as={BiVideo} color="gray_4" />

            <Box fontSize="15px" fontWeight="semibold" color="gray_5">
              Evento
            </Box>
          </Flex>

          <Box w="1px" h="100%" bg="gray_3" />

          <Flex align="center" gap="10px">
            <Icon as={BiTimeFive} color="gray_4" />

            <Box fontSize="15px" fontWeight="semibold" color="gray_5">
              {fmtMnts(leccion?.duracion)} aproximadamente
            </Box>
          </Flex>
        </Flex>
      </Flex>

      <Box h="1px" bg="gray_3" />

      <Flex
        bgImage={ZoomBg}
        rounded="14px"
        border="1px solid"
        borderColor={isLeccionToday(leccion?.fechaPublicacion) ? 'primary' : 'gray_3'}
      >
        <Flex mt="100px" gap="40px" w="100%" bg="white" p="40px" roundedBottom="14px">
          <Flex w="100%" direction="column" gap="30px">
            <Flex direction="column" gap="10px">
              {isLeccionToday(leccion?.fechaPublicacion) ? (
                <Box color="primary" fontSize="14px" fontWeight="semibold">
                  En Directo
                </Box>
              ) : (
                <Box fontSize="14px" fontWeight="semibold" lineHeight="17px" textTransform="uppercase">
                  {curso?.titulo}
                </Box>
              )}

              <Text variant="h1_heading">{leccion?.titulo}</Text>
            </Flex>

            {leccion?.descripcion ? (
              <Box fontSize="15px" lineHeight="22px">
                <OpenParser value={leccion?.descripcion} />
              </Box>
            ) : (
              <Box color="gray_4" fontSize="16px" fontWeight="bold" lineHeight="100%">
                No hay descripción disponible
              </Box>
            )}
            {isRoleAllowed([UserRolEnum.ADMIN, UserRolEnum.PROFESOR], user?.rol) && (
              <Button onClick={onOpen} w="fit-content" variant="outline">
                Abrir listado asistencia
              </Button>
            )}
          </Flex>

          <Flex w="100%" direction="column" align="end" gap="30px">
            <Flex direction="column" gap="10px" align="end">
              <Box fontSize="21px" fontWeight="bold" lineHeight="20px" textTransform="uppercase">
                {leccion?.fechaPublicacion
                  ? format(new Date(leccion?.fechaPublicacion), "dd 'de' LLLL 'de' yyyy", { locale: es })
                  : '-'}
              </Box>

              <Box fontSize="18px" fontWeight="bold" lineHeight="22px">
                {leccion?.fechaPublicacion
                  ? format(new Date(leccion?.fechaPublicacion), 'HH:mm', {
                      locale: es,
                    })
                  : '-'}
              </Box>
            </Flex>

            <Flex align="center" gap="15px">
              {/* <Button
                isDisabled
                leftIcon={<BiBell />}
                fontSize="16px"
                fontWeight="bold"
                lineHeight="22px"
              >
                Activar aviso
              </Button> */}

              <Box
                as="a"
                bg="primary"
                rounded="10px"
                p="10px 16px"
                color="white"
                fontSize="16px"
                fontWeight="bold"
                lineHeight="22px"
                target="_blank"
                href={isLeccionToday(leccion?.fechaPublicacion) ? leccion?.contenido : ''}
                cursor={isLeccionToday(leccion?.fechaPublicacion) ? 'pointer' : 'default'}
                pointerEvents={isLeccionToday(leccion?.fechaPublicacion) ? undefined : 'none'}
                onClick={isLeccionToday(leccion?.fechaPublicacion) ? () => onLeccionCompleted(leccion) : undefined}
              >
                {isLeccionToday(leccion?.fechaPublicacion)
                  ? 'Unirse a Sesión en Directo'
                  : leccion?.fechaPublicacion
                  ? `Empieza en ${formatDistance(new Date(), new Date(leccion?.fechaPublicacion), { locale: es })}`
                  : 'Empieza en -'}
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <ModalDnd isOpen={isOpen} titulo={'Asistencia'} onClose={onClose}>
        <AsistenciaModal leccion={leccion} isOpen={isOpen} onClose={onClose} />
      </ModalDnd>
    </Flex>
  );
};

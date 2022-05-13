import React, { useContext } from 'react';

import { BiBookOpen, BiTimeFive } from 'react-icons/bi';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { Flex, Text, Tooltip, Icon, Box, Badge } from '@chakra-ui/react';

import { ILeccion, IEntregable, LeccionTipoEnum, FavoritoTipoEnum, EntregableEstadoEnum } from 'data';
import { fmtHours, fmtMnts } from 'utils';
import { LoginContext } from '../../../../../../shared/context';

interface HeaderEntregableProps {
  leccion: ILeccion;
  entregable?: IEntregable;
  leccionFavorito: any;
  removeFavorito: any;
  addFavorito: any;
  estado: EntregableEstadoEnum;
}

const HeaderEntregable = ({ leccion, leccionFavorito, removeFavorito, addFavorito, estado }: HeaderEntregableProps) => {
  const { user } = useContext(LoginContext);

  return (
    <>
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
                  ? () => removeFavorito(leccionFavorito)
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
            <Icon as={BiBookOpen} color="gray_4" />

            <Box fontSize="15px" fontWeight="semibold" color="gray_5">
              Entregable
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

      <Flex gap="20px" direction="column">
        <Box bg="gray_3" h="1px" />

        <Flex
          gap={{ base: '30px', sm: '50px' }}
          align={{ base: 'start', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
        >
          <Box fontSize="16px" lineHeight="19px">
            Duración aproximada: <strong>{fmtMnts(leccion?.duracion)}</strong>
          </Box>

          <Box fontSize="16px" lineHeight="19px">
            Tiempo disponible: <strong>{fmtHours(leccion?.tiempoDisponible)}</strong>
          </Box>

          <Box fontSize="16px" lineHeight="19px">
            Estado:
            <Badge
              ml="10px"
              p="4px 15px"
              rounded="8px"
              fontSize="15px"
              fontWeight="semibold"
              color={
                estado === EntregableEstadoEnum.ERROR
                  ? '#DB4444'
                  : estado === EntregableEstadoEnum.CORRECTO
                  ? '#06a580'
                  : '#CA8824'
              }
              bg={
                estado === EntregableEstadoEnum.ERROR
                  ? 'rgba(219, 68, 68, 0.15)'
                  : estado === EntregableEstadoEnum.CORRECTO
                  ? 'rgba(38, 200, 171, 0.15)'
                  : 'rgba(202, 136, 36, 0.15)'
              }
            >
              {estado === EntregableEstadoEnum.PENDIENTE_CORRECCION
                ? LeccionTipoEnum.AUTOCORREGIBLE
                  ? 'ENTREGADO'
                  : (estado || EntregableEstadoEnum.PENDIENTE_ENTREGA).replaceAll('_', ' ')
                : (estado || EntregableEstadoEnum.PENDIENTE_ENTREGA).replaceAll('_', ' ')}
            </Badge>
          </Box>
        </Flex>

        <Box bg="gray_3" h="1px" />
      </Flex>
    </>
  );
};

export { HeaderEntregable };

import { useState, useContext, useEffect } from 'react';

import { BiSlideshow, BiTimeFive } from 'react-icons/bi';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { Text, Flex, Box, Icon, Tooltip } from '@chakra-ui/react';

import { fmtMnts } from 'utils';
import { FavoritoTipoEnum, IFavorito, ILeccion } from 'data';
import { FavoritosContext, LoginContext } from '../../../../shared/context';

export const SlidesLeccion = ({ leccion }: { leccion: ILeccion }) => {
  const [leccionFavorito, setLeccionFavorito] = useState<IFavorito>();

  const { user } = useContext(LoginContext);
  const { favoritos, addFavorito, removeFavorito } = useContext(FavoritosContext);

  useEffect(() => {
    if (favoritos?.length > 0 && leccion?.id)
      setLeccionFavorito(favoritos?.find((f) => f.tipo === FavoritoTipoEnum.LECCION && f.objetoId === leccion?.id));
  }, [addFavorito, removeFavorito]);

  return (
    <Flex direction="column" boxSize="100%" gap="40px">
      <Flex direction="column" gap="10px">
        <Flex align="center" justify="space-between" gap="40px">
          <Text variant="h1_heading">{leccion?.titulo}</Text>

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
            <Icon as={BiSlideshow} color="gray_4" />

            <Box fontSize="15px" fontWeight="semibold" color="gray_5">
              Diapositiva
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

      <Box fontSize="15px" whiteSpace="pre-line">
        <iframe src={leccion?.contenido} width="100%" height="500" scrolling="no" frameBorder="0" allowFullScreen />
      </Box>
    </Flex>
  );
};

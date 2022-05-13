import { useState, useContext, useEffect } from 'react';

import { BiFolder } from 'react-icons/bi';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { Text, Flex, Box, Icon, Tooltip, Link } from '@chakra-ui/react';

import { FavoritoTipoEnum, IFavorito, ILeccion } from 'data';
import { FavoritosContext, LoginContext } from '../../../../shared/context';

export const RecursoLeccion = ({ leccion }: { leccion: ILeccion }) => {
  const { user } = useContext(LoginContext);
  const { favoritos, addFavorito, removeFavorito } = useContext(FavoritosContext);

  const [leccionFavorito, setLeccionFavorito] = useState<IFavorito>();

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
            <Icon as={BiFolder} color="gray_4" />

            <Box fontSize="15px" fontWeight="semibold" color="gray_5">
              Recurso
            </Box>
          </Flex>
        </Flex>
      </Flex>

      <Box fontSize="15px" whiteSpace="pre-line">
        <Link target="_blank" rel="noreferrer" href={leccion?.contenido}>
          {leccion?.contenido}
        </Link>
      </Box>
    </Flex>
  );
};

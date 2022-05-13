import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { es } from 'date-fns/locale';
import { BiStar } from 'react-icons/bi';
import { formatDistance } from 'date-fns';
import { AiFillGithub, AiFillStar } from 'react-icons/ai';
import { Image, Flex, Box, Button, Icon } from '@chakra-ui/react';

import { useProyecto } from 'data';
import { OpenParser } from 'ui';
import { TextLoader } from '../../../shared/components';
import { FavoritoTipoEnum, IHabilidad } from 'data';
import { FavoritosContext, LoginContext } from '../../../shared/context';

const ProyectosCover = () => {
  const { proyectoID } = useParams<any>();
  const { user } = useContext(LoginContext);
  const { favoritos, addFavorito, removeFavorito } = useContext(FavoritosContext);

  const { proyecto, isLoading } = useProyecto({ id: +(proyectoID || 0) });

  const [proyectoFav, setProyectoFav] = useState(
    favoritos?.find((f) => f.tipo === FavoritoTipoEnum.PROYECTO && f.objetoId === proyecto.id)
  );

  useEffect(() => {
    setProyectoFav(favoritos?.find((f) => f.tipo === FavoritoTipoEnum.PROYECTO && f.objetoId === proyecto.id));
  }, [favoritos]);

  return (
    <Flex w="100%" direction="column" p="34px">
      <Flex direction="column" bg="white" rounded="15px">
        <Flex p="34px" justify="space-between">
          <Flex gridColumnGap="20px" align="center">
            {proyecto?.user?.avatar?.url ? (
              <Image
                fit="cover"
                alt={proyecto?.user?.username}
                src={proyecto?.user?.avatar?.url}
                w="55px"
                h="55px"
                rounded="50%"
              />
            ) : (
              <Flex
                bg="primary"
                color="white"
                w="25px"
                h="25px"
                align="center"
                justify="center"
                rounded="50%"
                textTransform="uppercase"
              >
                {proyecto?.user?.username?.substring(0, 2)}
              </Flex>
            )}

            <Flex direction="column" gridRowGap="5px">
              <Box fontSize="21px" lineHeight="25px" fontWeight="bold">
                {proyecto?.titulo}
              </Box>

              <Box fontSize="15px" lineHeight="18px" fontWeight="medium">
                {proyecto?.user?.username}
              </Box>
            </Flex>

            <Flex align="center" gridColumnGap="15px">
              {proyecto?.enlaceDemo && (
                <Flex as="a" target="_blank" href={proyecto?.enlaceDemo} whiteSpace="nowrap" className="card-proyecto--button">
                  Ver demo
                </Flex>
              )}

              {proyecto?.enlaceGithub && (
                <Flex as="a" w="100%" className="card-proyecto--button" whiteSpace="nowrap" href={proyecto?.enlaceGithub}>
                  <Icon as={AiFillGithub} mr="10px" boxSize="18px" />
                  Ir a GitHub
                </Flex>
              )}
            </Flex>
          </Flex>

          <Button
            bg="white"
            h="42px"
            p="10px"
            minW="fit-content"
            whiteSpace="nowrap"
            leftIcon={
              proyectoFav ? (
                <Icon as={AiFillStar} w="21px" h="21px" color="#EFC55B" />
              ) : (
                <Icon as={BiStar} w="21px" h="21px" color="#EFC55B" />
              )
            }
            border="2px solid"
            borderColor="gray_5"
            rounded="12px"
            onClick={() => {
              if (proyectoFav) removeFavorito(proyectoFav);
              else if (user?.id)
                addFavorito({
                  tipo: FavoritoTipoEnum.PROYECTO,
                  objetoId: proyecto.id,
                  objeto: proyecto,
                  userId: user?.id,
                });
            }}
          >
            {proyectoFav ? 'Quitar favorito' : 'Añadir favorito'}
          </Button>
        </Flex>

        <Flex h="100%" p="0px 34px 51px" gap="40px" direction={{ base: 'column', xl: 'row' }}>
          <Flex w="100%" maxH="auto">
            <Image
              w="100%"
              rounded="15px"
              objectFit="contain"
              objectPosition="top"
              border="2px solid"
              borderColor="gray_3"
              src={`https://api.microlink.io/?url=${proyecto?.enlaceDemo}&screenshot&embed=screenshot.url&apiKey=${process.env.NX_MICROLINK_APIKEY}`}
            />
          </Flex>

          <Flex direction="column" minW={{ base: '100%', xl: '40%' }} gap="50px">
            <Flex w="100%" direction="column">
              <Box fontWeight="bold" lineHeight="21px" fontSize="18px" mb="20px">
                Descripción
              </Box>

              <Box fontSize="15px" lineHeight="24px">
                <OpenParser value={proyecto?.contenido || ''} />
              </Box>
            </Flex>

            <Box bg="gray_3" h="1px" />

            <Flex w="100%" direction="column">
              <Box fontWeight="bold" lineHeight="21px" fontSize="18px" mb="20px">
                Habilidades relacionadas
              </Box>

              {isLoading ? (
                <TextLoader lines={5} />
              ) : (
                <Flex mb="21px" gap="10px" fontSize="13px" fontWeight="bold" align="center" wrap="wrap">
                  {proyecto?.habilidades?.map((habilidad: IHabilidad, index: number) => (
                    <Flex
                      key={'habilidad-' + index}
                      minW="fit-content"
                      textAlign="center"
                      rounded="16px"
                      bg="#DDE6FC"
                      p="6px 10px"
                      color="#294FB2"
                    >
                      {habilidad.nombre}
                    </Flex>
                  ))}
                </Flex>
              )}
            </Flex>

            <Box bg="gray_3" h="1px" />

            <Flex align="center" gridColumnGap="15px" lineHeight="15px" fontSize="13px" color="gray_3">
              <Flex align="center" gridColumnGap="5px">
                <Icon as={AiFillStar} color="#EFC55B" boxSize="18px" />

                <Box fontWeight="semibold">{proyecto?.meta?.totalFavoritos || 0}</Box>
              </Flex>

              {proyecto?.createdAt && (
                <Box fontWeight="medium">
                  Hace{' '}
                  {formatDistance(new Date(proyecto?.createdAt), new Date(), {
                    locale: es,
                  })}
                </Box>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProyectosCover;

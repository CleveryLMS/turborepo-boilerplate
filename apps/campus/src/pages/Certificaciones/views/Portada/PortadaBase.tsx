import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AiFillStar } from 'react-icons/ai';
import { useMediaQuery } from '@chakra-ui/react';
import { Flex, Box, Icon, Button, Skeleton } from '@chakra-ui/react';
import { BiCheckboxChecked, BiRightArrowAlt, BiStar } from 'react-icons/bi';

import { IExamen, ICertificacion, IFavorito, FavoritoTipoEnum, addCertificacion } from 'data';
import { FavoritosContext, LoginContext, LayoutContext } from '../../../../shared/context';
import { fmtMnts } from 'utils';
import { Avatar } from '../../../../shared/components';
import { OpenParser } from 'ui';

export const PortadaBase = ({ examen, certificacion }: { examen?: IExamen; certificacion?: ICertificacion }) => {
  const navigate = useNavigate();

  const { user } = useContext(LoginContext);
  const { isMobile } = useContext(LayoutContext);
  const { favoritos, addFavorito, removeFavorito } = useContext(FavoritosContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [certiFavorita, setCertiFavorita] = useState<IFavorito>();
  const [intentosRestantes, setIntentosRestantes] = useState<number>(0);

  const [smallDevice] = useMediaQuery('(max-height: 600px)');

  useEffect(() => {
    certificacion && setIsLoading(true);
  }, [certificacion]);

  useEffect(() => {
    setIntentosRestantes(
      (examen?.numIntentos || 0) -
        (user?.certificaciones?.find((c: any) => c.id === examen?.certificacionId)?.meta?.pivot_intento || 0)
    );
  }, [certificacion, examen]);

  useEffect(() => {
    if (favoritos?.length > 0 && certificacion?.id)
      setCertiFavorita(favoritos?.find((f) => f.tipo === FavoritoTipoEnum.CERTIFICACION && f.objetoId === certificacion?.id));
  }, [addFavorito, removeFavorito]);

  return isLoading ? (
    <Flex
      w="100%"
      align="center"
      justify="center"
      direction="column"
      gap={isMobile ? '20px' : '60px'}
      p={{ base: '70px 10px 20px', sm: '0px' }}
    >
      <Flex direction="column" gap="45px" align="center" mt={smallDevice ? '100px' : '0px'}>
        <Avatar src={examen?.imagen?.url} size="125px" name="" rounded="20px" />

        <Flex direction="column" align="center" gap="18px">
          <Box
            fontSize="24px"
            lineHeight="29px"
            fontWeight="bold"
            textAlign={isMobile && 'center'}
            data-cy="titulo_certi_portada_base"
          >
            Certificación - {certificacion?.nombre}
          </Box>

          <Box
            fontSize="15px"
            lineHeight="22px"
            pl={{ base: '5px', sm: '0px' }}
            pr={{ base: '5px', sm: '0px' }}
            textAlign={isMobile && 'center'}
          >
            <OpenParser value={certificacion?.descripcion || ''} />
          </Box>
        </Flex>
      </Flex>

      <Flex align="center" gap={isMobile ? '15px' : '32px'} direction={isMobile && 'column'}>
        <Flex
          w="100%"
          p="18px"
          bg="white"
          align="center"
          rounded="20px"
          gridColumnGap="20px"
          border="1px solid var(--chakra-colors-gray_3)"
          data-cy="num_preguntas_container"
        >
          <Flex p="10px" boxSize="44px" rounded="10px" align="center" justify="center" bg="primary_light">
            <Icon as={BiCheckboxChecked} boxSize="24px" color="primary_dark" />
          </Flex>

          <Flex direction="column" gridRowGap="6px">
            <Box w="100%" color="gray_4" fontSize="14px" lineHeight="100%" fontWeight="medium" whiteSpace="nowrap">
              Número de preguntas
            </Box>

            <Box lineHeight="100%" fontWeight="bold" fontSize="19px" data-cy="num_preguntas_portada_base">
              {examen?.numPreguntas || 0}
            </Box>
          </Flex>
        </Flex>

        <Flex
          w="100%"
          p="18px"
          bg="white"
          align="center"
          rounded="20px"
          gridColumnGap="20px"
          border="1px solid var(--chakra-colors-gray_3)"
          data-cy="tiempo_total_container"
        >
          <Flex p="10px" boxSize="44px" rounded="10px" bg="primary_light" align="center" justify="center">
            <Icon as={BiCheckboxChecked} boxSize="24px" color="primary_dark" />
          </Flex>

          <Flex direction="column" gridRowGap="6px">
            <Box w="100%" lineHeight="100%" fontWeight="medium" fontSize="14px" color="gray_4" whiteSpace="nowrap">
              Tiempo total
            </Box>

            <Box lineHeight="100%" fontWeight="bold" fontSize="19px" data-cy="tiempo_total_portada_base">
              {fmtMnts(examen?.duracion || 0)}
            </Box>
          </Flex>
        </Flex>

        <Flex
          w="100%"
          p="18px"
          bg="white"
          align="center"
          rounded="20px"
          gridColumnGap="20px"
          border="1px solid var(--chakra-colors-gray_3)"
          data-cy="intentos_restantes_container"
        >
          <Flex p="10px" boxSize="44px" rounded="10px" align="center" justify="center" bg="primary_light">
            <Icon as={BiCheckboxChecked} boxSize="24px" color="primary_dark" />
          </Flex>

          <Flex direction="column" gridRowGap="6px">
            <Box w="100%" lineHeight="100%" fontWeight="medium" fontSize="14px" color="gray_4" whiteSpace="nowrap">
              Intentos restantes
            </Box>

            <Box lineHeight="100%" fontWeight="bold" fontSize="19px" data-cy="intentos_restantes_portada_base">
              {Math.max(intentosRestantes, 0)} / {examen?.numIntentos}
            </Box>
          </Flex>
        </Flex>
      </Flex>

      <Flex align="center" p={isMobile && '5'} direction={isMobile && 'column'} gap={isMobile ? '10px' : '15px'}>
        <Button
          h="42px"
          w="100%"
          border="none"
          data-cy="fav_button_portada_base"
          rounded="10px"
          color={certiFavorita ? 'primary' : undefined}
          bg={certiFavorita ? 'primary_light' : 'gray_3'}
          onClick={
            certiFavorita
              ? () => {
                  removeFavorito(certiFavorita);
                  setCertiFavorita(undefined);
                }
              : () => {
                  if (certificacion?.id && user?.id)
                    addFavorito({
                      userId: user?.id,
                      objeto: certificacion,
                      objetoId: certificacion?.id,
                      tipo: FavoritoTipoEnum.CERTIFICACION,
                    });
                }
          }
          _hover={{ bg: 'gray_2' }}
          leftIcon={
            <Icon boxSize="21px" as={certiFavorita ? AiFillStar : BiStar} color={certiFavorita ? 'primary' : undefined} />
          }
        >
          <Box lineHeight="18px">{certiFavorita ? 'Favorito' : 'Añadir favorito'}</Box>
        </Button>

        <Button
          bg="black"
          color="white"
          w="100%"
          px="20px"
          data-cy="empezar_button_portada_base"
          rightIcon={<Icon as={BiRightArrowAlt} boxSize="24px" pr="5px" />}
          isDisabled={certificacion?.meta?.isCompleted || intentosRestantes <= 0}
          onClick={() => navigate(`/certificaciones/${certificacion?.id}/examen/${examen?.id}`)}
          _hover={{ bg: 'gray_2', color: '#bdbdbd' }}
        >
          {certificacion?.meta?.isCompleted
            ? 'Certificación obtenida'
            : intentosRestantes <= 0
            ? 'Sin intentos restantes'
            : 'Empezar examen'}
        </Button>
      </Flex>
    </Flex>
  ) : (
    <Flex p="20px" w="100%" align="center" justify="center" direction="column" gap={{ base: '30px', sm: '60px' }}>
      <Skeleton boxSize="125px" rounded="xl" />
      <Flex direction="column" gap="15px" align="center">
        <Skeleton w="325px" h="29px" />
        <Skeleton w="150px" h="22px" />
      </Flex>

      <Flex gridColumnGap="20px" direction={{ base: 'column', sm: 'row' }}>
        <Skeleton w="186px" h="82px" rounded="xl" mb={{ base: '10px', sm: '0px' }} />
        <Skeleton w="186px" h="82px" rounded="xl" mb={{ base: '10px', sm: '0px' }} />
        <Skeleton w="186px" h="82px" rounded="xl" mb={{ base: '10px', sm: '0px' }} />
      </Flex>

      <Flex gridColumnGap="20px" direction={{ base: 'column', sm: 'row' }}>
        <Skeleton w="176px" h="42px" rounded="xl" mb={{ base: '10px', sm: '0px' }} />

        <Skeleton w="176px" h="42px" rounded="xl" />
      </Flex>
    </Flex>
  );
};

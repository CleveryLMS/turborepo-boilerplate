import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { BiCheckboxChecked, BiRefresh } from 'react-icons/bi';
import { Flex, Box, Icon, Button, Grid, Text } from '@chakra-ui/react';

import { fmtTiempoTotal } from 'utils';
import { Avatar } from '../../../../shared/components';
import { IExamen, ICertificacion } from 'data';
import { LayoutContext } from '../../../../shared/context/layout.context';

export const ExamenSuspendido = ({
  examen,
  certificacion,
  resultados,
}: {
  examen?: IExamen;
  certificacion?: ICertificacion;
  resultados?: {
    intentosTotales: number;
    intentosRestantes: number;
    preguntasTotales: number;
    preguntasCorrectas: number;
    tiempoUtilizado: number;
  };
}) => {
  const navigate = useNavigate();
  const { isMobile } = useContext(LayoutContext);

  return (
    <Flex p={{ base: '20px 40px 40px', md: '0' }} align="center" justify="center" direction="column" gap="60px">
      <Flex direction="column" gap={isMobile ? '25px' : '45px'} align="center" pt={isMobile ? '10px' : ''}>
        <Avatar src={examen?.imagen?.url} size={isMobile ? '80px' : '125px'} name="" rounded="20px" />
        <Flex direction="column" align="center" gap="18px">
          <Box fontSize={{ base: '20px', sm: '24px' }} lineHeight="29px" fontWeight="bold">
            Vaya...
          </Box>

          <Text fontSize={{ base: '12px', sm: '15px' }} lineHeight="22px" textAlign="center">
            No has logrado superar el examen pero no te rindas, todavía te quedan {resultados?.intentosRestantes} intentos para
            realizar la certificación {certificacion?.nombre}. Aprovecha y mejora tus conocimientos antes de reintentarlo.
          </Text>
        </Flex>
      </Flex>

      <Grid
        templateRows={isMobile ? 'repeat(3, 1fr)' : 'repeat(1, 1fr)'}
        templateColumns={isMobile ? 'repeat(1, 1fr)' : 'repeat(3, 1fr)'}
        gap={isMobile ? 2 : 8}
        margin={isMobile ? '-40px' : ''}
      >
        <Flex
          w="100%"
          p="18px"
          align="center"
          rounded="20px"
          gridColumnGap="20px"
          bg="white"
          border="1px solid var(--chakra-colors-gray_3)"
        >
          <Flex boxSize="44px" rounded="10px" p="10px" bg="primary_light" align="center" justify="center">
            <Icon as={BiCheckboxChecked} boxSize="24px" color="primary_dark" />
          </Flex>

          <Flex direction="column" gridRowGap="6px">
            <Box w="100%" lineHeight="100%" fontWeight="medium" fontSize="14px" color="gray_4" whiteSpace="nowrap">
              Preguntas acertadas
            </Box>

            <Box lineHeight="100%" fontWeight="bold" fontSize="19px">
              {resultados?.preguntasCorrectas} / {resultados?.preguntasTotales}
            </Box>
          </Flex>
        </Flex>

        <Flex
          w="100%"
          p="18px"
          align="center"
          rounded="20px"
          gridColumnGap="20px"
          bg="white"
          border="1px solid var(--chakra-colors-gray_3)"
        >
          <Flex boxSize="44px" rounded="10px" p="10px" bg="primary_light" align="center" justify="center">
            <Icon as={BiCheckboxChecked} boxSize="24px" color="primary_dark" />
          </Flex>

          <Flex direction="column" gridRowGap="6px">
            <Box w="100%" lineHeight="100%" fontWeight="medium" fontSize="14px" color="gray_4" whiteSpace="nowrap">
              Tiempo utilizado
            </Box>

            <Box lineHeight="100%" fontWeight="bold" fontSize="19px">
              {fmtTiempoTotal(resultados?.tiempoUtilizado || 0) || '< 1min'}
            </Box>
          </Flex>
        </Flex>

        <Flex
          w="100%"
          p="18px"
          align="center"
          rounded="20px"
          gridColumnGap="20px"
          bg="white"
          border="1px solid var(--chakra-colors-gray_3)"
        >
          <Flex boxSize="44px" rounded="10px" p="10px" bg="primary_light" align="center" justify="center">
            <Icon as={BiCheckboxChecked} boxSize="24px" color="primary_dark" />
          </Flex>

          <Flex direction="column" gridRowGap="6px">
            <Box w="100%" lineHeight="100%" fontWeight="medium" fontSize="14px" color="gray_4" whiteSpace="nowrap">
              Intentos restantes
            </Box>

            <Box lineHeight="100%" fontWeight="bold" fontSize="19px">
              {Math.max(resultados?.intentosRestantes || 0, 0)} / {resultados?.intentosTotales}
            </Box>
          </Flex>
        </Flex>
      </Grid>

      <Grid
        templateRows={isMobile ? 'repeat(2, 1fr)' : 'repeat(1, 1fr)'}
        templateColumns={isMobile ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)'}
        gap={isMobile ? 2 : 8}
      >
        <Flex justify="center">
          <Button bg="gray_3" onClick={() => navigate(`/certificaciones`)}>
            Explorar otras certificaciones
          </Button>
        </Flex>
        <Flex justify="center">
          {(resultados?.intentosRestantes || 0) > 0 && (
            <Button
              bg="black"
              color="white"
              rightIcon={<Icon as={BiRefresh} boxSize="24px" />}
              onClick={() => navigate(`/certificaciones/${certificacion?.id}/examen/${examen?.id}`)}
            >
              Intentar de nuevo
            </Button>
          )}
        </Flex>
      </Grid>
    </Flex>
  );
};

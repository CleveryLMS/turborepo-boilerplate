import { useContext } from 'react';

import { Text, Flex, Box, Button, Icon, Grid } from '@chakra-ui/react';
import { BiLaptop, BiCalendarX, BiTimeFive, BiPlay } from 'react-icons/bi';

import { IExamen } from 'data';
import { fmtMnts } from 'utils';
import { LayoutContext } from '../../../../shared/context';

export const PortadaExamen = ({ examen, onStart }: { examen?: IExamen; onStart: () => void }) => {
  const { isMobile } = useContext(LayoutContext);
  return (
    <Grid
      templateRows={{ base: 'repeat(2, 1fr)', sm: 'repeat(1, 1fr)' }}
      templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
      h="auto"
      m={{ base: '34px 10px 10px 10px', sm: '34px 34px 10px 34px' }}
      bg="white"
      rounded="20px"
      p={{ base: '20px 0px 0px 0px', sm: '34px' }}
    >
      <Flex gap="50px" direction="column" align={isMobile ? 'center' : ''}>
        <Flex
          direction="column"
          gap="18px"
          align={isMobile ? 'center' : ''}
          ml={{ base: '10px', sm: '0px' }}
          mr={{ base: '10px', sm: '0px' }}
        >
          <Text variant="h1_heading">Antes de empezar...</Text>

          <Box fontSize="15px" lineHeight="18px">
            Las certificaciones son una manera que tenemos de validar vuestro nivel de conocimientos de la manera más objetiva
            posible. Para obtener las certificaciones tendrás que seguir las normas y recomendaciones que te facilitamos en esta
            página.
          </Box>
        </Flex>

        <Button
          bg="black"
          rounded="14px"
          w="fit-content"
          color="white"
          p="15px 24px"
          rightIcon={<Icon as={BiPlay} />}
          fontSize="18px"
          lineHeight="22px"
          fontWeight="bold"
          onClick={onStart}
        >
          Empezar ahora
        </Button>
      </Flex>

      <Flex
        p="40px"
        gap="40px"
        bg="gray_1"
        border="2px"
        direction="column"
        borderColor="gray_3"
        ml={{ base: '0px', md: '20px' }}
        mt={{ base: '20px', md: '0px' }}
        rounded={{ base: '', sm: '20px' }}
      >
        <Flex gap="17px">
          <Icon as={BiTimeFive} boxSize="20px" color="cancel" />

          <Flex w="100%" direction="column" gap="10px">
            <Box fontSize="16px" fontWeight="bold" lineHeight="22px">
              Límite de {fmtMnts(examen?.duracion)}
            </Box>

            <Box fontSize="15px" lineHeight="22px">
              Dispones de {fmtMnts(examen?.duracion)} minutos para realizar la certificación. El temporizador empezará a contar
              en cuanto pulses el botón “Empezar ahora”.
            </Box>
          </Flex>
        </Flex>

        <Flex gap="17px">
          <Icon as={BiCalendarX} boxSize="20px" color="cancel" />

          <Flex w="100%" direction="column" gap="10px">
            <Box fontSize="16px" fontWeight="bold" lineHeight="22px">
              No abandones la página
            </Box>

            <Box fontSize="15px" lineHeight="22px">
              Mantén el ratón en la página en todo momento y no cambies de página. Si cambias o abandonas la página{' '}
              <strong>se te descontarán 5 minutos</strong> del tiempo disponible que tienes para realizar la certificación.
            </Box>
          </Flex>
        </Flex>

        <Flex gap="17px">
          <Icon as={BiLaptop} boxSize="20px" color="primary" />

          <Flex w="100%" direction="column" gap="10px">
            <Box fontSize="16px" fontWeight="bold" lineHeight="22px">
              Utiliza un PC o portátil
            </Box>

            <Box fontSize="15px" lineHeight="22px">
              Recomendamos realizar las certificaciones desde un ordenador para evitar posibles fallos de visualización de las
              mismas.
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Grid>
  );
};

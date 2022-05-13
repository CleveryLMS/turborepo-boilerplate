import { Text, Flex, Box, Button, Icon } from '@chakra-ui/react';
import { BiPlay, BiTimeFive, BiCalendarX, BiLaptop } from 'react-icons/bi';

import { fmtMnts } from 'utils';
import { IExamen } from 'data';

export const PortadaTest = ({ test, onStart }: { test?: IExamen; onStart: () => void }) => {
  return (
    <Flex boxSize="100%" p="34px 34px 0px 34px" justify="center" align="center">
      <Flex
        h="100%"
        bg="white"
        p="0px 90px"
        gap="80px"
        align="center"
        justify="center"
        border="1px solid"
        borderColor="gray_3"
        rounded="20px 20px 0px 0px"
      >
        <Flex gap="50px" direction="column">
          <Flex direction="column" gap="18px">
            <Text variant="h1_heading">Antes de empezar...</Text>

            <Box fontSize="15px" lineHeight="18px">
              Las certificaciones son una manera que tenemos de validar vuestro nivel de conocimientos de la manera más objetiva
              posible. Para obtener las certificaciones tendrás que seguir las normas y recomendaciones que te facilitamos en
              esta página.
            </Box>
          </Flex>

          <Button
            bg="black"
            rounded="14px"
            w="fit-content"
            color="white"
            p="15px 24px"
            fontSize="18px"
            lineHeight="22px"
            fontWeight="bold"
            onClick={onStart}
            rightIcon={<Icon as={BiPlay} />}
          >
            Empezar ahora
          </Button>
        </Flex>

        <Flex p="40px" gap="40px" bg="gray_1" rounded="20px" direction="column" border="1px solid" borderColor="gray_3">
          <Flex gap="17px">
            <Icon as={BiTimeFive} boxSize="20px" color="cancel" />

            <Flex w="100%" direction="column" gap="10px">
              <Box fontSize="16px" fontWeight="bold" lineHeight="22px">
                Límite de {fmtMnts(test?.duracion)}
              </Box>

              <Box fontSize="15px" lineHeight="22px">
                Dispones de {fmtMnts(test?.duracion)} minutos para realizar la certificación. El temporizador empezará a contar
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
      </Flex>
    </Flex>
  );
};

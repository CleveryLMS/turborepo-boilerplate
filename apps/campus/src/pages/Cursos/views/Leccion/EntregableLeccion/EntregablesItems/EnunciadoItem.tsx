import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { ILeccion } from 'data';
import { OpenParser } from 'ui';

const EnunciadoItem = ({ leccion, refreshEntregable }: { leccion: ILeccion; refreshEntregable: any }) => {
  return (
    <>
      <Box fontSize="15px" whiteSpace="pre-line">
        <Text variant="h4_heading" mb="20px">
          Enunciado del ejercicio:{' '}
        </Text>
        <Flex bg="gray_1" border="1px solid var(--chakra-colors-gray_3)" p="12px" rounded="12px">
          <OpenParser value={leccion?.contenido || ''} />
        </Flex>
      </Box>

      <Box bg="gray_3" h="1px" />

      <Box fontSize="15px" lineHeight="24px">
        <Box as="p">
          Cuando comiences el ejercicio se te mostrarán las especificaciones para la realización y entrega del mismo. La entrega
          del ejercicio deberá realizarse a través de una carpeta .zip empaquetada o un enlace al repositorio del ejercicio en
          GitHub.
        </Box>

        <br />

        <Box as="p" fontWeight="bold">
          Una vez le des al botón de comenzar ejercicio el tiempo del que dispones para realizarlo empezará a contar.
        </Box>

        <br />

        <Box>
          Asegúrate de tener todo lo que necesites preparado ya que una vez se acabe el tiempo si no has realizado la entrega
          esta contará como no superada.
        </Box>
      </Box>
      <Button
        h="55px"
        minH="55px"
        p="5px 20px"
        bg="primary"
        color="white"
        w="fit-content"
        rounded="8px"
        fontSize="18px"
        lineHeight="21px"
        fontWeight="bold"
        onClick={refreshEntregable}
      >
        Comenzar tarea
      </Button>
    </>
  );
};

export { EnunciadoItem };

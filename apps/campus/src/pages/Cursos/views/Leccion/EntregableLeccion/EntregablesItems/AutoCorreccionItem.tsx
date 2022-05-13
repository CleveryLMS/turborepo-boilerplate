import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { ILeccion, LeccionTipoEnum } from 'data';
import { OpenParser } from 'ui';

const AutoCorreccionItem = ({ leccion, refreshEntregable }: { leccion: ILeccion; refreshEntregable: any }) => {
  return (
    <Box fontSize="15px" lineHeight="24px">
      {leccion.tipo === LeccionTipoEnum.AUTOCORREGIBLE && (
        <>
          <Box whiteSpace="pre-line" mb="15px">
            <Text variant="h4_heading" mb="20px">
              Solución del ejercicio:
            </Text>

            <Box fontSize="15px" whiteSpace="pre-line">
              {leccion?.solucion?.contenido && leccion?.solucion?.contenido !== ' ' ? (
                <Flex bg="gray_1" border="1px solid var(--chakra-colors-gray_3)" p="12px" rounded="12px">
                  <OpenParser value={leccion?.solucion?.contenido} />
                </Flex>
              ) : (
                <Box color="gray_4">No hay solución disponible</Box>
              )}
            </Box>
          </Box>
          <Box bg="gray_3" h="1px" my="25px" />
        </>
      )}

      <Box fontSize="15px" whiteSpace="pre-line">
        <Text variant="h4_heading" mb="20px">
          Enunciado del ejercicio:{' '}
        </Text>
        <Flex bg="gray_1" border="1px solid var(--chakra-colors-gray_3)" p="12px" rounded="12px">
          <OpenParser value={leccion?.contenido || ''} />
        </Flex>
      </Box>
      <Button
        mt="25px"
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
        Modificar tarea
      </Button>
    </Box>
  );
};

export { AutoCorreccionItem };

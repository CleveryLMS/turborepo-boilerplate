import { Flex, Box, Text } from '@chakra-ui/react';

import { OpenParser } from 'ui';
import { IEntregable, ILeccion } from 'data';

const CorregidoItem = ({ leccion, entregable }: { leccion: ILeccion; entregable?: IEntregable }) => {
  return (
    <Flex direction="column" fontSize="15px" whiteSpace="pre-line">
      <Box fontSize="15px" whiteSpace="pre-line">
        <Text variant="h4_heading" mb="20px">
          Observaciones del ejercicio:
        </Text>

        <Flex p="12px" bg="gray_1" rounded="12px" border="1px solid" borderColor="gray_3">
          <OpenParser value={entregable?.observaciones || 'No hay observaciones del ejercicio'} />
        </Flex>
      </Box>

      <Box my="15px" bg="gray_3" h="1px" />
      <Box fontSize="15px" whiteSpace="pre-line">
        <Text variant="h4_heading" mb="20px">
          Enunciado del ejercicio:{' '}
        </Text>
        <Flex p="12px" bg="gray_1" rounded="12px" border="1px solid" borderColor="gray_3">
          <OpenParser value={leccion?.contenido || ''} />
        </Flex>
      </Box>
    </Flex>
  );
};

export { CorregidoItem };

import { Box, Flex, Text } from '@chakra-ui/react';
import { ILeccion, IEntregable } from 'data';
import { OpenParser } from 'ui';
import { EntregaTarea } from '../Entrega';

const EntregaItem = ({
  leccion,
  entregable,
  setEntregable,
  realizarEntrega,
}: {
  leccion: ILeccion;
  entregable?: IEntregable;
  setEntregable: any;
  realizarEntrega: any;
}) => {
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
      <EntregaTarea entregable={entregable} setEntregable={setEntregable} realizarEntrega={realizarEntrega} />
    </>
  );
};

export { EntregaItem };

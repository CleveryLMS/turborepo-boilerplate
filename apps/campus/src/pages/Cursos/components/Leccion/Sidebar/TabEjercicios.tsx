import { Box, Flex } from '@chakra-ui/react';

import EjercicioItem from './EjercicioItem';
import { ICurso, IModulo, ILeccion } from 'data';

const TabEjercicios = ({
  curso,
  leccionId,
  onLeccionSelect,
  onLeccionCompleted,
}: {
  curso?: ICurso;
  leccionId?: number;
  onLeccionSelect: (e?: any) => void;
  onLeccionCompleted: (e?: any) => void;
}) => {
  return (
    <Flex direction="column" overflow="auto">
      {(curso?.modulos?.length || 0) > 0 ? (
        curso?.modulos?.map((modulo: IModulo, index: number) => {
          const isOpened = modulo?.lecciones?.find((l) => l.id === leccionId) !== undefined;

          return (
            <EjercicioItem
              key={'curso-modulo-' + index}
              modulo={modulo}
              isOpened={isOpened}
              leccionId={leccionId}
              onLeccionSelect={(leccion: ILeccion) => onLeccionSelect(leccion)}
              onLeccionCompleted={(leccion: ILeccion) => onLeccionCompleted(leccion)}
            />
          );
        })
      ) : (
        <Box color="gray_4" fontWeight="bold" fontSize="16px" lineHeight="100%" p="15px 30px">
          No hay tests disponibles
        </Box>
      )}
    </Flex>
  );
};

export default TabEjercicios;

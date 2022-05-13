import { Flex } from '@chakra-ui/react';

import SidebarItem from './SidebarItem';
import { ICurso, IModulo, ILeccion } from 'data';

const TabLecciones = ({
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
      {curso?.modulos?.map((modulo: IModulo, index: number) => {
        const isCompleted =
          modulo.meta?.leccionesCount !== undefined &&
          modulo.meta?.progresos_count !== undefined &&
          modulo.meta?.progresos_count >= modulo.meta?.leccionesCount;

        const isOpened = modulo?.lecciones?.find((l) => l.id === leccionId) !== undefined;

        return (
          <SidebarItem
            key={'curso-modulo-' + index}
            modulo={modulo}
            leccionId={leccionId}
            isOpened={isOpened}
            isCompleted={isCompleted}
            onLeccionSelect={(leccion: ILeccion) => onLeccionSelect(leccion)}
            onLeccionCompleted={(leccion: ILeccion) => onLeccionCompleted(leccion)}
          />
        );
      })}
    </Flex>
  );
};

export default TabLecciones;

import { useContext, useRef } from 'react';

import { BiChevronsLeft, BiMenu } from 'react-icons/bi';
import { Flex, Icon, Tab, TabList, TabPanel, TabPanels, Tabs, IconButton } from '@chakra-ui/react';

import TabTests from './TabTests';
import TabLecciones from './TabLecciones';
import TabEjercicios from './TabEjercicios';
import { useHover } from 'utils';
import { ICurso, IExamen, ILeccion } from 'data';
import { VisibilityContext, CampusPages } from 'apps/campus/src/shared/context';

const SidebarLeccion = ({
  state,
  curso,
  leccion,
  onExamenSelect,
  onLeccionSelect,
  onLeccionCompleted,
}: {
  curso?: ICurso;
  leccion?: ILeccion;
  state: { isOpen: boolean; onClose: () => void };
  onExamenSelect: (examen: IExamen) => void;
  onLeccionSelect: (leccion: ILeccion) => void;
  onLeccionCompleted: (leccion: ILeccion) => void;
}) => {
  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);

  const { disabledPages } = useContext(VisibilityContext);

  return (
    <Flex
      h="100%"
      w="400px"
      maxW="400px"
      bg="white"
      minW="400px"
      position="relative"
      direction="column"
      gridRowGap="30px"
      right={state.isOpen ? '0px' : '400px'}
      style={{ transition: 'all 0.6s ease-in-out' }}
    >
      <Tabs>
        <TabList
          maxW="400px"
          p={{ base: '10px 10px', sm: '15px 20px' }}
          borderBottom="1px solid var(--chakra-colors-gray_3)"
          position="sticky"
          top="0"
          bg="white"
          gap="20px"
        >
          <Tab
            color="gray_4"
            fontSize="14px"
            fontWeight="bold"
            _selected={{ color: 'black' }}
            p={{ base: '10px', sm: 'unset' }}
          >
            Contenido
          </Tab>

          <Tab
            p={{ base: '10px', sm: 'unset' }}
            color="gray_4"
            fontSize="14px"
            fontWeight="bold"
            _selected={{ color: 'black' }}
          >
            Ejercicios
          </Tab>

          {!disabledPages?.includes(CampusPages.CERTIFICACIONES) && (
            <Tab
              p={{ base: '10px', sm: 'unset' }}
              color="gray_4"
              fontSize="14px"
              fontWeight="bold"
              _selected={{ color: 'black' }}
            >
              Tests
            </Tab>
          )}

          <IconButton
            ref={hoverRef}
            ml="auto"
            bg="transparent"
            onClick={state.onClose}
            aria-label="Cerrar sidebar"
            icon={<Icon as={isHover ? BiChevronsLeft : BiMenu} color="gray_4" boxSize={6} />}
            _hover={{ backgroundColor: 'transparent' }}
          />
        </TabList>

        <TabPanels p="0px">
          <TabPanel p="0px">
            <TabLecciones
              curso={curso}
              leccionId={leccion?.id}
              onLeccionSelect={onLeccionSelect}
              onLeccionCompleted={onLeccionCompleted}
            />
          </TabPanel>

          <TabPanel p="0px">
            <TabEjercicios
              curso={curso}
              leccionId={leccion?.id}
              onLeccionSelect={onLeccionSelect}
              onLeccionCompleted={onLeccionCompleted}
            />
          </TabPanel>

          {!disabledPages?.includes(CampusPages.CERTIFICACIONES) && (
            <TabPanel p="0px">
              <TabTests cursoId={curso?.id} onExamenSelect={onExamenSelect} />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default SidebarLeccion;

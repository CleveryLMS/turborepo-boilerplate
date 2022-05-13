import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { BiChevronsRight, BiExit, BiMenu, BiNote } from 'react-icons/bi';
import { Flex, Button, Icon, Box, Progress, IconButton, useMediaQuery } from '@chakra-ui/react';

import { ICurso } from 'data';
import { useHover } from 'utils';
import { Searchbar } from 'apps/campus/src/shared/components';

export const LeccionHeader = ({
  curso,
  showSidebar,
  openSidebar,
  openNotes,
  openNotas,
  showSearchbar,
}: {
  curso?: ICurso;
  showSidebar: boolean;
  openSidebar: () => void;
  openNotes: () => void;
  openNotas: boolean;
  showSearchbar?: boolean;
}) => {
  const navigate = useNavigate();
  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);
  const [isMobile] = useMediaQuery('(max-width: 925px)');

  return isMobile ? (
    <Flex
      h="130px"
      direction="row"
      align="center"
      p="10px"
      justify="space-between"
      gap="12px"
      w="100%"
      position="sticky"
      top="0"
      bg="gray_1"
      zIndex="80"
    >
      <Flex w="100%" gap="10px" justify="space-between" align="center">
        {showSidebar && (
          <IconButton
            color="gray_4"
            boxSize="16px"
            bg="transparent"
            onClick={openSidebar}
            aria-label="Abrir sidebar"
            ref={hoverRef}
            icon={<Icon as={isHover ? BiChevronsRight : BiMenu} boxSize={6} />}
            _hover={{ backgroundColor: 'transparent' }}
          />
        )}

        <Flex direction="column" align="start" justify="center" gap="0px" w="100%" maxW="600px">
          <Box fontSize="14px" fontWeight="bold" lineHeight="22px" textAlign="start" pt="5px">
            Curso de {curso?.titulo}
          </Box>

          <Flex w="100%" align="center" gap="12px">
            <Progress
              value={curso?.meta?.progreso_count || 0}
              bg="gray_3"
              w="100%"
              h="6px"
              rounded="10px"
              sx={{ '& > div': { background: 'primary' } }}
            />

            <Box fontSize="13px" fontWeight="bold" lineHeight="16px" color="primary" textAlign="center">
              {curso?.meta?.progreso_count || 0}%
            </Box>
          </Flex>
        </Flex>

        <Flex>
          {showSearchbar && <Searchbar />}

          <Button
            mr="10px"
            h="auto"
            bg="gray_3"
            leftIcon={<Icon as={BiExit} boxSize="18px" />}
            p="10px 16px"
            pr="7px"
            rounded="10px"
            fontSize="15px"
            minW="fit-content"
            fontWeight="bold"
            lineHeight="17px"
            onClick={() => navigate(`/cursos/${curso?.id}`)}
            _hover={{
              backgroundColor: 'gray_4',
              opacity: 0.8,
            }}
          />

          <Button
            h="auto"
            bg="gray_3"
            leftIcon={<Icon as={BiNote} boxSize="18px" />}
            p="7px"
            pr="7px"
            rounded="10px"
            fontSize="15px"
            minW="fit-content"
            fontWeight="bold"
            lineHeight="17px"
            onClick={openNotes}
            _hover={{
              backgroundColor: 'gray_4',
              opacity: 0.8,
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  ) : (
    <Flex
      h="80px"
      align="center"
      p="18px 5px 12px"
      justify="space-between"
      gap="26px"
      w="100%"
      position="sticky"
      top="0"
      bg="gray_1"
      zIndex="80"
    >
      <Flex align="center" gap="24px">
        {showSidebar && (
          <IconButton
            color="gray_4"
            bg="transparent"
            onClick={openSidebar}
            aria-label="Abrir sidebar"
            ref={hoverRef}
            icon={<Icon as={isHover ? BiChevronsRight : BiMenu} boxSize={6} />}
            _hover={{ backgroundColor: 'transparent' }}
          />
        )}

        <Button
          h="auto"
          bg="gray_3"
          data-cy="cursos_lecciones_salir"
          leftIcon={<Icon as={BiExit} boxSize="18px" />}
          p="10px 16px"
          rounded="10px"
          fontSize="15px"
          minW="fit-content"
          fontWeight="bold"
          lineHeight="17px"
          data-phone-text=""
          onClick={() => navigate(`/cursos/${curso?.id || ''}`)}
          _hover={{
            backgroundColor: 'gray_4',
            opacity: 0.8,
          }}
        >
          Salir del curso
        </Button>
      </Flex>

      <Flex direction="column" align="center" justify="center" gap="9px" w="100%" maxW="600px">
        <Box fontSize="18px" fontWeight="bold" lineHeight="22px" textOverflow="ellipsis">
          Curso de {curso?.titulo}
        </Box>

        <Flex w="100%" align="center" gap="12px">
          <Box fontSize="13px" fontWeight="bold" lineHeight="16px" color="primary" textAlign="center">
            {curso?.meta?.progreso_count || 0}%
          </Box>

          <Progress
            value={curso?.meta?.progreso_count || 0}
            bg="gray_3"
            w="100%"
            h="6px"
            rounded="10px"
            sx={{ '& > div': { background: 'primary' } }}
          />
        </Flex>
      </Flex>

      <Flex minW="fit-content" align="center" gap="9px">
        {showSearchbar && <Searchbar />}

        <Button
          h="auto"
          bg="gray_3"
          leftIcon={<Icon as={BiNote} boxSize="18px" />}
          p="10px 16px"
          data-cy="notas_button"
          rounded="10px"
          fontSize="15px"
          minW="fit-content"
          fontWeight="bold"
          lineHeight="17px"
          onClick={openNotes}
          _hover={{
            backgroundColor: 'gray_4',
            opacity: 0.8,
          }}
        >
          <span data-cy="notas_text_button">{openNotas ? 'Ocultar notas' : 'Ver notas'}</span>
        </Button>
      </Flex>
    </Flex>
  );
};

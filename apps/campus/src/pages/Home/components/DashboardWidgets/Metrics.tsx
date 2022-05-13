import { useContext } from 'react';

import { Flex, Box, Text } from '@chakra-ui/react';
import { BiBookBookmark, BiBadgeCheck, BiTimeFive } from 'react-icons/bi';

import {
  CampusPages,
  LayoutContext,
  VisibilityContext,
  ProgresoGlobalContext,
} from '../../../../shared/context';

export const MetricsWidget = () => {
  const { isMobile } = useContext(LayoutContext);
  const { disabledPages } = useContext(VisibilityContext);
  const { progresoGlobal } = useContext(ProgresoGlobalContext);

  return (
    <Flex direction="column" gap={{ base: '10px', sm: '20px' }}>
      <Box fontWeight="bold" fontSize="18px">
        Métricas
      </Box>

      <Flex
        w="100%"
        p={{ base: '14px', sm: '24px' }}
        gap="12px"
        bg="white"
        rounded="20px"
        justify="center"
        direction="column"
        border="1px solid var(--chakra-colors-gray_3)"
      >
        {!disabledPages?.includes(CampusPages.CURSOS) && (
          <Flex
            w="100%"
            gap={{ base: '0px', sm: '10px' }}
            align={{ base: 'start', sm: 'center' }}
            direction={{ base: 'column', sm: 'row' }}
          >
            <Flex
              align="center"
              gap="10px"
              w="100%"
              color="gray_5"
              textAlign="start"
              justify="start"
            >
              <Box
                fontSize="14px"
                bg="primary_light"
                h="35px"
                minW="35px"
                p="8px"
                rounded="full"
                color="primary"
                as={BiBookBookmark}
              />
              <Flex direction="column" w="100%">
                Cursos Completados
                {isMobile && (
                  <Text
                    isTruncated
                    fontSize="16px"
                    justifySelf="end"
                    fontWeight="bold"
                    minW="fit-content"
                    title={
                      (progresoGlobal?.meta?.cursosCompletados?.length || 0) +
                      ''
                    }
                  >
                    {progresoGlobal?.meta?.cursosCompletados?.length || 0}
                  </Text>
                )}
              </Flex>
            </Flex>
            {!isMobile && (
              <Text
                isTruncated
                fontSize="16px"
                justifySelf="end"
                fontWeight="bold"
                minW="fit-content"
                title={
                  (progresoGlobal?.meta?.cursosCompletados?.length || 0) + ''
                }
              >
                {progresoGlobal?.meta?.cursosCompletados?.length || 0}
              </Text>
            )}
          </Flex>
        )}

        <Box h="1px" w="100%" bg="gray_3" opacity="0.06" />

        {!disabledPages?.includes(CampusPages.CERTIFICACIONES) && (
          <Flex
            w="100%"
            gap={{ base: '0px', sm: '10px' }}
            align={{ base: 'start', sm: 'center' }}
            direction={{ base: 'column', sm: 'row' }}
          >
            <Flex
              align="center"
              gap="10px"
              w="100%"
              color="gray_5"
              textAlign="start"
              justify="start"
            >
              <Box
                p="8px"
                h="35px"
                minW="35px"
                rounded="full"
                fontSize="14px"
                color="primary"
                bg="primary_light"
                as={BiBadgeCheck}
              />
              <Flex direction="column" w="100%">
                Certificaciones obtenidas
                {isMobile && (
                  <Text
                    isTruncated
                    fontSize="16px"
                    fontWeight="bold"
                    justifySelf="end"
                    title={
                      (progresoGlobal?.meta?.certificacionesCompletadas
                        ?.length || 0) + ''
                    }
                  >
                    {progresoGlobal?.meta?.certificacionesCompletadas?.length ||
                      0}
                  </Text>
                )}
              </Flex>
            </Flex>
            {!isMobile && (
              <Text
                isTruncated
                fontSize="16px"
                fontWeight="bold"
                justifySelf="end"
                title={
                  (progresoGlobal?.meta?.certificacionesCompletadas?.length ||
                    0) + ''
                }
              >
                {progresoGlobal?.meta?.certificacionesCompletadas?.length || 0}
              </Text>
            )}
          </Flex>
        )}

        <Box h="1px" w="100%" bg="gray_3" opacity="0.06" />
        <Flex
          w="100%"
          gap={{ base: '0px', sm: '10px' }}
          align={{ base: 'start', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
        >
          <Flex
            align="center"
            gap="10px"
            w="100%"
            color="gray_5"
            textAlign="start"
            justify="flex-start"
          >
            <Box
              fontSize={{ base: '12px', sm: '14px' }}
              bg="primary_light"
              h="35px"
              minW="35px"
              p="8px"
              rounded="full"
              color="primary"
              as={BiTimeFive}
              textOverflow="ellipsis"
            />
            <Flex direction="column" w="100%">
              Tiempo total invertido
              {isMobile && (
                <Box
                  color="black"
                  minW="fit-content"
                  fontSize="16px"
                  fontWeight="bold"
                >
                  {progresoGlobal?.tiempoTotal || 0}
                </Box>
              )}
            </Flex>
          </Flex>
          {!isMobile && (
            <Box minW="fit-content" fontSize="16px" fontWeight="bold">
              {progresoGlobal?.tiempoTotal || 0}
            </Box>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

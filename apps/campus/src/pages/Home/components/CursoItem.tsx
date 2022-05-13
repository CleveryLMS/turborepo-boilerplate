import { Flex, Box, Icon, Image, Progress, Skeleton, Text } from '@chakra-ui/react';
import { FaRegEyeSlash } from 'react-icons/fa';
import { BiAward, BiListOl, BiTimeFive } from 'react-icons/bi';

import { fmtMnts } from 'utils';
import { ICurso } from 'data';

export const CursoItem = ({
  curso,
  style,
  isLoading = false,
  isPublished = true,
  showProgress = true,
  onClick,
  width,
}: {
  onClick?: () => void;
  curso?: ICurso;
  style?: React.CSSProperties;
  isLoading?: boolean;
  isPublished?: boolean;
  showProgress?: boolean;
  width?: any;
}) => {
  return !isLoading ? (
    isPublished ? (
      <Flex
        w={width || '335px'}
        minW={width || '335px'}
        minH="100%"
        overflow="hidden"
        direction="column"
        justify="space-between"
        style={style}
        cursor={onClick ? 'pointer' : 'default'}
        onClick={onClick}
        transition="all 0.2s ease"
        border="1px solid var(--chakra-colors-gray_3)"
        _hover={{ backgroundColor: 'var(--chakra-colors-gray_2)' }}
        rounded="2xl"
        h="fit-content"
      >
        <Flex w="100%" direction="column" overflow="hidden">
          <Flex position="relative" h="140px" w="100%">
            <Image fit="cover" boxSize="100%" roundedTop="12px" src={curso?.imagen?.url} />

            <Flex p="15px" boxSize="100%" align="flex-start" position="absolute" justify="space-between">
              <Box
                bg="black"
                p="5px 8px"
                color="white"
                rounded="full"
                fontWeight="bold"
                textTransform="capitalize"
                backdropFilter="blur(24px)"
              >
                {curso?.nivel}
              </Box>

              {curso?.meta?.isCompleted && (
                <Flex
                  w="42px"
                  h="42px"
                  rounded="50%"
                  align="center"
                  justify="center"
                  bg="primary_graded"
                  filter="drop-shadow(0px 4px 20px primary_dark)"
                >
                  <Icon as={BiAward} boxSize="32px" color="#fff" />
                </Flex>
              )}
            </Flex>
          </Flex>

          <Flex p="20px 24px" w="100%" direction="column" gap="8px" overflow="hidden">
            <Box
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              lineHeight="19px"
              fontWeight="bold"
              fontSize="16px"
              title={curso?.titulo}
            >
              {curso?.titulo}
            </Box>

            <Flex align="center" gap="12px">
              <Flex align="center" gap="5px">
                <Icon as={BiListOl} boxSize="20px" color="#8B8FA2" />

                <Box whiteSpace="nowrap" fontSize="14px" fontWeight="semibold" lineHeight="16px" color="gray_4">
                  {curso?.modulos?.length || 0} módulos
                </Box>
              </Flex>

              <Flex align="center" gap="5px">
                <Icon as={BiTimeFive} boxSize="20px" color="#8B8FA2" />

                <Box whiteSpace="nowrap" fontSize="14px" fontWeight="semibold" lineHeight="16px" color="gray_4">
                  {fmtMnts(curso?.meta?.duracionTotal, false)}
                </Box>
              </Flex>

              {!curso?.publicado && (
                <Flex align="center" gap="5px">
                  <Icon as={FaRegEyeSlash} boxSize="20px" color="cancel" />

                  <Box whiteSpace="nowrap" fontSize="14px" fontWeight="semibold" lineHeight="16px" color="cancel">
                    No publicado
                  </Box>
                </Flex>
              )}
            </Flex>
          </Flex>

          {showProgress && (
            <Flex overflow="hidden" roundedBottom="full" justify="center" align="center">
              <Progress
                maxW="full"
                w="full"
                h="4px"
                value={100}
                sx={{
                  '& > div': {
                    background: !curso?.meta?.progreso_count
                      ? 'white'
                      : `linear-gradient(90deg, var(--chakra-colors-primary) 0%, var(--chakra-colors-primary_dark) ${
                          curso?.meta?.progreso_count + '%'
                        }, var(--chakra-colors-gray_2) ${curso?.meta?.progreso_count + '%'}, var(--chakra-colors-gray_2) 100%)`,
                  },
                }}
              />
            </Flex>
          )}
        </Flex>
      </Flex>
    ) : (
      <Flex
        w="134px"
        direction="column"
        justify="space-between"
        overflow="hidden"
        minH="100%"
        style={{ filter: 'grayscale(100%)', mixBlendMode: 'luminosity' }}
        opacity="0.6"
        cursor="default"
      >
        <Flex w="100%" direction="column" overflow="hidden">
          <Flex position="relative" h="140px" w="100%">
            <Image roundedTop="12px" boxSize="100%" src={curso?.imagen?.url} fit="cover" />

            <Flex p="15px" boxSize="100%" position="absolute" justify="space-between" align="flex-start">
              <Box
                color="white"
                fontWeight="bold"
                rounded="full"
                p="5px 8px"
                bg="black"
                backdropFilter="blur(24px)"
                textTransform="capitalize"
              >
                {curso?.nivel}
              </Box>

              {curso?.meta?.isCompleted && (
                <Flex
                  w="42px"
                  h="42px"
                  rounded="50%"
                  align="center"
                  justify="center"
                  filter="drop-shadow(0px 4px 20px primary_light"
                  bg="linear-gradient(227.34deg, var(--chakra-colors-primary) -4.81%, var(--chakra-colors-primary_dark) 97.15%)"
                >
                  <Icon as={BiAward} boxSize="32px" color="#fff" />
                </Flex>
              )}
            </Flex>
          </Flex>
          <Flex p="20px 24px" w="100%" direction="column" gap="6px" overflow="hidden">
            <Box
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              lineHeight="19px"
              fontWeight="bold"
              fontSize="16px"
              title={curso?.titulo}
            >
              {curso?.titulo}
            </Box>

            <Flex align="center" gap="12px">
              <Flex align="center" gap="5px">
                <Icon as={BiTimeFive} boxSize="20px" color="#8B8FA2" />

                <Text variant="card_description" whiteSpace="nowrap" fontWeight="semibold" as="i" color="gray_4">
                  Disponible próximamente...
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    )
  ) : (
    <Flex direction="column" w="100%">
      <Skeleton h="140px" w="100%" />
      <Flex direction="column" w="100%" p="24px">
        <Skeleton h="22px" w="100%" mb="8px" />
        <Flex w="100%" justify="space-between">
          <Skeleton h="22px" w="48%" />
          <Skeleton h="22px" w="48%" />
        </Flex>
      </Flex>
    </Flex>
  );
};

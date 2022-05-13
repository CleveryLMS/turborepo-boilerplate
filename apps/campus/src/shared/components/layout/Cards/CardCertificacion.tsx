import stc from 'string-to-color';
import { BiAward, BiBarChartAlt2, BiTimeFive } from 'react-icons/bi';
import { Flex, Box, Icon, Image, Skeleton, Center } from '@chakra-ui/react';

import { fmtMnts } from 'utils';
import { ICertificacion } from 'data';
import { FaRegEyeSlash } from 'react-icons/fa';

export const CardCertificacion = ({
  certificacion,
  style,
  isLoading = false,
  isPublished = true,
}: {
  certificacion: ICertificacion;
  style?: React.CSSProperties;
  onClick: () => void;
  isLoading: boolean;
  isPublished: boolean;
}) => {
  return !isLoading ? (
    isPublished ? (
      <Flex w="100%" justify="space-between" align="center" p="24px 20px">
        <Flex w="100%" cursor="pointer" direction="column" justify="space-between" style={style}>
          <Flex w="100%" gap="18px" align="center">
            <Flex minW="60px" boxSize="60px" rounded="10px" overflow="hidden">
              <Image
                fit="cover"
                boxSize="60px"
                objectPosition="center"
                src={certificacion.imagen?.url}
                bgColor={stc(certificacion?.nombre || 'Lorem Ipsum')}
              />
            </Flex>

            <Flex w="100%" direction="column" gap="6px" overflow="hidden">
              <Box
                whiteSpace="nowrap"
                overflow="hidden"
                lineHeight="19px"
                textOverflow="ellipsis"
                fontWeight="bold"
                fontSize="16px"
              >
                {certificacion.nombre}
              </Box>

              <Flex align="center" gridColumnGap="12px" wrap="wrap">
                <Flex align="center" gap="5px">
                  <Icon as={BiBarChartAlt2} boxSize="20px" color="gray_6" />

                  <Box whiteSpace="nowrap" fontSize="14px" fontWeight="semibold" lineHeight="16px" color="gray_4">
                    {certificacion?.nivel === 1 ? 'Iniciado' : certificacion?.nivel === 2 ? 'Medio' : 'Avanzado'}
                  </Box>
                </Flex>

                {certificacion?.meta?.duracionExamenes ? (
                  <Flex align="center" gap="5px">
                    <Icon as={BiTimeFive} boxSize="20px" color="gray_6" />

                    <Box whiteSpace="nowrap" fontSize="14px" fontWeight="semibold" lineHeight="16px" color="gray_4">
                      {fmtMnts(certificacion?.meta?.duracionExamenes)}
                    </Box>
                  </Flex>
                ) : null}

                {!certificacion?.publicado && (
                  <Flex align="center" gap="5px">
                    <Icon as={FaRegEyeSlash} boxSize="20px" color="cancel" />

                    <Box whiteSpace="nowrap" fontSize="14px" fontWeight="semibold" lineHeight="16px" color="cancel">
                      No publicada
                    </Box>
                  </Flex>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        {certificacion?.meta?.isCompleted && (
          <Center rounded="full" bg="primary" border="2px solid #fff">
            <Icon as={BiAward} boxSize="40px" p="8px" color="#fff" />
          </Center>
        )}
      </Flex>
    ) : (
      <Flex w="100%" justify="space-between" align="center" p="24px 20px" cursor="default">
        <Flex w="100%" cursor="pointer" direction="column" justify="space-between" style={style}>
          <Flex w="100%" gap="18px" align="center">
            <Flex minW="60px" boxSize="60px" rounded="10px" overflow="hidden" style={{ filter: 'grayscale(100%)' }}>
              <Image
                boxSize="60px"
                fit="cover"
                objectPosition="center"
                src={certificacion.imagen?.url}
                bgColor={stc(certificacion?.nombre || 'Lorem Ipsum')}
              />
            </Flex>

            <Flex w="100%" direction="column" gap="6px" overflow="hidden">
              <Box
                whiteSpace="nowrap"
                overflow="hidden"
                lineHeight="19px"
                textOverflow="ellipsis"
                fontWeight="bold"
                fontSize="16px"
              >
                {certificacion.nombre}
              </Box>

              <Flex align="center" gridColumnGap="12px" wrap="wrap">
                <Flex align="center" gap="5px">
                  <Icon as={BiTimeFive} boxSize="20px" color="gray_4" />

                  <Box as="i" color="gray_4" fontSize="14px" lineHeight="16px" whiteSpace="nowrap" fontWeight="semibold">
                    Disponible próximamente...
                  </Box>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    )
  ) : (
    <Flex p={{ base: '24px 15px 24px 30px', sm: '24px' }} w="100%">
      <Skeleton boxSize="60px" w="60px" rounded="10px" mr={{ base: '0px', sm: '18px' }} />

      <Flex w="180px" justify="center" direction="column" pl={{ base: '15px', sm: '0px' }}>
        <Skeleton h="20px" w="100%" mb="8px" />
        <Flex w="100%" justify="start">
          <Skeleton h="20px" w="100%" mr="12px" />
          <Skeleton h="20px" w="100%" mr="12px" />
        </Flex>
      </Flex>
    </Flex>
  );
};

export const CardCertificacionLoader = (props: any) => (
  <svg role="img" width="247" height="104" aria-labelledby="loading-aria" viewBox="0 0 247 104" preserveAspectRatio="none">
    <title id="loading-aria">Loading...</title>
    <rect x="0" y="0" width="100%" height="100%" clipPath="url(#clip-path__home)" style={{ fill: 'url("#fill__home")' }} />

    <defs>
      <clipPath id="clip-path__home">
        <rect x="0" y="0" rx="12" ry="12" width="247" height="104" />
      </clipPath>

      <linearGradient id="fill__home">
        <stop offset="0.599964" stopColor="var(--chakra-colors-gray_5)" stopOpacity="1">
          <animate attributeName="offset" values="-2; -2; 1" keyTimes="0; 0.25; 1" dur="2s" repeatCount="indefinite" />
        </stop>

        <stop offset="1.59996" stopColor="var(--chakra-colors-gray_4)" stopOpacity="1">
          <animate attributeName="offset" values="-1; -1; 2" keyTimes="0; 0.25; 1" dur="2s" repeatCount="indefinite" />
        </stop>

        <stop offset="2.59996" stopColor="var(--chakra-colors-gray_5)" stopOpacity="1">
          <animate attributeName="offset" values="0; 0; 3" keyTimes="0; 0.25; 1" dur="2s" repeatCount="indefinite" />
        </stop>
      </linearGradient>
    </defs>
  </svg>
);

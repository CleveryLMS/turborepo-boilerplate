import { useNavigate } from 'react-router-dom';

import { Flex, Box, Icon, Image, Button, Skeleton } from '@chakra-ui/react';
import { BiWallet, BiMap, BiTimeFive, BiCurrentLocation, BiPen } from 'react-icons/bi';

import { IProceso } from 'data';
import { Avatar } from '../../core';

export const CardProceso = ({
  proceso,
  isEnrolled,
  onEnroll,
  isLoading = false,
}: {
  proceso: IProceso;
  isEnrolled: boolean;
  onEnroll: (proceso: IProceso) => void;
  isLoading: boolean;
}) => {
  const navigate = useNavigate();

  return !isLoading ? (
    <Flex
      onClick={() => navigate('/procesos/' + proceso.id)}
      w="100%"
      justify="space-between"
      direction={{ base: 'column', md: 'row' }}
    >
      <Flex gap="18px" w="100%" align="center" p="33px">
        <Avatar src={proceso?.imagen?.url} rounded="15px" size="42px" name={proceso.titulo?.substring(0, 2)} />

        <Flex w="100%" direction="column">
          <Box fontSize="18px" fontWeight="bold">
            {proceso.titulo}
          </Box>

          <Flex gap={{ base: '0px', md: '17px' }} fontSize="14px" direction={{ base: 'column', md: 'row' }}>
            <Flex gap={{ base: '17px', md: '0px' }} minW="150px" direction={{ base: 'column', md: 'row' }}>
              <Flex color="gray_4" align="center" minW="150px">
                {/* TODO: AÑADIR TIPO JORNADA */}
                <Icon as={BiTimeFive} color="gray_5" mr="6px" boxSize="17px" /> Jornada Completa
              </Flex>

              <Flex color="gray_4" align="center" w="100%">
                <Icon as={BiMap} color="gray_5" mr="6px" boxSize="17px" />
                {proceso.localidad}
              </Flex>
            </Flex>
            <Flex gap={{ base: '17px', md: '0px' }} minW="150px" direction={{ base: 'column', md: 'row' }}>
              <Flex color="gray_4" align="center" pr="10px">
                <Icon as={BiWallet} color="gray_5" mr="6px" boxSize="17px" />
                {proceso.salarioMin} - {proceso.salarioMax} €/Año
              </Flex>

              {proceso.remoto && (
                <Flex color="primary" align="center">
                  <Icon as={BiCurrentLocation} mr="6px" boxSize="17px" />
                  En remoto
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <Flex direction="column" align="flex-end" minW="125px" p="24px">
        <Box color="gray_4" fontSize="14px">
          Nº Inscritos
        </Box>

        {isEnrolled && (
          <Button color="primary" bg="rgba(50, 212, 164, 0.1)" leftIcon={<Icon as={BiPen} />}>
            Ya inscrito
          </Button>
        )}
      </Flex>
    </Flex>
  ) : (
    <Flex w="100%" p="24px" align="center">
      <Skeleton boxSize="60px" mr="18px" />
      <Flex direction="column" w="100%" mr="24px">
        <Skeleton h="22px" w="100%" mb="8px" />
        <Flex w="100%" justify="start">
          <Skeleton h="22px" w="16%" mr="8px" />
          <Skeleton h="22px" w="16%" mr="8px" />
          <Skeleton h="22px" w="16%" />
        </Flex>
      </Flex>
      <Skeleton h="17px" w="115px" />
    </Flex>
  );
};

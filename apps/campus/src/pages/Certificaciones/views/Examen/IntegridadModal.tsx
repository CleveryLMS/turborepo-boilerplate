import { useContext } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Flex,
  Icon,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Center,
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';

import { IExamen } from 'data';
import { LoginContext } from '../../../../shared/context';

export const IntegridadModal = ({ examen, isOpen, onClose }: { examen: IExamen; isOpen: boolean; onClose: () => void }) => {
  const { user } = useContext(LoginContext);

  const certificacion = user?.certificaciones?.find((c) => c.id === examen?.certificacionId);
  const numIntentosRestante = (examen?.numIntentos || 0) - (certificacion?.meta?.pivot_intento || 0);

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay bg="gray_6" />

      <ModalContent maxW="56em" maxH="56em" bg="white">
        <ModalHeader color="black">
          <Flex w="100%" justify="space-between" align="center">
            <Box fontSize="18px" fontWeight="semibold" lineHeight="21px">
              ¿Estás seguro de que quieres abandonar la ventana?
            </Box>

            <Center boxSize="30px" rounded="50px" bg="gray_3">
              <Icon
                right="0"
                as={FaPlus}
                transform="rotate(45deg)"
                w="25px"
                h="25px"
                cursor="pointer"
                color="gray_6"
                _hover={{ color: 'gray_3' }}
                onClick={onClose}
              />
            </Center>
          </Flex>
        </ModalHeader>

        <ModalBody p="30px">
          <Flex direction="column" h="100%" justify="space-between">
            <Box fontSize="16px" pb="30px">
              ¡Vuelve al examen! Si detectamos que cambias de ventana,{' '}
              <strong>te descontaremos 5 minutos del tiempo restante</strong>. Recuerda que si se te acaba el tiempo, enviaremos
              las respuestas que hayas completado automáticamente.
            </Box>

            <Flex
              p="14px"
              w="100%"
              h="44px"
              maxH="44px"
              bg="gray_1"
              rounded="10px"
              align="center"
              justify="space-between"
              border="1px solid var(--chakra-colors-gray_3)"
            >
              <Box color="gray_4">Intentos Restantes</Box>
              <Flex fontWeight="bold" align="center" bg="gray_1">
                {numIntentosRestante} / {examen?.numIntentos || 0}
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>

        <ModalFooter gap="15px">
          <Button
            w="100%"
            p="15px 20px 15px 25px"
            bg="black"
            rounded="12px"
            fontSize="15px"
            fontWeight="bold"
            lineHeight="18px"
            color="white"
            _hover={{
              backgroundColor: 'cancel',
              opacity: 0.8,
            }}
            border="2px solid var(--chakra-colors-black)"
            onClick={onClose}
          >
            Continuar examen
          </Button>
        </ModalFooter>
      </ModalContent>
      {/* <ModalOverlay />

      <ModalContent maxW="56em" maxH="56em">
        <ModalHeader color="black">
          <Flex w="100%" position="relative" justify="center" align="center">
            <Box fontSize="18px" fontWeight="semibold" lineHeight="21px">
              ¿Estás seguro de que quieres abandonar la ventana?
            </Box>

            <Icon
              position="absolute"
              right="0"
              as={FaPlus}
              transform="rotate(45deg)"
              w="25px"
              h="25px"
              cursor="pointer"
              color="gray_4"
              _hover={{ color: 'gray_3' }}
              onClick={onClose}
            />
          </Flex>
        </ModalHeader>

        <ModalBody p="0px">
          <Flex p="30px" direction="column" align="center" gridRowGap="30px">
            <Box fontSize="16px" textAlign="center" lineHeight="140%">
              ¡Vuelve al examen! Si detectamos que cambias de ventana,{' '}
              <strong>te descontaremos 5 minutos del tiempo restante</strong>. Recuerda que si se te acaba el tiempo, enviaremos
              las respuestas que hayas completado automáticamente.
            </Box>

            <Flex p="20px 25px" w="fit-content" direction="column" justify="center" gap="10px" bg="gray_1" rounded="15px">
              <Box color="gray_4">Intentos Restantes</Box>

              <Flex fontWeight="extrabold" align="end">
                <Box fontSize="80px" lineHeight="95%" color={numIntentosRestante > 0 ? 'primary' : 'gray_5'}>
                  {numIntentosRestante}
                </Box>

                <Box fontSize="45px">/ {examen?.numIntentos || 0}</Box>
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>

        <ModalFooter gap="15px">
          <Button
            w="100%"
            p="15px 20px 15px 25px"
            bg="transparent"
            rounded="12px"
            fontSize="15px"
            fontWeight="bold"
            lineHeight="18px"
            border="2px solid var(--chakra-colors-gray_3)"
            onClick={onClose}
          >
            Continuar examen
          </Button>
        </ModalFooter>
      </ModalContent> */}
    </Modal>
  );
};

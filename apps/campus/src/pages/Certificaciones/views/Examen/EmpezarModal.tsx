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
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';

import { IExamen } from 'data';
import { LoginContext } from '../../../../shared/context';

export const EmpezarModal = ({
  examen,
  isOpen,
  onClose,
  onStart,
}: {
  examen?: IExamen;
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}) => {
  const { user } = useContext(LoginContext);

  const certificacion = user?.certificaciones?.find((c) => c.id === examen?.certificacionId);
  const numIntentosRestante = (examen?.numIntentos || 0) - (certificacion?.meta?.pivot_intento || 0);

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />

      <ModalContent maxW="56em" maxH="56em">
        <ModalHeader color="black">
          <Flex w="100%" position="relative" justify="center" align="center">
            <Box fontSize="18px" fontWeight="semibold" lineHeight="21px">
              ¿Estás preparado para iniciar el examen?
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
              Recuerda que <strong>vas a utilizar uno de los intentos disponibles</strong> para realizar el examen.
              <br />
              Ten en cuenta que si detectamos que cambias de ventana durante el examen,{' '}
              <strong>te descontaremos 5 minutos del tiempo total</strong>.
              <br />
              Además, si abandonas en mitad del examen también contará como si hubieras utilizado un intento y se descontará de
              los intentos disponibles del examen.
            </Box>

            <Flex p="20px 25px" w="fit-content" direction="column" justify="center" gap="10px" bg="gray_6" rounded="15px">
              <Box color="gray_4">Intentos Restantes</Box>

              <Flex fontWeight="extrabold" align="end">
                <Box fontSize="80px" lineHeight="95%" color={numIntentosRestante - 1 > 0 ? 'primary' : 'gray_5'}>
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
            onClick={onStart}
          >
            Empezar examen
          </Button>

          <Button
            w="100%"
            p="15px 20px 15px 25px"
            bg="gray_5"
            rounded="12px"
            fontSize="15px"
            fontWeight="bold"
            lineHeight="18px"
            color="white"
            _hover={{
              border: '2px solid var(--chakra-colors-gray_3)',
              backgroundColor: 'gray_3',
              opacity: 0.8,
            }}
            border="2px solid var(--chakra-colors-gray_3)"
            onClick={onClose}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

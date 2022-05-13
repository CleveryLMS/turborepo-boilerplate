import { useState, useEffect } from 'react';

import { BiTimeFive, BiCheck, BiRightArrowAlt, BiExit } from 'react-icons/bi';
import {
  Flex,
  Text,
  Box,
  Icon,
  Button,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react';

import { useCountdown } from 'utils';
import { AbandonarModal } from './AbandonarModal';
import { IntegridadModal } from './IntegridadModal';
import { ExamenProgress } from '../../../../shared/components';
import { IExamen, IRespuesta, IPregunta } from 'data';

export const ContenidoExamen = ({
  examen,
  nivel,
  onFinish,
}: {
  examen: IExamen;
  nivel?: number;
  onFinish: (respuestas: any, tiempoUtilizado: number) => void;
}) => {
  const { isOpen = true, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpen_Integridad, onOpen: onOpen_Integridad, onClose: onClose_Integridad } = useDisclosure();
  const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure();

  const [respuestas, setRespuestas] = useState<any>({});
  const [respuestaActual, setRespuestaActual] = useState<IRespuesta>();
  const [preguntaActualIndex, setPreguntaActualIndex] = useState<number>(1);
  const [preguntaActual, setPreguntaActual] = useState<IPregunta | undefined>(
    examen?.preguntas ? examen?.preguntas[0] : undefined
  );

  /**
   * true: No mostramos alerta para descontar 5min
   * false: Mostramos la alerta (Pondremos temporizador para 1s)
   */
  const [guardAbandon, setGuardAbandon] = useState<boolean>(false);
  const [preventAbandon, setPreventAbandon] = useState<boolean>(true);
  const [progress, minutes, seconds, secs, decrementSecs] = useCountdown(examen.duracion || 0);

  // !TODO RECUPERAR FUNCIONALIDAD. BORRADA EN REACT-ROUTER V.6
  // usePrompt(`¿Estás seguro de querer abandonar el examen?\nSi te marchas ahora, perderás un intento.`, preventAbandon);

  const onSiguientePregunta = () => {
    if (!respuestas || !preguntaActual?.id || !respuestaActual?.id) return;

    if ((examen.preguntas?.length || 0) > preguntaActualIndex) {
      setRespuestas({
        ...respuestas,
        [preguntaActual?.id]: respuestaActual?.id,
      });

      setRespuestaActual(undefined);
      setPreguntaActual(examen?.preguntas ? examen?.preguntas[preguntaActualIndex] : undefined);
      setPreguntaActualIndex(preguntaActualIndex + 1);
    } else {
      setPreventAbandon(false);
      onFinish({ ...respuestas, [preguntaActual?.id]: respuestaActual?.id }, examen.duracion * 60 - secs);
    }
  };

  useEffect(() => {
    window.onbeforeunload = preventAbandon ? onPreventAbandon : null;
    window.onpagehide = preventAbandon ? onPreventAbandon : null; // PARA SAFARI

    window.addEventListener('blur', onPreventSwitchTab);
    window.addEventListener('beforeunload', preventAbandon ? onPreventAbandon : () => {});
    window.addEventListener('pagehide', preventAbandon ? onPreventAbandon : () => {});

    return () => {
      window.removeEventListener('blur', onPreventSwitchTab);
      window.removeEventListener('beforeunload', onPreventAbandon);
      window.addEventListener('pagehide', onPreventAbandon);
    };
  }, [preventAbandon]);

  const onPreventAbandon = (e: any) => {
    var message = '¿Estás seguro de querer abandonar el examen?\nSi te marchas ahora, perderás un intento.',
      e = e || window.event;

    // For IE and Firefox
    if (e) e.returnValue = message;

    // For Safari
    return message;
  };

  const onPreventSwitchTab = () => {
    if (!guardAbandon) {
      setGuardAbandon(true);

      decrementSecs(60 * 5);
      onOpenAlert();

      setTimeout(() => setGuardAbandon(false), 1000);
    }
  };

  useEffect(() => {
    if (progress > 99.9) {
      setPreventAbandon(false);
      onFinish(respuestas, examen.duracion * 60 - secs);
    }
  }, [progress]);

  const handleWindowLeave = (e: any) => {
    const mouseY = e.clientY;
    const topValue = 0;

    if (mouseY < topValue) onOpen_Integridad();
  };

  useEffect(() => {
    // Intercom timeout initializer

    window.addEventListener('mouseout', handleWindowLeave, false);

    return () => {
      window.removeEventListener('mouseout', handleWindowLeave);
    };
  }, []);

  return (
    <Flex direction="column" w={{ base: 'auto', md: '100%' }} h="100%" overflow="auto" align="center" px="20px" pt="10px">
      <Flex h="70px" direction={{ base: 'column', sm: 'row' }} align="center" gap={{ base: '2px', sm: '14px' }} w="100%">
        <Button
          h="auto"
          bg="gray_3"
          leftIcon={<Icon as={BiExit} boxSize="18px" />}
          px="10px 16px"
          rounded="10px"
          fontSize="15px"
          minW="fit-content"
          fontWeight="bold"
          lineHeight="17px"
          onClick={onOpen}
          _hover={{
            border: '2px solid var(--chakra-colors-gray_4)',
            backgroundColor: 'gray_4',
            opacity: 0.8,
          }}
        >
          Salir de la prueba
        </Button>

        <Flex w="100%" justify="center" align="center" pt="10px" direction="column">
          <ExamenProgress value={(preguntaActualIndex / (examen.preguntas?.length || 0)) * 100} />
        </Flex>

        <Flex minW="fit-content" align="center" gridColumnGap="10px" pt="10px">
          <Icon as={BiTimeFive} boxSize="21px" />

          <Text variant="h2_heading">{`${minutes}:${seconds}`}</Text>
        </Flex>
      </Flex>

      <Flex
        boxSize="100%"
        bg="white"
        marginTop="34px"
        justify="center"
        gap="80px"
        roundedTop="20px"
        border="1px solid"
        borderColor="gray_3"
        pl="10px"
        pr="10px"
        pt="10px"
      >
        <Flex w="100%" direction="column" gap="40px" align="center">
          <Box fontSize="16px" fontWeight="bold" lineHeight="19px" color="gray_4" letterSpacing="0.115em">
            PREGUNTA {preguntaActualIndex}/{examen.preguntas?.length || 0}
          </Box>

          <Flex>
            <Text variant="h2_heading" textAlign="center" userSelect="none">
              {preguntaActual?.contenido}
            </Text>
          </Flex>

          <Flex direction="column" h="100%" w="100%" maxW="850px" gridRowGap="10px">
            {preguntaActual?.respuestas?.map((respuesta: IRespuesta, index: number) => (
              <Button
                h="auto"
                w="100%"
                p="18px 24px"
                rounded="12px"
                display="flex"
                gridColumnGap="24px"
                key={'examen-respuesta-' + respuesta.id}
                onClick={() => setRespuestaActual(respuesta)}
                color={respuestaActual?.id === respuesta.id ? 'white' : 'black'}
                bg={respuestaActual?.id === respuesta.id ? 'primary' : 'transparent'}
                border="2px solid"
                borderColor={respuestaActual?.id === respuesta.id ? 'primary' : 'gray_3'}
              >
                <Center boxSize="26px" bg="gray_2" fontWeight="bold" fontSize="18px" color="gray_4" rounded="6px">
                  {index + 1}
                </Center>

                <Box w="100%" textAlign="start" fontSize="15px" whiteSpace="break-spaces" userSelect="none">
                  {respuesta.contenido}
                </Box>

                {respuestaActual?.id === respuesta.id && <Icon as={BiCheck} boxSize="24px" />}
              </Button>
            ))}
            <Flex boxSize="100%" p="18px 40px" bg="white" justify="center">
              <Button
                h="43px"
                rounded="54px"
                bg={respuestaActual ? 'primary' : 'gray_3'}
                color={respuestaActual ? 'white' : undefined}
                fontSize="21px"
                w="fit-content"
                minW="300px"
                maxW="300px"
                lineHeight="25px"
                fontWeight="extrabold"
                p="20px 30px 20px 35px"
                onClick={onSiguientePregunta}
                isDisabled={!respuestaActual}
                rightIcon={<Icon boxSize="24px" as={BiRightArrowAlt} />}
              >
                {preguntaActualIndex === examen?.preguntas?.length ? 'Terminar examen' : 'Siguiente pregunta'}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <AbandonarModal
        examen={examen}
        isOpen={isOpen}
        onClose={onClose}
        onAbandonExam={() => {
          onFinish(respuestas, examen.duracion * 60 - secs);
          onClose();
        }}
      />

      <IntegridadModal examen={examen} isOpen={isOpen_Integridad} onClose={onClose_Integridad} />

      <Modal isOpen={isOpenAlert} onClose={onCloseAlert} isCentered>
        <ModalOverlay />
        <ModalContent ml="1.25rem" mr="1.25rem">
          <ModalHeader>Aviso</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Hemos descontado 5 minutos del tiempo del examen</ModalBody>

          <ModalFooter>
            <Button bg="cancel" color="white" mr={3} onClick={onCloseAlert}>
              Aceptar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

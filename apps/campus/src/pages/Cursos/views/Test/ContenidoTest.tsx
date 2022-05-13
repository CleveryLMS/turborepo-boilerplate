import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Text, Flex, Box, Icon, Button, Center } from '@chakra-ui/react';
import { BiTimeFive, BiCheck, BiRightArrowAlt, BiExit } from 'react-icons/bi';

import { useCountdown } from 'utils';
import { ExamenProgress } from '../../../../shared/components';
import { IExamen, IRespuesta, IPregunta, ICurso } from 'data';

export const ContenidoTest = ({
  test,
  curso,
  onFinish,
}: {
  test: IExamen;
  curso?: ICurso;
  onFinish: (respuestas: any, tiempoUtilizado: number) => void;
}) => {
  const navigate = useNavigate();

  const [respuestas, setRespuestas] = useState<any>({});
  const [respuestaActual, setRespuestaActual] = useState<IRespuesta>();
  const [preguntaActualIndex, setPreguntaActualIndex] = useState<number>(1);
  const [preguntaActual, setPreguntaActual] = useState<IPregunta | undefined>(test?.preguntas ? test?.preguntas[0] : undefined);

  /**
   * true: No mostramos alerta para descontar 5min
   * false: Mostramos la alerta (Pondremos temporizador para 1s)
   */
  const [progress, minutes, seconds, secs, decrementSecs] = useCountdown(test.duracion || 0);

  const onSiguientePregunta = () => {
    if (!respuestas || !preguntaActual?.id || !respuestaActual?.id) return;

    if (test?.preguntas && (test?.preguntas?.length || 0) > preguntaActualIndex) {
      setRespuestas({
        ...respuestas,
        [preguntaActual?.id]: respuestaActual?.id,
      });

      setRespuestaActual(undefined);
      setPreguntaActual(test.preguntas[preguntaActualIndex]);
      setPreguntaActualIndex(preguntaActualIndex + 1);
    } else {
      onFinish({ ...respuestas, [preguntaActual?.id]: respuestaActual?.id }, test.duracion * 60 - secs);
    }
  };

  useEffect(() => {
    if (progress > 99.9) onFinish(respuestas, test.duracion * 60 - secs);
  }, [progress]);

  return (
    <Flex direction="column" boxSize="100%" overflow="hidden">
      <Flex h="70px" align="center" p="18px 40px 12px" gap="26px">
        <Button
          h="auto"
          bg="gray_3"
          leftIcon={<Icon as={BiExit} boxSize="18px" />}
          p="10px 16px"
          rounded="10px"
          fontSize="15px"
          minW="fit-content"
          fontWeight="bold"
          lineHeight="17px"
          onClick={() => navigate(`/curso/${curso?.id}`)}
          _hover={{
            border: '2px solid var(--chakra-colors-gray_4)',
            backgroundColor: 'gray_4',
            opacity: 0.8,
          }}
        >
          Salir de la prueba
        </Button>

        <ExamenProgress value={(preguntaActualIndex / (test.preguntas?.length || 0)) * 100} />

        <Flex minW="fit-content" align="center" gridColumnGap="10px">
          <Icon as={BiTimeFive} boxSize="21px" />

          <Text variant="h2_heading">{`${minutes}:${seconds}`}</Text>
        </Flex>
      </Flex>

      <Flex
        boxSize="100%"
        bg="white"
        m="34px 34px 0px 34px"
        p="0px 90px"
        align="center"
        justify="center"
        gap="80px"
        rounded="20px 20px 0px 0px"
        border="1px solid"
        borderColor="gray_3"
      >
        <Flex w="100%" direction="column" gap="40px" align="center">
          <Box fontSize="16px" fontWeight="bold" lineHeight="19px" color="gray_4" letterSpacing="0.115em">
            PREGUNTA {preguntaActualIndex}/{test.preguntas?.length}
          </Box>

          <Box fontSize="18px" lineHeight="22px" textAlign="center" fontWeight="bold" userSelect="none">
            {preguntaActual?.contenido}
          </Box>

          <Flex direction="column" w="100%" maxW="850px" gridRowGap="10px">
            {preguntaActual?.respuestas?.map((respuesta: IRespuesta, index: number) => (
              <Button
                w="100%"
                h="auto"
                p="18px 24px"
                rounded="12px"
                display="flex"
                gridColumnGap="24px"
                key={'test-respuesta-' + respuesta.id}
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
          </Flex>
        </Flex>
      </Flex>

      <Flex w="100%" h="88px" p="18px 40px" bg="white" border="1px solid" borderColor="gray_3" justify="center">
        <Button
          h="auto"
          rounded="54px"
          bg={respuestaActual ? 'primary' : 'gray_3'}
          color={respuestaActual ? 'white' : undefined}
          fontSize="21px"
          w="fit-content"
          lineHeight="25px"
          fontWeight="extrabold"
          p="20px 30px 20px 35px"
          onClick={onSiguientePregunta}
          isDisabled={!respuestaActual}
          rightIcon={<Icon boxSize="24px" as={BiRightArrowAlt} />}
        >
          {preguntaActualIndex === test?.preguntas?.length ? 'Terminar test' : 'Siguiente pregunta'}
        </Button>
      </Flex>
    </Flex>
  );
};

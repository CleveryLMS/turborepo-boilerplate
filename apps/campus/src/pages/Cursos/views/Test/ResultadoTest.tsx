import { useNavigate } from 'react-router-dom';

import { Flex, Box, Button, Icon } from '@chakra-ui/react';
import { BiRevision, BiRightArrowAlt } from 'react-icons/bi';

import { IExamen } from 'data';

export const ResultadoTest = ({
  test,
  aprobado,
  resultado,
  onRestart,
}: {
  test: IExamen;
  aprobado: boolean;
  resultado?: { totalCorrectas: number; totalPreguntas: number };
  onRestart: () => void;
}) => {
  const navigate = useNavigate();

  return (
    <Flex w="100%" p="34px" h="100%" align="center" justify="center">
      <Flex direction="column" boxSize="100%" bg="white" rounded="15px" align="center" justify="center" minH="500px">
        <Flex direction="column" align="center" justify="center">
          <Box fontWeight="bold" fontSize="28px" mb="10px">
            {aprobado ? '¡Has superado el examen!' : 'Vaya...'}
          </Box>

          <Box fontWeight="bold" fontSize="17px" mb="50px">
            {aprobado
              ? `¡Enhorabuena! Has logrado superar el ${test?.nombre}.`
              : `No has logrado superar el examen, ¡pero no te rindas!`}
          </Box>

          {!aprobado && (
            <Flex align="center" fontSize="21px" fontWeight="semibold" lineHeight="20px" mb="40px">
              Respuestas correctas: {resultado?.totalCorrectas || 0}/{resultado?.totalPreguntas || 0}
            </Flex>
          )}

          <Flex w="fit-content" direction="column" mt="35px" align="center" gap="10px">
            {!aprobado && (
              <Button
                w="100%"
                bg="transparent"
                rounded="12px"
                fontSize="16px"
                lineHeight="19px"
                fontWeight="extrabold"
                p="15px 20px 15px 25px"
                border="2px solid var(--chakra-colors-gray_3)"
                rightIcon={<Icon as={BiRevision} w="21px" h="21px" />}
                onClick={onRestart}
              >
                Intentar de nuevo
              </Button>
            )}

            <Button
              bg="gray_4"
              color="white"
              rounded="12px"
              fontSize="16px"
              lineHeight="19px"
              fontWeight="extrabold"
              p="15px 20px 15px 25px"
              rightIcon={<Icon as={BiRightArrowAlt} w="21px" h="21px" />}
              onClick={() => navigate(`/cursos/${test.cursoId}`)}
            >
              Volver al curso
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

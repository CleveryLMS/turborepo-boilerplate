import { BiPlay } from 'react-icons/bi';
import { Button, Flex, Icon, Image, Text } from '@chakra-ui/react';

import { OpenParser } from 'ui';
import { ICurso, ILeccion } from 'data';

import bgPortada from '../../../../assets/cursos/bgPortadaLeccion.svg';

export const HeaderCurso = ({
  curso,
  leccion,
  onContinueLeccion,
}: {
  curso: ICurso;
  leccion: ILeccion;
  onContinueLeccion: () => void;
}) => {
  return (
    <Flex
      w="100%"
      h="420px"
      roundedTop="20px"
      justify="space-between"
      bgImage={bgPortada}
      bgSize="cover"
      direction="column"
      position="relative"
    >
      <Flex
        h="45px"
        w="100%"
        bg="rgba(18, 22, 37, 0.5)"
        padding="15px 22px"
        roundedTop="20px"
        textTransform="uppercase"
        fontWeight="semibold"
        fontSize="12px"
        color="#fff"
      >
        {curso?.meta?.progreso_count
          ? curso?.meta?.progreso_count > 0
            ? 'Continúa por donde lo dejaste...'
            : 'Empieza la primera lección...'
          : 'Empieza la primera lección...'}
      </Flex>

      {curso?.icono && <Image left="70%" boxSize="435px" position="absolute" src={`data:image/svg+xml;utf8,${curso?.icono}`} />}

      <Flex p="42px" direction="column" boxSize="100%">
        <Flex direction="column" w="80%" h="100%" gap="20px">
          <Text fontSize="38px" fontWeight="bold" color="#fff" lineHeight="42px">{`${leccion?.modulo?.orden || ''}.${
            leccion?.orden || ''
          }.${leccion?.titulo || ''}`}</Text>

          <Text fontSize="16px" color="#fff" opacity={0.75} lineHeight="22px">
            <OpenParser value={leccion?.descripcion || ''} />
          </Text>
        </Flex>

        <Button
          p="15px 24px 15px 15px"
          w="227px"
          h="62px"
          color="white"
          fontSize="18px"
          fontWeight="bold"
          onClick={onContinueLeccion}
          data-cy="cursos_landing_continuar-portada"
          leftIcon={<Icon boxSize="20px" as={BiPlay} />}
          border="1px solid rgba(255, 255, 255, 0.15)"
          bg="rgba(255, 255, 255, 0.15)"
          rounded="22px"
          _hover={{ bg: 'var(--chakra-colors-primary_dark)' }}
          backdropFilter="auto"
          backdropBlur="45px"
          isDisabled={
            !curso?.modulos || (curso?.modulos?.length || 0) === 0 || (curso?.modulos[0].lecciones?.length || 0) === 0
          }
        >
          {curso?.meta?.progreso_count
            ? curso?.meta?.progreso_count > 0
              ? 'Continuar curso'
              : 'Empezar curso'
            : 'Empezar curso'}
        </Button>
      </Flex>
    </Flex>
  );
};

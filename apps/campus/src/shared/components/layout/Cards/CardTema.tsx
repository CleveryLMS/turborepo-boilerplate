import { useEffect } from 'react';

import { Box, Center, Flex, Icon, Skeleton, Text } from '@chakra-ui/react';
import { BiBox, BiError, BiChat, BiCommentDetail } from 'react-icons/bi';

import { IForoTema } from 'data';

export const CardTema = ({ tema, index, isLoading = false }: { tema: IForoTema; index: number; isLoading?: boolean }) => {
  const getTemaBg = () => {
    switch (tema.titulo) {
      case 'General':
        return 'linear-gradient(99.9deg, #32D5A4 2.1%, #32D5D5 109.65%)';
      case 'Errores':
        return 'linear-gradient(98.96deg, #EC555E -3.33%, #C72D64 113.09%)';
      case 'Proyectos':
        return 'linear-gradient(97.33deg, #2834BA -0.11%, #3966DB 105.93%)';
      default:
        return 'secondary_black';
    }
  };

  const getTemaHover = () => {
    switch (tema.titulo) {
      case 'General':
        return 'linear-gradient(99.9deg, #32D5D5 2.1%,  #32D5A4 109.65%)';

      case 'Errores':
        return 'linear-gradient(98.96deg, #C72D64 -3.33%, #EC555E 113.09%)';
      case 'Proyectos':
        return 'linear-gradient(97.33deg, #3966DB -0.11%, #2834BA 105.93%)';
      default:
        return 'secondary_black';
    }
  };

  const getTemaIcon = () => {
    switch (tema.titulo) {
      case 'General':
        return (
          <Center boxSize="45px" rounded="57px" bg="#23ADA5">
            <Icon as={BiCommentDetail} boxSize="28px" color="#fff" />
          </Center>
        );
      case 'Errores':
        return (
          <Center boxSize="45px" rounded="57px" bg="#B21E50">
            <Icon as={BiError} boxSize="28px" color="#fff" />
          </Center>
        );
      case 'Proyectos':
        return (
          <Center boxSize="45px" rounded="57px" bg="#1B2382">
            <Icon as={BiBox} boxSize="28px" color="#fff" />
          </Center>
        );
      default:
        return (
          <Center boxSize="45px" rounded="57px" bg="primary_light">
            <Box fontSize="27px" fontWeight="semibold" lineHeight="43px" color="primary">
              {index - 2}
            </Box>
          </Center>
        );
    }
  };

  return (
    <Skeleton w="100%" isLoaded={!isLoading}>
      <Flex direction="column" w="100%" data-cy={`${tema.id}_tema_foro`}>
        <Flex
          roundedTop="12px"
          p="20px 24px"
          gap="20px"
          bg={getTemaBg()}
          align="center"
          _hover={{ bg: getTemaHover(), opacity: '0.9' }}
          transition="all 0.3s linear"
        >
          {getTemaIcon()}

          <Text data-cy={`titulo_modulo_foro_${tema.id}`} isTruncated variant="card_title" color="#fff" title={tema?.titulo}>
            {tema.titulo}
          </Text>
        </Flex>

        <Flex direction="column" justify="space-between" p="24px" h="100%" gap="30px">
          <Text data-cy={`descripcion_modulo_foro_${tema.id}`} isTruncated variant="card_description" title={tema?.descripcion}>
            {tema.descripcion}
          </Text>

          <Flex gap="5px" align="center">
            <Icon as={BiChat} boxSize="20px" color="gray_6" />

            <Box fontWeight="semibold" fontSize="13px" lineHeight="16px" color="gray_4">
              {tema.meta?.totalPreguntas || 0} preguntas
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Skeleton>
  );
};

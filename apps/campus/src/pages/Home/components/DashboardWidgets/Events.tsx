import { useNavigate } from 'react-router-dom';

import { es } from 'date-fns/locale';
import { format, addMonths } from 'date-fns';
import { Spinner, Flex, Box } from '@chakra-ui/react';

import { useLeccionesCalendario } from 'data';

export const EventsWidget = () => {
  const navigate = useNavigate();

  const { eventos, isLoading: isLoadingEventos } = useLeccionesCalendario({
    strategy: 'invalidate-on-undefined',
    query: [
      { limit: 3 },
      { fecha_inicio: format(new Date(), 'yyyy-MM-dd', { locale: es }) },
      {
        fecha_fin: format(addMonths(new Date(), 1), 'yyyy-MM-dd', {
          locale: es,
        }),
      },
    ],
  });

  return isLoadingEventos ? (
    <Spinner />
  ) : (eventos?.length || 0) > 0 ? (
    <Flex direction="column" gap="20px">
      <Box fontWeight="bold" fontSize="18px">
        Próximos eventos
      </Box>

      <Flex w="100%" direction="column" rounded="20px" bg="white" p="12px" border="1px solid var(--chakra-colors-gray_3)">
        {eventos?.map((evento: any, index: number) => (
          <Flex
            p="12px"
            align="start"
            gap="18px"
            cursor="pointer"
            key={`events_widget-item-${index}`}
            onClick={() => navigate(`/cursos/${evento?.modulo?.cursoId}/leccion/${evento?.id}`)}
          >
            <Flex
              h="60px"
              minW="60px"
              bg="rgba(40, 52, 186, 0.15)"
              gap="6px"
              rounded="9px"
              align="center"
              justify="center"
              direction="column"
            >
              <Box fontSize="21px" lineHeight="16px" fontWeight="bold">
                {format(new Date(evento.fechaPublicacion), 'dd')}
              </Box>

              <Box fontSize="13px" lineHeight="10px" fontWeight="semibold" textTransform="uppercase" color="secondary_dark">
                {format(new Date(evento.fechaPublicacion), 'LLL')}
              </Box>
            </Flex>

            <Flex w="100%" direction="column" gap="6px" overflow="hidden">
              <Flex direction="column" fontSize="16px" gap="5px" title={evento?.modulo?.curso?.titulo + ' - ' + evento.titulo}>
                <Box fontWeight="bold">{evento?.modulo?.curso?.titulo}</Box>

                <Box>{evento.titulo}</Box>
              </Flex>

              <Box fontSize="14px" color="gray_4">
                {format(new Date(evento.fechaPublicacion), 'HH:mm')}h
              </Box>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  ) : null;
};

import { useNavigate } from 'react-router-dom';

import { es } from 'date-fns/locale';
import { formatDistance } from 'date-fns';
import { Box, Flex, Icon, Skeleton } from '@chakra-ui/react';
import { BiBook, BiUnite, BiX, BiBadgeCheck, BiConversation } from 'react-icons/bi';

import { INotificacion, updateNotificacion, NotificacionOrigenEnum } from 'data';
import { OpenParser } from 'ui';

export const NotificationItem = ({
  isLoading,
  notificacion,
  onRemove = () => {},
}: {
  isLoading?: boolean;
  notificacion?: INotificacion;
  onRemove?: (id?: string | number) => void;
}) => {
  const navigate = useNavigate();

  const getNotiIcon = () => {
    if (!notificacion) return;

    switch (notificacion.origen) {
      case NotificacionOrigenEnum.CURSO:
        return BiBook;
      case NotificacionOrigenEnum.CERTIFICACION:
        return BiBadgeCheck;
      case NotificacionOrigenEnum.TEMA:
      case NotificacionOrigenEnum.PREGUNTA:
        return BiConversation;
      default:
        return BiUnite;
    }
  };

  const onClick = () => {
    if (!notificacion) return;

    switch (notificacion?.origen) {
      case NotificacionOrigenEnum.CURSO:
        let [tipo_Cu, id_Cu] = notificacion?.relaciones[0]?.split('-');

        navigate('/cursos/' + id_Cu);
        break;
      case NotificacionOrigenEnum.CERTIFICACION:
        let [tipo_Ce, id_Ce] = notificacion?.relaciones[0]?.split('-');

        navigate('/certificaciones/' + id_Ce);
        break;

      case NotificacionOrigenEnum.TEMA:
        let [tipo_Tema, id_Tema] = notificacion?.relaciones[1]?.split('-');

        navigate(`/foro/${id_Tema}`);
        break;
      case NotificacionOrigenEnum.PREGUNTA:
        let [tipo_PreTema, id_PreTema] = notificacion?.relaciones[1]?.split('-');
        let [tipo_Pregunta, id_Pregunta] = notificacion?.relaciones[2]?.split('-');

        navigate(`/foro/${id_PreTema}/${id_Pregunta}`);
        break;
      default:
        break;
    }
  };

  const handleRemove = (e: any) => {
    e.stopPropagation();

    if (notificacion?.id) {
      // Borramos de la UI
      onRemove(notificacion?.id);

      // Borramos en la BBDD
      updateNotificacion({ id: notificacion?.id });
    }
  };

  return (
    <Skeleton isLoaded={!isLoading} rounded="10px">
      <Flex
        className="notificacion-item"
        p="15px"
        gap="12px"
        rounded="10px"
        cursor="pointer"
        direction="column"
        onClick={onClick}
        bg="rgba(255, 255, 255, 0.6)"
        boxShadow="0px 9px 19px -12px rgba(17, 24, 39, 0.05)"
        _hover={{
          bg: 'white',
          boxShadow: '0px 9px 19px -12px rgba(17, 24, 39, 0.05), 0px 2px 28px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Flex gap="6px" align="center">
          <Icon mr="2px" as={getNotiIcon()} boxSize="21px" color="primary_dark" />

          <Box fontSize="12px" fontWeight="bold" lineHeight="16px" color="primary_dark">
            {notificacion?.origen}
          </Box>

          <Box color="gray_2" fontSize="12px" lineHeight="16px" fontWeight="medium">
            {notificacion?.tipo || ''}
          </Box>

          <Box
            color="gray_5"
            fontSize="12px"
            lineHeight="16px"
            fontWeight="medium"
            sx={{ '.notificacion-item:hover &': { display: 'none' } }}
          >
            {notificacion?.createdAt &&
              formatDistance(new Date(notificacion?.createdAt), new Date(), {
                locale: es,
              })}
          </Box>

          <Icon
            ml="auto"
            as={BiX}
            color="gray_6"
            display="none"
            boxSize="21px"
            cursor="pointer"
            onClick={handleRemove}
            sx={{ '.notificacion-item:hover &': { display: 'flex' } }}
          />
        </Flex>

        <Flex direction="column" gap="4px">
          <Box color="black" fontSize="15px" lineHeight="20px" fontWeight="medium">
            {notificacion?.titulo}
          </Box>

          <Box color="gray_5" fontSize="13px" lineHeight="20px" overflow="hidden" textOverflow="ellipsis">
            <OpenParser value={notificacion?.contenido || ''} />
          </Box>
        </Flex>
      </Flex>
    </Skeleton>
  );
};

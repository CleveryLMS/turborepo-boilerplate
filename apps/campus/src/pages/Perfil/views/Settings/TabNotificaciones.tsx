import { Flex, Box, useToast } from '@chakra-ui/react';
import { PerfilCheckbox } from '../../components/PerfilCheckbox';

export const TabNotificaciones = () => {
  return (
    <Flex direction="column">
      <Box fontSize="18px" fontWeight="bold" mb="27.5px">
        Vías de notificación
      </Box>

      <Flex direction="column">
        <PerfilCheckbox
          isDisabled
          name="campus"
          onChange={console.log}
          title="Recibir notificaciones por el campus"
        />

        <PerfilCheckbox
          name="push"
          onChange={console.log}
          title="Recibir notificaciones push"
        />

        <PerfilCheckbox
          name="discord"
          onChange={console.log}
          title="Recibir notificaciones por discord"
        />

        <PerfilCheckbox
          name="email"
          onChange={console.log}
          title="Recibir notificaciones por email"
        />
      </Flex>
    </Flex>
  );
};

import { useContext } from 'react';

import { useColorMode, Flex, Box } from '@chakra-ui/react';

import { updateUser } from 'data';
import { PerfilSelect } from '../../components';
import { LoginContext, ThemeContext } from '../../../../shared/context';

export const TabApariencia = () => {
  const { user } = useContext(LoginContext);
  const { themeMode, setThemeMode } = useContext(ThemeContext);

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex direction="column">
      <Box fontSize="18px" fontWeight="bold" mb="27.5px">
        Apariencia
      </Box>

      <PerfilSelect
        name="tema"
        label="Tema de la Interfaz"
        onChange={(e: any) => {
          if (colorMode !== e && user?.id) {
            setThemeMode(themeMode === 'light' ? 'dark' : 'light');

            updateUser({
              id: user?.id,
              user: {
                preferencias: {
                  ...(user?.preferencias || {}),
                  theme: themeMode === 'light' ? 'dark' : 'light',
                },
              },
            });

            toggleColorMode();
          }
        }}
        defaultValue={{
          label: themeMode === 'light' ? 'Tema claro 🔆' : 'Tema oscuro 🌙',
          value: themeMode,
        }}
        options={[
          { label: 'Tema claro 🔆', value: 'light' },
          { label: 'Tema oscuro 🌙', value: 'dark' },
        ]}
      />
    </Flex>
  );
};

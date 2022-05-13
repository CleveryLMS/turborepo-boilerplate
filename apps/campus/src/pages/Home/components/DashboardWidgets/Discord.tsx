import { useContext, useEffect, useState } from 'react';

import { Icon, Flex, Text, Image, Button, useToast, CloseButton, IconButton } from '@chakra-ui/react';

import { BsDiscord } from 'react-icons/bs';
import { onFailure } from 'utils';
import { getUserByID, updateUser } from 'data';
import { LoginContext } from '../../../../shared/context';

import BgDiscord from '../../../../assets/home/DiscordWidgetBG.png';

export const DiscordWidget = () => {
  const toast = useToast();

  const { user, setUser } = useContext(LoginContext);

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user?.preferencias?.showDiscord === false || process.env.NX_SHOW_DISCORD === 'FALSE') setOpen(false);
    else setOpen(true);
  }, [user]);

  const closeDiscord = () => {
    if (!user?.id) {
      onFailure(toast, 'Error inesperado', 'El ID de usuario es undefined. Por favor, contacte con soporte.');
      return;
    }

    setOpen(false);

    updateUser({
      id: user.id,
      user: {
        preferencias: {
          ...(user?.preferencias || {}),
          showDiscord: false,
        },
      },
    })
      .then(async (res) => {
        const dataUser = await getUserByID({ id: user.id || 0 });

        if (!dataUser.isAxiosError) setUser({ ...dataUser });
        else console.error({ error: dataUser });
      })
      .catch((err) => console.error({ err }));
  };

  return !open ? null : (
    <Flex
      h={{ base: 'fit-content', md: '278px' }}
      minH={{ base: 'fit-content', md: '278px' }}
      rounded={{ base: 'none', md: '2xl' }}
      overflow="hidden"
      direction="column"
      justify="space-between"
      bg="linear-gradient(180deg, #443DBD 0%, #2B38AF 100%)"
      position="relative"
    >
      <Flex
        p="28px"
        gap="28px"
        w="100%"
        direction={{ base: 'row-reverse', md: 'column' }}
        justify="space-between"
        align={{ base: 'center', md: 'start' }}
        zIndex={{ base: 10, md: '' }}
      >
        <Flex w={{ base: 'fit-content', md: '100%' }} justify={{ base: 'center', md: 'space-between' }}>
          <Text color="#fff" fontSize="14px" decoration="none" display={{ base: 'none', md: 'flex' }}>
            OpenBootcamp Discord
          </Text>

          <CloseButton
            zIndex="10"
            color="#fff"
            bgColor={{ base: 'rgba(255, 255, 255, 0.16)', md: 'transparent' }}
            rounded="full"
            boxSize={{ base: '44px', md: '10px' }}
            onClick={closeDiscord}
            _hover={{ opacity: 0.8 }}
          />
        </Flex>

        <Text color="#fff" fontSize={{ base: '16px', md: '24px' }} decoration="none" textTransform="uppercase" w="100%">
          Aprende y Comparte en <strong>Comunidad</strong>
        </Text>

        <a target="_blank" rel="noreferrer" style={{ width: 'fit-content' }} href={process.env.NX_DISCORD_INVITATION}>
          <Button
            bg="#475AE1"
            w="fit-content"
            rounded="12px"
            color="white"
            fontSize="16px"
            fontWeight="bold"
            lineHeight="16px"
            _hover={{ opacity: '0.8' }}
            rightIcon={<Icon as={BsDiscord} />}
            display={{ base: 'none', md: 'flex' }}
          >
            Ir a Discord
          </Button>

          <IconButton
            icon={<Icon as={BsDiscord} boxSize="40px" />}
            aria-label="Ir a Discord"
            bg="transparent"
            color="#fff"
            _hover={{ opacity: '0.8' }}
            display={{ base: 'flex', md: 'none' }}
          />
        </a>
      </Flex>

      <Image
        w="100%"
        src={BgDiscord}
        zIndex={{ base: 0, md: '' }}
        opacity={{ base: '0.5', md: '1' }}
        position={{ base: 'absolute', md: 'static' }}
      />
    </Flex>
  );
};

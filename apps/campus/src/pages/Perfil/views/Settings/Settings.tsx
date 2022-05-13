import { useContext, useState } from 'react';

import { BiCloud, BiTrashAlt } from 'react-icons/bi';
import { Box, Flex, Icon, Button, IconButton, TabList, Tab, Tabs, TabPanels, TabPanel, useToast } from '@chakra-ui/react';

import { TabRuta } from './TabRuta';
import { TabDatos } from './TabDatos';
import { TabAdmin } from './TabAdmin';
import { TabApariencia } from './TabApariencia';

import {
  IPais,
  IEstado,
  UserRolEnum,
  updateUser,
  getUserByID,
  removeAvatar,
  uploadAvatar,
  enableUser2FA,
  checkIfUsernameExists,
} from 'data';
import { onFailure } from 'utils';
import { PerfilInput } from '../../components';
import { OpenAvatarUploader } from '../../../../shared/components';
import { LayoutContext, LoginContext } from '../../../../shared/context';

const PerfilSettings = () => {
  const toast = useToast();
  const { isMobile } = useContext(LayoutContext);
  const { user, setUser } = useContext(LoginContext);

  const [pending, setPending] = useState<boolean>(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);

  //CUENTA
  const [qr2FA, setQR2FA] = useState<string>(user?.config2fa?.qr || '');
  const [fullName, setFullName] = useState<string>(user?.fullName || '');
  const [username, setUsername] = useState<string>(user?.username || '');

  //DATOS
  const [pais, setPais] = useState<IPais | null>(user?.pais || null);
  const [estado, setEstado] = useState<IEstado | null>(user?.estado || null);
  const [trabajoRemoto, setTrabajoRemoto] = useState<boolean>(user?.trabajoRemoto || false);
  const [posibilidadTraslado, setPosibilidadTraslado] = useState<boolean>(user?.posibilidadTraslado || false);

  const updateValue = () => {
    if (!user?.id) {
      onFailure(toast, 'Error inesperado', 'El ID de usuario es undefined. Por favor, contacte con soporte.');
      return;
    }

    return updateUser({
      id: user.id,
      user: {
        nombre: (fullName?.split(' ') || [' '])[0],
        apellidos: (fullName?.split(' ') || [' ', ' ']).splice(1).toString().replaceAll(',', ' '),
        paisId: pais?.id,
        estadoId: estado?.id,
        username: username !== user.username ? username : undefined,
        trabajoRemoto: trabajoRemoto,
        posibilidadTraslado: posibilidadTraslado,
      },
    })
      .then(async (res) => {
        const dataUser = await getUserByID({ id: user?.id || 0 });

        if (!dataUser.isAxiosError) {
          setUser({ ...dataUser });
          setPending(false);
        } else console.error({ error: dataUser });
      })
      .catch((err) => console.error({ err }));
  };

  const onAvatarLoad = async (data: any) => {
    if (!user?.id) {
      onFailure(toast, 'Error inesperado', 'El ID de usuario es undefined. Por favor, contacte con soporte.');
      return;
    }

    const dataUser = await getUserByID({ id: user.id });

    if (!dataUser.isAxiosError) {
      await setUser({ ...dataUser });
      await setPending(false);
    } else console.error({ error: dataUser });
  };

  const onAvatarRemove = async () => {
    if (!user?.id) {
      onFailure(toast, 'Error inesperado', 'El ID de usuario es undefined. Por favor, contacte con soporte.');
      return;
    }

    setIsUploadingAvatar(true);

    await removeAvatar({ id: user?.id })
      .then(async () => {
        const dataUser = await getUserByID({ id: user?.id || 0 });

        if (!dataUser.isAxiosError) {
          setUser({ ...dataUser });
          setPending(false);
        } else console.error({ error: dataUser });
      })
      .catch((err) => console.error({ err }));
    setIsUploadingAvatar(false);
  };

  const handleUpload = async (acceptedFiles: File[]) => {
    setIsUploadingAvatar(true);

    const data = await uploadAvatar({ files: acceptedFiles });
    await onAvatarLoad(data);

    setIsUploadingAvatar(false);
  };

  const enable2FA = () => {
    enableUser2FA().then((res) => setQR2FA(res.data.qr));
  };

  const validateUsername = async (value: string) => {
    let error;
    const res: any = await checkIfUsernameExists({ username: value });

    if (res?.data?.exists !== false) error = res.data.message;

    return error;
  };

  return (
    <Flex w="100%" p={{ base: '20px', sm: '71px' }} direction="column" h="100%" justify="space-between">
      <Tabs h="100%" variant="unstyled">
        <Flex h="100%" direction={{ base: 'column', md: 'row' }}>
          <TabList w={{ base: '100%', md: '225px' }}>
            <Flex wrap="wrap" direction={{ base: 'row', md: 'column' }} w="100%" maxW={{ base: '100%', md: '225px' }}>
              <Tab
                fontSize="16px"
                fontWeight="bold"
                _focus={{ outline: 'none' }}
                _selected={{
                  width: 'fit-content',
                  color: 'primary',
                  bg: 'primary_light',
                  rounded: '8px',
                }}
              >
                <Box w="100%" textAlign="start">
                  Cuenta
                </Box>
              </Tab>

              <Tab
                fontSize="16px"
                fontWeight="bold"
                _focus={{ outline: 'none' }}
                _selected={{
                  rounded: '8px',
                  color: 'primary',
                  bg: 'primary_light',
                }}
              >
                <Box w="100%" textAlign="start">
                  Datos
                </Box>
              </Tab>

              <Tab
                fontSize="16px"
                fontWeight="bold"
                _focus={{ outline: 'none' }}
                _selected={{
                  rounded: '8px',
                  color: 'primary',
                  bg: 'primary_light',
                }}
              >
                <Box w="100%" textAlign="start">
                  Apariencia
                </Box>
              </Tab>

              <Tab
                fontSize="16px"
                fontWeight="bold"
                _focus={{ outline: 'none' }}
                _selected={{
                  rounded: '8px',
                  color: 'primary',
                  bg: 'primary_light',
                }}
              >
                <Box w="100%" textAlign="start">
                  {isMobile ? 'Ruta' : 'Hoja de ruta'}
                </Box>
              </Tab>

              {(user?.rol === UserRolEnum.ADMIN || user?.meta?.rol === UserRolEnum.ADMIN) && (
                <Tab
                  fontSize="16px"
                  fontWeight="bold"
                  _focus={{ outline: 'none' }}
                  _selected={{
                    color: 'primary',
                    bg: 'primary_light',
                    rounded: '8px',
                  }}
                >
                  <Box w="100%" textAlign="start">
                    Admin
                  </Box>
                </Tab>
              )}
            </Flex>
          </TabList>

          <Box
            bg="gray_3"
            w={{ base: '100%', md: '2px' }}
            minH={{ base: '2px', md: '100%' }}
            mx={{ base: '0px', md: '80px' }}
            my={{ base: '10px', md: '0px' }}
          />

          <TabPanels maxW="600px">
            <TabPanel>
              <Flex direction="column">
                <Box fontSize="18px" fontWeight="bold">
                  Cuenta
                </Box>

                {/* DATOS AVATAR */}
                <Flex py="24px">
                  <OpenAvatarUploader
                    size="90px"
                    onUpload={handleUpload}
                    src={user?.avatar?.url}
                    isUploading={isUploadingAvatar}
                    name={(user?.nombre || ' ')[0] + ' ' + (user?.apellidos || ' ')[0]}
                    allowGif={user?.rol === UserRolEnum.ADMIN || user?.meta?.rol === UserRolEnum.ADMIN}
                  />

                  <Flex gap="15px" align="center">
                    <IconButton
                      aria-label="Borrar imagen"
                      ml="15px"
                      w="88px"
                      p="10px"
                      bg="white"
                      rounded="12px"
                      border="2px solid"
                      borderColor="gray_5"
                      onClick={onAvatarRemove}
                      icon={<Icon as={BiTrashAlt} boxSize="20px" />}
                    />
                  </Flex>
                </Flex>

                {/* Cuenta */}
                <PerfilInput
                  name="username"
                  label="Nombre de usuario"
                  defaultValue={username}
                  onValidate={validateUsername}
                  onChange={(value: any) => {
                    if (!pending) setPending(true);
                    setUsername(value.username);
                  }}
                />

                <PerfilInput isDisabled name="email" label="Correo electrónico" defaultValue={user?.email} />

                <PerfilInput
                  name="full_name"
                  label="Nombre completo"
                  defaultValue={fullName}
                  onChange={(value: any) => {
                    if (!pending) setPending(true);
                    setFullName(value.full_name);
                  }}
                />

                {/*  // !Desactivado temporalmente por #DEV-624
                <Flex w="100%" direction="column" mb="24px">
                  <Box fontSize="14px" fontWeight="bold" mb="10px">
                    Factor de doble autenticación
                  </Box>

                  {qr2FA ? (
                    <Avatar src={qr2FA} size="120px" rounded="0px" />
                  ) : (
                    <Button onClick={enable2FA}>Activar 2FA</Button>
                  )}
                </Flex>
                */}
              </Flex>
            </TabPanel>

            <TabPanel>
              <TabDatos
                pending={pending}
                setPending={setPending}
                pais={pais}
                setPais={setPais}
                estado={estado}
                setEstado={setEstado}
                trabajoRemoto={trabajoRemoto}
                setTrabajoRemoto={setTrabajoRemoto}
                posibilidadTraslado={posibilidadTraslado}
                setPosibilidadTraslado={setPosibilidadTraslado}
              />
            </TabPanel>

            <TabPanel>
              <TabApariencia />
            </TabPanel>

            <TabPanel>
              <TabRuta />
            </TabPanel>

            {(user?.rol === UserRolEnum.ADMIN || user?.meta?.rol === UserRolEnum.ADMIN) && (
              <TabPanel>
                <TabAdmin />
              </TabPanel>
            )}
          </TabPanels>
        </Flex>
      </Tabs>

      {pending && (
        <Flex
          rounded="15px"
          justify="space-between"
          mt="30px"
          px="20px"
          mb="20px"
          align="center"
          h="74px"
          minW="100%"
          bg="white"
        >
          <Flex w="100%" align="center">
            <Icon mr="10px" as={BiCloud} fontSize="30px" color="gray_4" />

            <Box fontSize="16px" fontWeight="bold">
              ¿Deseas confirmar los cambios?
            </Box>
          </Flex>

          <Flex w="100%" justify="flex-end">
            <Button
              fontWeight="bold"
              fontSize="14px"
              rounded="12px"
              h="46px"
              bg="transparent"
              onClick={() => {
                setFullName(user?.fullName || '');
                setUsername(user?.username || '');

                setPending(false);
              }}
            >
              Descartar cambios
            </Button>

            <Button
              fontWeight="bold"
              fontSize="14px"
              rounded="12px"
              h="46px"
              ml="17px"
              bg="primary"
              color="white"
              onClick={updateValue}
            >
              Guardar cambios
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default PerfilSettings;

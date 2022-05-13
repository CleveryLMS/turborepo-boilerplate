import { useState, useContext, useEffect } from 'react';

import { Box, Flex, Icon, chakra, Drawer, DrawerBody, ChakraProps, DrawerContent, DrawerCloseButton } from '@chakra-ui/react';
import { BiX } from 'react-icons/bi';

import { INotificacion, getNotificaciones, updateNotificacion } from 'data';
import { NotificationItem } from './Item';
import { LayoutContext } from '../../../context';

type NotificationsDrawerProps = {
  state: { isOpen: boolean; onClose: () => void };
};

export const NotificationsDrawer = ({ state }: NotificationsDrawerProps) => {
  const { isMobile } = useContext(LayoutContext);

  const [notificaciones, setNotificaciones] = useState<INotificacion[] | undefined>();

  useEffect(() => {
    if (state.isOpen)
      (async () => {
        let notisListado = await getNotificaciones({});

        setNotificaciones(notisListado?.data || []);
      })();
  }, [state.isOpen]);

  const removeAllNotifications = async () => {
    let promises: Promise<any>[] = [];

    notificaciones?.forEach((n: INotificacion) => {
      if (n.id) promises.push(updateNotificacion({ id: n.id }));
    });

    await Promise.all(promises).then(() => {
      setNotificaciones([]);
    });
  };

  const onRemove = (id?: number | string) => {
    setNotificaciones((notis) => (notis || []).filter((n) => n.id !== id));
  };

  return (
    <Drawer placement="right" isOpen={state.isOpen} onClose={state.onClose} size={isMobile ? 'full' : 'md'}>
      <DrawerContent
        w="200px"
        bg="gray_1"
        p={isMobile ? '34px 20px' : '34px'}
        boxShadow="0px 4px 90px rgba(52, 53, 66, 0.2)"
        borderLeft="1px solid var(--chakra-colors-gray_3)"
        backdropFilter="blur(80px)"
      >
        <DrawerBody p="0px" overflow="unset">
          {isMobile && <DrawerCloseButton mt="10px" />}

          <Flex align="center" justify="center" gridRowGap="34px" direction="column">
            <Flex w="100%" direction="column" gridRowGap="30px">
              <Flex fontSize="24px" gap="4px">
                <Box fontSize="16px" lineHeight="16px" fontWeight="semibold" letterSpacing="-0.01em">
                  Notificaciones
                </Box>

                {notificaciones && notificaciones.length > 0 && (
                  <Icon ml="auto" as={BiX} boxSize="24px" color="gray_5" cursor="pointer" onClick={removeAllNotifications} />
                )}
              </Flex>
            </Flex>

            <Flex w="100%" direction="column" gap="12px">
              {/** Loading State */}
              {!notificaciones && [1, 2, 3].map((noti: number) => <NotificationItem key={noti} isLoading />)}

              {/** Data State */}
              {notificaciones?.map((noti: INotificacion) => (
                <NotificationItem key={noti.id} notificacion={noti} onRemove={onRemove} />
              ))}

              {/** Empty State */}
              {notificaciones && notificaciones?.length === 0 && <PlaceholderNotifications />}
            </Flex>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const PlaceholderNotifications = () => {
  return (
    <Flex direction="column" align="center" gap="11px">
      <Icono maxH="72px" />

      <Box color="black" fontSize="16px" fontWeight="semibold" lineHeight="20px" letterSpacing="-0.01em" textAlign="center">
        No tienes notificaciones
      </Box>

      <Box color="gray_5" fontSize="15px" lineHeight="23px" letterSpacing="0em" textAlign="center">
        Mantente informado. Las notificaciones sobre tu actividad, novedades del campus e interacciones del foro se mostrarán
        aquí.
      </Box>
    </Flex>
  );
};

const Icono = (props: ChakraProps) => (
  <chakra.svg width="98" height="72" viewBox="0 0 98 72" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M83.9529 0.000314303H8.39028C6.29292 0.00498548 4.28305 0.841429 2.80164 2.32614C1.32024 3.81085 0.488276 5.82256 0.488281 7.91992V48.2412C0.497591 50.3324 1.33368 52.3351 2.81408 53.8122C4.29448 55.2893 6.29902 56.1209 8.39028 56.1255H17.5269V69.5043C17.5269 70.4064 18.6273 70.8473 19.2502 70.1948L32.6812 56.1255H83.9C84.9474 56.1418 85.9876 55.9502 86.9604 55.5618C87.9333 55.1733 88.8194 54.5957 89.5674 53.8624C90.3155 53.1291 90.9107 52.2547 91.3184 51.2898C91.7262 50.3249 91.9385 49.2887 91.9431 48.2412V7.91992C91.9431 6.87394 91.7359 5.83832 91.3335 4.87284C90.9311 3.90736 90.3415 3.03116 89.5986 2.29482C88.8557 1.55849 87.9743 0.97661 87.0053 0.582786C86.0363 0.188963 84.9988 -0.00900402 83.9529 0.000314303Z"
      fill="white"
    />
    <path
      d="M46.084 41.3795H32.1849C31.9387 41.3949 31.6959 41.3159 31.5059 41.1586C31.3158 41.0014 31.1928 40.7776 31.1619 40.5329C31.1413 40.4067 31.1462 40.2776 31.1766 40.1533C31.2069 40.0291 31.2619 39.9122 31.3383 39.8097C31.9027 38.9807 32.4672 38.1517 32.9963 37.305C34.0137 35.778 34.7154 34.0628 35.06 32.2605C35.0956 31.8733 35.0956 31.4836 35.06 31.0964V23.5824C35.0461 22.1467 35.2849 20.7198 35.7655 19.3669C36.2872 17.8205 37.1912 16.4311 38.3936 15.3277C39.6494 14.1588 41.1773 13.3221 42.8385 12.8936C42.9973 12.8936 43.0502 12.8054 43.0502 12.6466C43.0502 12.4879 43.0502 11.8529 43.0502 11.4649C43.0542 10.7154 43.3404 9.99487 43.8519 9.44693C44.3633 8.899 45.0623 8.56384 45.8098 8.50822C46.5573 8.45261 47.2983 8.68062 47.8851 9.14684C48.472 9.61305 48.8618 10.2833 48.9767 11.0239C49.0119 11.5525 49.0119 12.0828 48.9767 12.6114C48.9767 12.7878 48.9766 12.8583 49.2059 12.9112C50.7229 13.297 52.1287 14.0322 53.3109 15.0582C54.4931 16.0842 55.4189 17.3724 56.0143 18.8201C56.5683 20.0846 56.8737 21.444 56.9139 22.824C56.9139 24.2703 56.9139 25.7343 56.9139 27.1806C56.9139 28.627 56.9139 29.7382 56.9139 31.0258C56.914 32.3803 57.2153 33.7178 57.7958 34.9415C58.5118 36.4493 59.3618 37.8897 60.3357 39.2453L60.7238 39.8097C60.8262 39.9671 60.8808 40.151 60.8808 40.3388C60.8808 40.5267 60.8262 40.7105 60.7238 40.868C60.6391 41.0309 60.5091 41.1658 60.3495 41.2566C60.1899 41.3473 60.0075 41.39 59.8242 41.3795H46.084ZM47.107 12.5055C47.107 12.1704 47.107 11.8176 47.107 11.4649C47.1073 11.2118 47.0106 10.9683 46.8366 10.7845C46.6627 10.6007 46.4248 10.4907 46.1721 10.4771C45.9312 10.4608 45.6929 10.5349 45.5037 10.6849C45.3145 10.835 45.1881 11.0502 45.1491 11.2885C45.1227 11.6938 45.1227 12.1003 45.1491 12.5055H47.107Z"
      fill="#D1D3D4"
    />
    <path
      d="M50.6871 43.3906C50.308 44.2765 49.6772 45.0315 48.873 45.5621C48.0687 46.0928 47.1264 46.3756 46.1629 46.3756C45.1994 46.3756 44.257 46.0928 43.4528 45.5621C42.6485 45.0315 42.0178 44.2765 41.6387 43.3906H50.6871Z"
      fill="#D1D3D4"
    />
    <circle cx="88.5117" cy="54" r="9" fill="#D1D3D4" />
  </chakra.svg>
);

import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { isMobile as isMobileBrowser } from 'react-device-detect';

import {
  BiCog,
  BiMenu,
  BiBell,
  BiLogOut,
  BiCalendar,
  BiChevronDown,
  BiChevronLeft,
  BiLeftArrowAlt,
  BiChevronsRight,
} from 'react-icons/bi';
import { Menu, MenuButton, Icon, MenuList, MenuItem, Box, Flex, Portal, Button, Text, IconButton } from '@chakra-ui/react';

import { useHover } from 'utils';
import { Avatar, Searchbar } from '../..';
import { CampusPages, LayoutContext, LoginContext, VisibilityContext } from '../../../context';

type HeaderProps = {
  title?: string;
  showSearchbar?: boolean;
  goBack?: (event: any) => void;
  breadcrumb?: {
    text: string;
    isActive?: boolean;
    onClick?: (event: any) => void;
  }[];
  hasAlerts?: boolean;
  calendarState: { isOpen: boolean; onOpen: () => void };
  notificationsState: { isOpen: boolean; onOpen: () => void };
};

export const Header = ({ title, goBack, breadcrumb, showSearchbar, calendarState, notificationsState }: HeaderProps) => {
  const navigate = useNavigate();

  const { user, logout } = useContext(LoginContext);
  const { disabledPages } = useContext(VisibilityContext);
  const { showHeader, onOpenSidebar, isMobile } = useContext(LayoutContext);

  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);

  return (
    <Flex
      w="100%"
      h="80px"
      minH="80px"
      align="center"
      justify="space-between"
      display={showHeader ? 'flex' : 'none'}
      bg="gray_1"
      position="sticky"
      top="0"
      zIndex={100}
    >
      <Flex w="100%" align="center" gap={isMobile ? '0px' : '30px'} p={isMobile ? '0px 10px' : '0px 34px'}>
        {(isMobileBrowser || isMobile) && (
          <IconButton
            ref={hoverRef}
            bg="transparent"
            onClick={onOpenSidebar}
            aria-label="Abrir sidebar"
            icon={<Icon boxSize={6} color="gray_4" as={isHover ? BiChevronsRight : BiMenu} />}
            _hover={{ backgroundColor: 'transparent' }}
          />
        )}

        {goBack ? (
          <Button
            leftIcon={<BiLeftArrowAlt />}
            bg="gray_3"
            rounded="10px"
            _hover={{ bg: 'gray_2' }}
            _focus={{ bg: 'gray_2' }}
            onClick={goBack}
            children="Volver"
          />
        ) : breadcrumb ? (
          breadcrumb?.map((item, index) => (
            <Flex
              key={'header-breadcrumb-' + index}
              align="center"
              cursor={!item.isActive ? 'pointer' : undefined}
              onClick={!item.isActive ? item.onClick : undefined}
            >
              {index > 0 && <Icon as={BiChevronLeft} boxSize="30px" mx="6px" opacity={0.4} />}

              <Box
                fontSize="24px"
                fontWeight="bold"
                lineHeight="29px"
                opacity={item.isActive ? 1 : 0.4}
                _hover={!item.isActive ? { textDecoration: 'underline', opacity: 0.6 } : undefined}
              >
                {item.text}
              </Box>
            </Flex>
          ))
        ) : title ? (
          <Text variant="h1_heading" fontSize={{ base: '16px', sm: '20px', md: '26px' }}>
            {title}
          </Text>
        ) : undefined}
      </Flex>

      <Flex
        w="fit-content"
        align="center"
        justify="flex-end"
        gap={isMobile ? '0px' : '30px'}
        p={isMobile ? '0px 10px' : '0px 34px'}
      >
        {showSearchbar && <Searchbar />}

        <Icon as={BiCalendar} boxSize="24px" color="gray_4" cursor="pointer" onClick={calendarState.onOpen} />

        <Icon as={BiBell} color="gray_4" boxSize="24px" cursor="pointer" onClick={notificationsState.onOpen} />

        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton
                as={Button}
                aria-label="Options"
                data-cy="header_menu"
                outline="none"
                bg="transparent"
                w="fit-content"
                _hover={{ bg: 'transparent' }}
                _focus={{ bg: 'transparent' }}
                _active={{ bg: 'transparent' }}
                _expanded={{ bg: 'transparent' }}
              >
                <Flex
                  align="center"
                  bg="white"
                  color="black"
                  gap="10px"
                  // pr={isMobile ? '0px' : '10px'}
                  pr={{ base: '0px', sm: '10px' }}
                  h="40px"
                  rounded="91px"
                >
                  <Flex align="center" gap="15px">
                    <Avatar
                      size="40px"
                      src={user?.avatar?.url}
                      name={(user?.nombre || ' ')[0] + ' ' + (user?.apellidos || ' ')[0]}
                    />

                    {!isMobile && (
                      <Box mr="12px" minW="fit-content" fontSize="16px" fontWeight="semibold">
                        {user?.username}
                      </Box>
                    )}
                  </Flex>

                  {!isMobile && <Box minW="1px" h="100%" bg="white" />}

                  {!isMobile && (
                    <Icon
                      as={BiChevronDown}
                      transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
                      transition="all 0.2s ease"
                      boxSize="20px"
                      color="gray_4"
                    />
                  )}
                </Flex>
              </MenuButton>

              <Portal>
                <MenuList zIndex="dropdown" py={0} color="black" bg="white">
                  {!disabledPages?.includes(CampusPages.PERFIL) && (
                    <MenuItem icon={<Icon as={BiCog} boxSize="16px" />} onClick={() => navigate('/perfil')}>
                      Configuración
                    </MenuItem>
                  )}

                  <MenuItem onClick={logout} data-cy="header_logout" icon={<Icon as={BiLogOut} boxSize="16px" />}>
                    Cerrar sesión
                  </MenuItem>
                </MenuList>
              </Portal>
            </>
          )}
        </Menu>
      </Flex>
    </Flex>
  );
};

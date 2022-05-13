import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  BiX,
  BiHome,
  BiStar,
  BiBriefcase,
  BiDirections,
  BiBadgeCheck,
  BiBookBookmark,
  BiConversation,
  BiNetworkChart,
} from 'react-icons/bi';
import {
  Flex,
  Icon,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react';

import { NavLink } from './NavLink';
import { ThemeContext } from '../../../context';

import { LogoOBFullBlack } from 'apps/campus/src/assets/logos/openbootcamp/LogoOBFullBlack';
import { LogoOBFullWhite } from 'apps/campus/src/assets/logos/openbootcamp/LogoOBFullWhite';
import { LogoOMFullBlack } from 'apps/campus/src/assets/logos/openmarketers/LogoOMFullBlack';
import { LogoOMFullWhite } from 'apps/campus/src/assets/logos/openmarketers/LogoOMFullWhite';
import { LogoImaginaFullBlack } from 'apps/campus/src/assets/logos/imagina/LogoImaginaFullBlack';
import { LogoImaginaFullWhite } from 'apps/campus/src/assets/logos/imagina/LogoImaginaFullWhite';

type MovilSidebarProps = {
  state: { isOpenSidebar: boolean; onCloseSidebar: () => void };
};

const MovilSidebar = ({ state }: MovilSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { themeMode } = useContext(ThemeContext);

  const disabledPages = process.env.NX_DISABLED_PAGES?.split(' ');

  return (
    <Drawer
      placement="left"
      isOpen={state.isOpenSidebar}
      onClose={state.onCloseSidebar}
    >
      <DrawerOverlay />

      <DrawerContent bg="white">
        <DrawerHeader>
          <Flex w="100%" align="center" direction="row" justify="space-between">
            <Flex
              h="90px"
              pl="10px"
              align="center"
              cursor="pointer"
              onClick={() => navigate('/')}
              style={{ transition: 'all 0.6s ease-in-out' }}
            >
              {process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? (
                themeMode === 'light' ? (
                  <LogoOBFullBlack h="35" w="128" />
                ) : (
                  <LogoOBFullWhite h="35" w="128" />
                )
              ) : process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS' ? (
                themeMode === 'light' ? (
                  <LogoOMFullBlack h="35" w="128" />
                ) : (
                  <LogoOMFullWhite h="35" w="128" />
                )
              ) : themeMode === 'light' ? (
                <LogoImaginaFullBlack h="35" w="128" />
              ) : (
                <LogoImaginaFullWhite h="35" w="128" />
              )}
            </Flex>

            <IconButton
              icon={<Icon as={BiX} boxSize="30px" color="gray_4" />}
              bg="transparent"
              aria-label="Cerrar Sidebar"
              onClick={state.onCloseSidebar}
            />
          </Flex>
        </DrawerHeader>

        <DrawerBody p="0px">
          <Flex
            direction="column"
            h="100%"
            w="100%"
            gap="7px"
            overflow="auto"
            p="30px 0px 20px 0px"
            align="flex-start"
          >
            <NavLink
              title="Inicio"
              to="/"
              icon={BiHome}
              isActive={location.pathname === '/'}
              onClose={state.onCloseSidebar}
            />

            {!disabledPages?.includes('roadmap') && (
              <NavLink
                title="Hoja de ruta"
                to="/roadmap"
                icon={BiDirections}
                isActive={location.pathname.startsWith('/roadmap')}
                onClose={state.onCloseSidebar}
              />
            )}

            {!disabledPages?.includes('cursos') && (
              <NavLink
                title="Cursos"
                to="/cursos"
                icon={BiBookBookmark}
                isActive={location.pathname.startsWith('/cursos')}
                onClose={state.onCloseSidebar}
              />
            )}

            {!disabledPages?.includes('certificaciones') && (
              <NavLink
                title="Certificaciones"
                to="/certificaciones"
                icon={BiBadgeCheck}
                isActive={location.pathname.startsWith('/certificaciones')}
                onClose={state.onCloseSidebar}
              />
            )}

            {!disabledPages?.includes('procesos') && (
              <NavLink
                title="Vacantes"
                to="/procesos"
                icon={BiBriefcase}
                isActive={location.pathname.startsWith('/procesos')}
                onClose={state.onCloseSidebar}
              />
            )}

            {!disabledPages?.includes('foro') && (
              <NavLink
                title="Foros"
                to="/foro"
                icon={BiConversation}
                isActive={location.pathname.startsWith('/foro')}
                onClose={state.onCloseSidebar}
              />
            )}

            {!disabledPages?.includes('comunidad') && (
              <NavLink
                title="Comunidad"
                to="/comunidad"
                icon={BiNetworkChart}
                isActive={location.pathname.startsWith('/comunidad')}
                onClose={state.onCloseSidebar}
              />
            )}

            {!disabledPages?.includes('favoritos') && (
              <NavLink
                title="Favoritos"
                to="/favoritos"
                icon={BiStar}
                isActive={location.pathname.startsWith('/favoritos')}
                onClose={state.onCloseSidebar}
              />
            )}
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export { MovilSidebar };

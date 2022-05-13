import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  BiStar,
  BiHome,
  BiBriefcase,
  BiDirections,
  BiBadgeCheck,
  BiBookBookmark,
  BiNetworkChart,
  BiConversation,
} from 'react-icons/bi';
import { Flex } from '@chakra-ui/react';

import { NavLink } from './NavLink';
import {
  CampusPages,
  RoadmapContext,
  ThemeContext,
  VisibilityContext,
} from '../../../context';

import { LogoOB } from 'apps/campus/src/assets/logos/openbootcamp/LogoOB';
import { LogoOM } from 'apps/campus/src/assets/logos/openmarketers/LogoOM';
import { LogoImagina } from 'apps/campus/src/assets/logos/imagina/LogoImagina';

import { LogoOBFullBlack } from 'apps/campus/src/assets/logos/openbootcamp/LogoOBFullBlack';
import { LogoOBFullWhite } from 'apps/campus/src/assets/logos/openbootcamp/LogoOBFullWhite';
import { LogoOMFullBlack } from 'apps/campus/src/assets/logos/openmarketers/LogoOMFullBlack';
import { LogoOMFullWhite } from 'apps/campus/src/assets/logos/openmarketers/LogoOMFullWhite';
import { LogoImaginaFullBlack } from 'apps/campus/src/assets/logos/imagina/LogoImaginaFullBlack';
import { LogoImaginaFullWhite } from 'apps/campus/src/assets/logos/imagina/LogoImaginaFullWhite';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { ruta } = useContext(RoadmapContext);
  const { themeMode } = useContext(ThemeContext);
  const { disabledPages } = useContext(VisibilityContext);

  return (
    <Flex
      transition="all 0.1s linear"
      bg="white"
      height="100vh"
      direction="column"
      borderRight="1px solid"
      borderRightColor="gray_3"
      w={{ base: '86px', '2xl': '230px' }}
      minW={{ base: '86px', '2xl': '230px' }}
    >
      <Flex
        h="90px"
        align="center"
        cursor="pointer"
        data-cy="logo_ob"
        onClick={() => navigate('/')}
        pl={{ base: '0px', '2xl': '24px' }}
        justify={{ base: 'center', '2xl': 'flex-start' }}
      >
        {process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? (
          themeMode === 'light' ? (
            <LogoOBFullBlack
              h="35"
              w="128"
              display={{ base: 'none', '2xl': 'flex' }}
            />
          ) : (
            <LogoOBFullWhite
              h="35"
              w="128"
              display={{ base: 'none', '2xl': 'flex' }}
            />
          )
        ) : process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS' ? (
          themeMode === 'light' ? (
            <LogoOMFullBlack
              h="35"
              w="128"
              display={{ base: 'none', '2xl': 'flex' }}
            />
          ) : (
            <LogoOMFullWhite
              h="35"
              w="128"
              display={{ base: 'none', '2xl': 'flex' }}
            />
          )
        ) : themeMode === 'light' ? (
          <LogoImaginaFullBlack
            h="35"
            w="128"
            display={{ base: 'none', '2xl': 'flex' }}
          />
        ) : (
          <LogoImaginaFullWhite
            h="35"
            w="128"
            display={{ base: 'none', '2xl': 'flex' }}
          />
        )}

        <Flex display={{ base: 'flex', '2xl': 'none' }}>
          {process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? (
            <LogoOB w="30" h="35" />
          ) : process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS' ? (
            <LogoOM w="30" h="35" />
          ) : (
            <LogoImagina w="30" h="35" />
          )}
        </Flex>
      </Flex>

      <Flex
        direction="column"
        boxSize="100%"
        gap="7px"
        overflowY="hidden"
        p="30px 0px 20px 0px"
        align="flex-start"
      >
        <NavLink
          data-cy="sidebar_home"
          title="Inicio"
          to="/"
          icon={BiHome}
          isActive={location.pathname === '/'}
        />

        {!disabledPages?.includes(CampusPages.ROADMAP) && (
          <NavLink
            data-cy="sidebar_roadmap"
            title="Hoja de ruta"
            to="/roadmap"
            icon={BiDirections}
            isActive={location.pathname.startsWith('/roadmap')}
          />
        )}

        {!disabledPages?.includes(CampusPages.CURSOS) && (
          <NavLink
            data-cy="sidebar_cursos"
            title="Cursos"
            to="/cursos"
            icon={BiBookBookmark}
            isActive={location.pathname.startsWith('/cursos')}
          />
        )}

        {!disabledPages?.includes(CampusPages.CERTIFICACIONES) && (
          <NavLink
            data-cy="sidebar_certificaciones"
            title="Certificaciones"
            to="/certificaciones"
            icon={BiBadgeCheck}
            isActive={location.pathname.startsWith('/certificaciones')}
          />
        )}

        {!disabledPages?.includes(CampusPages.PROCESOS) && (
          <NavLink
            data-cy="sidebar_vacantes"
            title="Vacantes"
            to="/procesos"
            icon={BiBriefcase}
            isActive={location.pathname.startsWith('/procesos')}
          />
        )}

        {!disabledPages?.includes(CampusPages.FORO) && (
          <NavLink
            data-cy="sidebar_foro"
            title="Foros"
            to="/foro"
            state={{ cursoId: ruta?.meta?.itinerario[0] }}
            icon={BiConversation}
            isActive={location.pathname.startsWith('/foro')}
          />
        )}

        {!disabledPages?.includes(CampusPages.COMUNIDAD) && (
          <NavLink
            data-cy="sidebar_comunidad"
            title="Comunidad"
            to="/comunidad"
            icon={BiNetworkChart}
            isActive={location.pathname.startsWith('/comunidad')}
          />
        )}

        {!disabledPages?.includes(CampusPages.FAVORITOS) && (
          <NavLink
            data-cy="sidebar_favoritos"
            title="Favoritos"
            to="/favoritos"
            icon={BiStar}
            isActive={location.pathname.startsWith('/favoritos')}
          />
        )}
      </Flex>
    </Flex>
  );
};

export { Sidebar };

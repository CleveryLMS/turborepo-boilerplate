import { useContext, useEffect } from 'react';
import { Route, useNavigate, useLocation, Routes } from 'react-router-dom';

import { useDisclosure } from '@chakra-ui/react';

import ComunidadList from './views/Listado';
import { NuevoProyecto } from './views/NuevoProyecto';

import {
  Header,
  CalendarDrawer,
  NotificationsDrawer,
} from '../../shared/components';
import { LayoutContext } from '../../shared/context';

import './Comunidad.scss';

const Comunidad = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen_Notis,
    onOpen: onOpen_Notis,
    onClose: onClose_Notis,
  } = useDisclosure();

  const { showHeader, setShowHeader, setShowSidebar } =
    useContext(LayoutContext);

  useEffect(() => {
    setShowHeader(true);
    setShowSidebar(true);
  }, []);

  return (
    <>
      {showHeader && (
        <Header
          showSearchbar
          title="Comunidad"
          calendarState={{ isOpen, onOpen }}
          notificationsState={{ isOpen: isOpen_Notis, onOpen: onOpen_Notis }}
          goBack={
            pathname !== '/comunidad' ? () => navigate('/comunidad') : undefined
          }
        />
      )}

      <div className="page-container">
        <Routes>
          <Route index element={<ComunidadList />} />
          <Route path="new" element={<NuevoProyecto />} />
          <Route path="edit/:proyecto" element={<NuevoProyecto />} />

          <Route path=":proyectoID" element={<ComunidadList />} />
        </Routes>

        <CalendarDrawer state={{ isOpen, onClose }} />
        <NotificationsDrawer
          state={{ isOpen: isOpen_Notis, onClose: onClose_Notis }}
        />
      </div>
    </>
  );
};

export default Comunidad;

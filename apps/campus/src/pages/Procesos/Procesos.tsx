import { useContext, useEffect } from 'react';
import { Route, useLocation, Routes, useNavigate } from 'react-router-dom';

import { useDisclosure } from '@chakra-ui/react';

import ProcesosCover from './views/Portada';
import ProcesosList from './views/Listado/Listado';

import { LayoutContext } from '../../shared/context';
import {
  Header,
  CalendarDrawer,
  NotificationsDrawer,
} from '../../shared/components';
import './Procesos.scss';

const Procesos = () => {
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
          title="Vacantes"
          calendarState={{ isOpen, onOpen }}
          notificationsState={{ isOpen: isOpen_Notis, onOpen: onOpen_Notis }}
          goBack={
            pathname !== '/procesos' ? () => navigate('/procesos') : undefined
          }
        />
      )}

      <div className="page-container">
        <Routes>
          <Route index element={<ProcesosList />} />
          <Route path=":procesoId" element={<ProcesosCover />} />
        </Routes>

        <CalendarDrawer state={{ isOpen, onClose }} />
        <NotificationsDrawer
          state={{ isOpen: isOpen_Notis, onClose: onClose_Notis }}
        />
      </div>
    </>
  );
};

export default Procesos;

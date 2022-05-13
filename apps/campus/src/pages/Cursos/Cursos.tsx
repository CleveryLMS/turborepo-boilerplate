import { useContext } from 'react';
import { Route, useLocation, Routes, useNavigate } from 'react-router-dom';

import { useDisclosure } from '@chakra-ui/react';

import { LayoutContext } from '../../shared/context';
import {
  Header,
  CalendarDrawer,
  NotificationsDrawer,
} from '../../shared/components';
import Test from './views/Test/Test';
import Listado from './views/Listado';
import Portada from './views/Portada/Portada';
import Leccion from './views/Leccion/Leccion';

import './Cursos.scss';

const Cursos = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen_Notis,
    onOpen: onOpen_Notis,
    onClose: onClose_Notis,
  } = useDisclosure();

  const { showHeader } = useContext(LayoutContext);

  return (
    <>
      {showHeader && (
        <Header
          showSearchbar
          title="Cursos"
          calendarState={{ isOpen, onOpen }}
          notificationsState={{ isOpen: isOpen_Notis, onOpen: onOpen_Notis }}
          goBack={pathname !== '/cursos' ? () => navigate('/') : undefined}
        />
      )}

      <div className="page-container" style={{ height: 'fit-content' }}>
        <Routes>
          <Route index element={<Listado />} />
          <Route path=":cursoId" element={<Portada />} />
          <Route path=":cursoId/test/:testId" element={<Test />} />
          <Route path=":cursoId/leccion/:leccionId" element={<Leccion />} />
        </Routes>

        <CalendarDrawer state={{ isOpen, onClose }} />
        <NotificationsDrawer
          state={{ isOpen: isOpen_Notis, onClose: onClose_Notis }}
        />
      </div>
    </>
  );
};

export default Cursos;

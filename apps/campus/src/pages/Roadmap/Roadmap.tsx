import { useContext, useEffect } from 'react';
import { useDisclosure } from '@chakra-ui/react';

import RoadmapList from './views/Listado';
import { LayoutContext } from '../../shared/context';
import {
  Header,
  CalendarDrawer,
  NotificationsDrawer,
} from '../../shared/components';
const Roadmap = () => {
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
          title="Hoja de ruta"
          calendarState={{ isOpen, onOpen }}
          notificationsState={{ isOpen: isOpen_Notis, onOpen: onOpen_Notis }}
        />
      )}

      <div className="page-container">
        <RoadmapList />

        <CalendarDrawer state={{ isOpen, onClose }} />
        <NotificationsDrawer
          state={{ isOpen: isOpen_Notis, onClose: onClose_Notis }}
        />
      </div>
    </>
  );
};

export default Roadmap;

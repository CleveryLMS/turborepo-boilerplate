import { useContext, useEffect, useState } from 'react';
import { Routes, Route, useLocation, useParams, useNavigate } from 'react-router-dom';

import { useDisclosure } from '@chakra-ui/react';

import ForoList from './views/Listado';
import ForoTopic from './views/Tema';
import ForoQuestion from './views/Pregunta';

import { IForoVoto } from 'data';
import NuevaPregunta from './views/NuevaPregunta';
import { Header, CalendarDrawer, NotificationsDrawer } from '../../shared/components';
import { LayoutContext, LoginContext, VotosContext } from '../../shared/context';

import { getVotos, addVoto as serverAddVoto, updateVoto as serverUpdateVoto, removeVoto as serverRemoveVoto } from 'data';
import NuevoTema from './views/NuevoTema';

const Foro = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useContext(LoginContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpen_Notis, onOpen: onOpen_Notis, onClose: onClose_Notis } = useDisclosure();

  const { showHeader, setShowHeader, setShowSidebar } = useContext(LayoutContext);

  const [votos, setVotos] = useState<IForoVoto[]>([]);

  useEffect(() => {
    setShowHeader(true);
    setShowSidebar(true);
  }, []);

  useEffect(() => {
    // TODO: Queremos borrar esta petición y filtrar los votos por preguntaId
    // ¡Solo pediremos votos al entrar en las preguntas!

    (async () => {
      const dataVotos = await getVotos({
        query: [{ user_id: user?.id }, { limit: 10000 }],
      });
      setVotos([...(dataVotos || [])]);
    })();
  }, [user]);

  // TODO: WIP (faltan endpoints de back)
  const filterVotos = (query: string) => {};

  const addVoto = (newVoto: IForoVoto, tipo: 'pregunta' | 'respuesta') => {
    // Validamos antes de meter votos duplicados
    const key: 'preguntaId' | 'respuestaId' = tipo === 'pregunta' ? 'preguntaId' : 'respuestaId';

    if (votos.find((v) => v[key] == newVoto[key] && v.userId == newVoto.userId)) return;

    setVotos((last) => [...last, newVoto]);

    serverAddVoto({ voto: newVoto });
  };

  const updateVoto = (newVoto: IForoVoto, tipo: 'pregunta' | 'respuesta') => {
    const key: 'preguntaId' | 'respuestaId' = tipo === 'pregunta' ? 'preguntaId' : 'respuestaId';
    const last: any[] = [...votos].map((v) => (v[key] == newVoto[key] && v.id === newVoto.id ? newVoto : v));

    setVotos([...last]);

    if (newVoto.id) serverUpdateVoto({ id: newVoto.id, voto: newVoto });
  };

  const removeVoto = (voto: IForoVoto, tipo: 'pregunta' | 'respuesta') => {
    const key: 'preguntaId' | 'respuestaId' = tipo === 'pregunta' ? 'preguntaId' : 'respuestaId';
    const last: any[] = [...votos].map((v) => (v[key] == voto[key] && v.id == voto.id ? undefined : v)).filter((v: any) => v);

    setVotos([...last]);

    if (voto.id) serverRemoveVoto({ id: voto.id });
  };

  return (
    <>
      {showHeader && (
        <Header
          showSearchbar
          title="Foros"
          calendarState={{ isOpen, onOpen }}
          notificationsState={{ isOpen: isOpen_Notis, onOpen: onOpen_Notis }}
          goBack={pathname.startsWith('/foro/') ? () => navigate(-1) : undefined}
        />
      )}

      <div className="page-container">
        <VotosContext.Provider value={{ votos, addVoto, updateVoto, removeVoto, filterVotos }}>
          <Routes>
            <Route index element={<ForoList />} />
            <Route path="new" element={<NuevoTema />} />
            <Route path=":temaId">
              <Route index element={<ForoTopic />} />
              <Route path="new" element={<NuevaPregunta />} />
              <Route path=":preguntaId" element={<ForoQuestion />} />
            </Route>
          </Routes>
        </VotosContext.Provider>

        <CalendarDrawer state={{ isOpen, onClose }} />
        <NotificationsDrawer state={{ isOpen: isOpen_Notis, onClose: onClose_Notis }} />
      </div>
    </>
  );
};

export default Foro;

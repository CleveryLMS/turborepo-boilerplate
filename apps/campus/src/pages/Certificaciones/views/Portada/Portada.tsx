import { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { PortadaBase } from './PortadaBase';
import { ExamenAprobado } from './ExamenAprobado';
import { ExamenSuspendido } from './ExamenSuspendido';

import { IExamen } from 'data';
import { useCertificacion } from 'data';
import { LayoutContext, ProgresoGlobalContext } from '../../../../shared/context';

const CertificacionesCover = () => {
  const props = useParams<any>();
  const location = useLocation();

  const { setShowSidebar } = useContext(LayoutContext);
  const { progresoGlobal } = useContext(ProgresoGlobalContext);

  const { certificacion } = useCertificacion({
    id: +(props?.certificacionId || 0),
    strategy: 'invalidate-on-undefined',
    certificacionesIniciadas: progresoGlobal?.meta?.certificacionesIniciadas || [],
    certificacionesCompletadas: progresoGlobal?.meta?.certificacionesCompletadas || [],
  });

  const [examen, setExamen] = useState<IExamen>();
  const [estado, setEstado] = useState<'portada' | 'suspendido' | 'aprobado'>('portada');
  const [resultados, setResultados] = useState<
    | {
        intentosTotales: number;
        intentosRestantes: number;
        preguntasTotales: number;
        preguntasCorrectas: number;
        tiempoUtilizado: number;
      }
    | undefined
  >();

  useEffect(() => {
    setShowSidebar(false);
  }, []);

  useEffect(() => {
    const stateData: any = location.state;

    if (location.state === null) setEstado('portada');
    else {
      setEstado(stateData?.aprobado ? 'aprobado' : 'suspendido');
      setResultados(stateData);
    }
  }, [location.state]);

  useEffect(() => {
    if (certificacion?.examenes?.length > 0) setExamen(certificacion?.examenes[0]);
    else setExamen(undefined);
  }, [certificacion]);

  return estado === 'portada' ? (
    <PortadaBase examen={examen} certificacion={certificacion} />
  ) : estado === 'aprobado' ? (
    <ExamenAprobado examen={examen} certificacion={certificacion} resultados={resultados} />
  ) : (
    <ExamenSuspendido examen={examen} certificacion={certificacion} resultados={resultados} />
  );
};

export default CertificacionesCover;

import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Flex, useToast } from '@chakra-ui/react';

import { onFailure } from 'utils';
import { ICurso, IExamen } from 'data';
import { LayoutContext, LoginContext } from '../../../../shared/context';
import { getCurso, getExamenByID, getUserByID, hacerExamen } from 'data';

import { PortadaTest } from './PortadaTest';
import { ContenidoTest } from './ContenidoTest';
import { ResultadoTest } from './ResultadoTest';

const Test = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const { cursoId, testId } = useParams<any>();

  const [test, setTest] = useState<IExamen>();
  const [curso, setCurso] = useState<ICurso>();

  const { user, setUser } = useContext(LoginContext);
  const { setShowHeader, setShowSidebar } = useContext(LayoutContext);

  useEffect(() => {
    setShowHeader(false);
    setShowSidebar(false);
  }, []);

  useEffect(() => {
    refreshState();
  }, [cursoId, testId]);

  const refreshState = async () => {
    const cursoData = await getCurso({
      id: +(cursoId || 0),
      userId: user?.id,
      strategy: 'invalidate-on-undefined',
    });

    if (cursoData?.error === 404) navigate('/');
    if (!testId) return;

    setCurso(cursoData);

    const testData = await getExamenByID({ id: +(testId || 0) });
    setTest(testData);
  };

  const [aprobado, setAprobado] = useState<boolean>(false);
  const [empezado, setEmpezado] = useState<boolean>(false);
  const [terminado, setTerminado] = useState<boolean>(false);
  const [resultado, setResultado] = useState<{ totalPreguntas: number; totalCorrectas: number }>();

  const onStart = () => setEmpezado(true);

  useEffect(() => {
    setEmpezado(false);
    setAprobado(false);
    setTerminado(false);
  }, [test]);

  const onFinish = async (respuestas: any, tiempoUtilizado: number) => {
    if (!test?.id) return;

    await hacerExamen({ id: test?.id, respuestas })
      .then(async (response) => {
        setTerminado(true);
        setEmpezado(false);
        setAprobado(response.aprobada);
        setResultado({
          totalCorrectas: response.totalCorrectas,
          totalPreguntas: response.totalPreguntas,
        });

        if (user?.id) {
          const _user = await getUserByID({ id: user?.id });
          setUser({ ..._user });
        }
      })
      .catch((err) => onFailure(toast, err.title, err.message));
  };

  const onRestart = () => {
    setEmpezado(false);
    setAprobado(false);
    setTerminado(false);
    setResultado(undefined);
  };

  return (
    <Flex direction="column" boxSize="100%">
      {test && terminado ? (
        <ResultadoTest test={test} aprobado={aprobado} resultado={resultado} onRestart={onRestart} />
      ) : empezado && test ? (
        <ContenidoTest test={test} curso={curso} onFinish={onFinish} />
      ) : (
        <PortadaTest test={test} onStart={onStart} />
      )}
    </Flex>
  );
};

export default Test;

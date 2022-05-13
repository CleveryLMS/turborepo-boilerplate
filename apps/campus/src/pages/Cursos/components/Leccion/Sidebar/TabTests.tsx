import { useContext, useEffect, useState } from 'react';
import { Flex, Box } from '@chakra-ui/react';

import { IExamen } from 'data';
import { getExamenes } from 'data';
import { LoginContext } from '../../../../../shared/context';
import { CardExamen } from '../../../../../shared/components';

const TabTests = ({ cursoId, onExamenSelect }: any) => {
  const { user } = useContext(LoginContext);

  const [examenes, setExamenes] = useState<IExamen[]>([]);

  useEffect(() => {
    refreshStateExamenes();
  }, [cursoId]);

  const refreshStateExamenes = async () => {
    if (!cursoId) return;

    const examenesData = await getExamenes({
      query: [{ cursos: `[${cursoId}]` }, { es_certificacion: false }],
    });

    setExamenes(examenesData?.data || []);
  };

  return (
    <Flex direction="column" gridRowGap="10px">
      {(examenes?.length || 0) > 0 ? (
        examenes?.map((examen: IExamen) => (
          <CardExamen
            examen={examen}
            icon={examen?.curso?.imagen?.url}
            onClick={() => onExamenSelect(examen)}
            key={`contenidotab-examen-${examen.id}`}
            isCompleted={!!user?.examenes?.find((ex: any) => ex.meta?.pivot_aprobado && ex.id === examen.id)}
          />
        ))
      ) : (
        <Box color="gray_4" fontWeight="bold" fontSize="16px" lineHeight="100%" p="15px 30px">
          No hay tests disponibles
        </Box>
      )}
    </Flex>
  );
};

export default TabTests;

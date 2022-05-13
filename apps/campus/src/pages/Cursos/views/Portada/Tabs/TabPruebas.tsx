import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Box, Text } from '@chakra-ui/react';
import { ICurso, IExamen } from 'data';
import { GlobalCard, GlobalCardType } from '../../../../../shared/components/layout/Cards/GlobalCard';
import { LoginContext } from '../../../../../shared/context';

export const TabPruebas = ({ examenes, curso }: { examenes: IExamen[]; curso: ICurso }) => {
  const { user } = useContext(LoginContext);
  const navigate = useNavigate();
  return (
    <Flex direction="column" gap="20px" w="100%">
      <Text variant="h1_heading">Tests del curso</Text>

      <Flex direction="column" gridRowGap="10px">
        {examenes?.length > 0 ? (
          examenes?.map((examen: IExamen) => (
            <GlobalCard
              key={`contenidotab-examen-${examen.id}`}
              type={GlobalCardType.EXAMEN}
              props={{
                examen: examen,
                icon: curso?.imagen?.url,
                isCompleted: !!user?.examenes?.find((ex: any) => ex.meta?.pivot_aprobado === true && ex.id === examen.id),
              }}
              onClick={() => navigate(`/cursos/${curso?.id}/test/${examen.id}`)}
            />
          ))
        ) : (
          <Box color="gray_4" fontSize="16px" fontWeight="bold" lineHeight="100%">
            No hay tests disponibles
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

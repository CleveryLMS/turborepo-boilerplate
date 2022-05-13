import { useContext } from 'react';
import { Flex, Box } from '@chakra-ui/react';

import { IProceso } from 'data';
import { useProcesos } from 'data';
import { LoginContext } from '../../../../shared/context';
import { GlobalCard, GlobalCardType } from '../../../../shared/components';

const ProcesosList = () => {
  const { user } = useContext(LoginContext);
  const { procesos, isLoading, isError } = useProcesos({
    query: [{ limit: 100 }],
  });

  const onEnroll = (proceso: IProceso) => {};

  return (
    <Flex w="100%" gap="80px" p="34px">
      <Flex w="100%" direction="column">
        <Flex fontSize="19px" fontWeight="bold" mb="40px" align="center">
          Ofertas de empleo
          <Box ml="10px" fontSize="18px" fontWeight="normal" color="gray_6">
            {procesos?.data?.length}
          </Box>
        </Flex>

        <Flex w="100%" wrap="wrap" gap="30px" pb="40px">
          {isLoading
            ? Array.from(Array(10).keys()).map((n) => (
                <GlobalCard
                  maxPerRow={1}
                  gapBetween="12px"
                  type={GlobalCardType.PROCESO}
                  key={'proceso-item-placeholder-' + n}
                  props={{ isLoading: true }}
                />
              ))
            : isError || procesos?.data?.length === 0
            ? undefined // Si no hay cursos superadas, entonces no mostramos nada... TODO: Debería estar a nivel de back
            : procesos?.data?.map((proceso: IProceso, index: number) => (
                <GlobalCard
                  maxPerRow={1}
                  gapBetween="12px"
                  key={'card-proceso-' + index}
                  type={GlobalCardType.PROCESO}
                  props={{
                    proceso: proceso,
                    onEnroll: onEnroll,
                    isEnrolled: user?.procesos?.map((e) => e?.id).includes(proceso.id) || false,
                  }}
                />
              ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProcesosList;

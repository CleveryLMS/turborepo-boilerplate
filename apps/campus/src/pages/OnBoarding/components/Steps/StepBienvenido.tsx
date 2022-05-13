import { useState } from 'react';

import { Flex } from '@chakra-ui/layout';
import { Box, Button, Image } from '@chakra-ui/react';

import { LogoOBFullBlack } from 'apps/campus/src/assets/logos/openbootcamp/LogoOBFullBlack';
import { LogoOMFullBlack } from 'apps/campus/src/assets/logos/openmarketers/LogoOMFullBlack';
import { LogoImaginaFullBlack } from 'apps/campus/src/assets/logos/imagina/LogoImaginaFullBlack';

import '../../OnBoarding.scss';

export const StepBienvenido = ({
  onNextStep,
}: {
  onNextStep: (value: any) => void;
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <Flex
      pt="75px"
      gap="60px"
      boxSize="100%"
      align="center"
      justify="start"
      direction="column"
    >
      {process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? (
        <LogoOBFullBlack />
      ) : process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS' ? (
        <LogoOMFullBlack w="184" h="51" />
      ) : (
        <LogoImaginaFullBlack w="184" h="51" />
      )}

      <Flex direction="column" align="center" gap="10px">
        <Box
          fontSize="34px"
          fontWeight="bold"
          lineHeight="40px"
          textTransform="capitalize"
        >
          ¡Bienvenido{' '}
          {process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP'
            ? 'a OpenBootcamp!'
            : 'al Campus!'}
        </Box>

        <Box
          color="gray_4"
          fontSize="16px"
          lineHeight="19px"
          fontWeight="medium"
        >
          {process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP'
            ? '¡Ya puedes disfrutar de todas las ventajas que tiene ser un alumno de OpenBootcamp! Esperamos que tu experiencia de aprendizaje sea lo mejor posible. '
            : '¡Ya puedes disfrutar de todas las ventajas del campus! Esperamos que tu experiencia de aprendizaje sea lo mejor posible.'}
        </Box>
      </Flex>

      <Button
        w="fit-content"
        minW="380px"
        h="50px"
        p="15px"
        bg="primary"
        color="#fff"
        rounded="13px"
        isLoading={loading}
        onClick={() => {
          setLoading(false);
          onNextStep({ onboardingCompletado: true });
        }}
      >
        Empezar
      </Button>
    </Flex>
  );
};

export default StepBienvenido;

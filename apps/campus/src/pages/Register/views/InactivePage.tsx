import { Image, Flex, Text } from '@chakra-ui/react';

import { InactiveVector } from '../components';

import { LogoOBFullBlack } from 'apps/campus/src/assets/logos/openbootcamp/LogoOBFullBlack';
import { LogoOMFullBlack } from 'apps/campus/src/assets/logos/openmarketers/LogoOMFullBlack';
import { LogoImaginaFullBlack } from 'apps/campus/src/assets/logos/imagina/LogoImaginaFullBlack';

export const InactivePage = () => {
  return (
    <Flex
      p="75px"
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

      <Flex
        h="100%"
        gap="28px"
        align="center"
        justify="center"
        direction="column"
      >
        <Text variant="h1_heading">¡Ya está casi!</Text>

        <InactiveVector />

        <Text
          variant="card_title"
          fontSize="18px"
          lineHeight="22px"
          textAlign="center"
          color="gray_4"
        >
          Estamos validando tu cuenta para darte acceso al campus, te avisaremos
          en cuanto tengas acceso.
        </Text>
      </Flex>
    </Flex>
  );
};

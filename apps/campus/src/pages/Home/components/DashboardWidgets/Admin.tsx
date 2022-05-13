import { useContext } from 'react';

import { BiLaptop } from 'react-icons/bi';
import { Flex, Box, Icon, Center } from '@chakra-ui/react';

import { LoginContext } from '../../../../shared/context';

export const AdminWidget = () => {
  const { user } = useContext(LoginContext);

  return (
    <Flex
      as="a"
      p="24px"
      w="100%"
      bg="white"
      gap="20px"
      rounded="20px"
      cursor="pointer"
      border="1px solid var(--chakra-colors-gray_3)"
      target="_blank"
      href={process.env.NX_ADMIN_URL || ''}
    >
      <Center
        position="relative"
        boxSize="45px"
        rounded="full"
        bg="primary_light"
      >
        <Icon boxSize="20px" color="primary" as={BiLaptop} />
      </Center>

      <Flex direction="column" align="center" justify="center">
        <Box
          fontSize="14px"
          fontWeight="bold"
          color="gray_4"
          lineHeight="16px"
          textTransform="uppercase"
        >
          Acceder al panel de {user?.rol}
        </Box>
      </Flex>
    </Flex>
  );
};

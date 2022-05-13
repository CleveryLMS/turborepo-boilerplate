import React, { useEffect } from 'react';

import { Flex, Box, Icon, toast } from '@chakra-ui/react';

import { FaRegCheckCircle } from 'react-icons/fa';

export const SuccessToastComponent = (title: string | React.ReactNode) => {
  return (
    <Flex
      fontSize="16px"
      color="white"
      p="16px"
      bg="#55556A"
      rounded="5px"
      align="center"
      whiteSpace="pre-line"
    >
      <Icon as={FaRegCheckCircle} mr="8px" h="100%" />
      <Box>{title}</Box>
    </Flex>
  );
};

export const FailureToastComponent = (
  title: string | React.ReactNode,
  description: string | React.ReactNode
) => {
  return (
    <Flex
      p="16px"
      bg="#E53E3E"
      color="white"
      align="center"
      fontSize="16px"
      direction="column"
      rounded="5px"
      whiteSpace="pre-line"
    >
      <Box w="100%" fontWeight="bold" mb="6px">
        {title}
      </Box>

      <Box w="100%" whiteSpace="pre-line">
        {description}
      </Box>
    </Flex>
  );
};

export const WarningToastComponent = (
  title: string | React.ReactNode,
  description: string | React.ReactNode
) => {
  return (
    <Flex
      fontSize="16px"
      color="white"
      p="16px"
      bg="#55556A"
      rounded="5px"
      align="center"
      justify="start"
      direction="column"
      w="100%"
      whiteSpace="pre-line"
    >
      <Box w="100%" fontWeight="bold" mb="6px">
        {title}
      </Box>
      <Box w="100%" whiteSpace="pre-line">
        {description}
      </Box>
    </Flex>
  );
};
export const SuccessToastComponent_Undo = (
  title: string | React.ReactNode,
  timeout: any
) => {
  useEffect(() => {
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [timeout]);

  return (
    <Flex
      fontSize="16px"
      color="white"
      p="20px"
      bg="#55556A"
      rounded="5px"
      align="center"
      justify="center"
      whiteSpace="pre-line"
    >
      <Icon as={FaRegCheckCircle} mr="8px" h="100%" />

      <Box mr="64px">{title}</Box>

      <Box
        fontWeight="bold"
        textDecoration="underline"
        cursor="pointer"
        onClick={() => {
          clearTimeout(timeout);
          toast.closeAll();
        }}
      >
        Deshacer
      </Box>
    </Flex>
  );
};

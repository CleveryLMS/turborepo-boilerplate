import React from 'react';

import { Flex, Box, Center } from '@chakra-ui/react';

type StepperProps = {
  steps: number;
  currentStep: number;
};

export const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <Flex align="center" minW={{ base: '300px', sm: '400px' }} w="30%">
      {Array.from(Array(steps).keys()).map((num: number) => (
        <React.Fragment key={'stepper-step-' + num}>
          <Center
            minW="32px"
            h="32px"
            rounded="50%"
            fontSize="16px"
            fontWeight="semibold"
            bg={currentStep === num + 1 ? 'primary' : 'white'}
            color={currentStep === num + 1 ? 'white' : 'gray_4'}
            borderColor={currentStep === num + 1 ? 'primary' : 'gray_5'}
            border="2px solid"
          >
            {num + 1}
          </Center>

          <Box h="2px" w="100%" bg="gray_5" _last={{ display: 'none' }} />
        </React.Fragment>
      ))}
    </Flex>
  );
};

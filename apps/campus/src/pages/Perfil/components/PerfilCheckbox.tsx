import { ChangeEvent } from 'react';

import { Flex, Box, Checkbox } from '@chakra-ui/react';

type PerfilCheckboxProps = {
  name: string;
  label?: string;
  title?: string;
  isDisabled?: boolean;
  defaultValue?: boolean;
  onChange?: (e?: any) => void;
};

export const PerfilCheckbox = ({
  name,
  label,
  title,
  isDisabled,
  defaultValue,
  onChange = () => {},
}: PerfilCheckboxProps) => {
  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    console.log({ event });
    onChange({ [name]: event.target.value });
  }

  return (
    <Flex w="100%" direction="column" mb="24px">
      {label && (
        <Box fontSize="14px" fontWeight="bold" mb="10px">
          {label}
        </Box>
      )}

      <Checkbox
        onChange={handleInput}
        isDisabled={isDisabled}
        defaultChecked={defaultValue}
      >
        {title}
      </Checkbox>
    </Flex>
  );
};

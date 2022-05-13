import { useState, useEffect } from 'react';

import { Text, Flex, Box, InputGroup, Input } from '@chakra-ui/react';

type PerfilInputProps = {
  name: string;
  label: string;
  isDisabled?: boolean;
  onChange?: (e?: any) => void;
  defaultValue?: any;
  placeholder?: string;
  onValidate?: (e?: any) => Promise<any>;
};

export const PerfilInput = ({ name, label, isDisabled, onChange, defaultValue, placeholder, onValidate }: PerfilInputProps) => {
  const [value, setValue] = useState<string>('');
  const [errors, setErrors] = useState<string>();

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  function handleInput(event: any) {
    setValue(event.target.value);
    if (errors) setErrors('');
  }

  async function handleBlur(event: any) {
    if (onValidate) {
      const _errors = await onValidate(value);

      if (onChange && !_errors) onChange({ [name]: value });
      else if (_errors) setErrors(_errors);
    }
  }

  return (
    <Flex w="100%" direction="column" mb="24px">
      <Box fontSize="14px" fontWeight="bold" mb="10px">
        {label}
      </Box>

      <InputGroup h="fit-content" mb="8px">
        <Input
          isDisabled={isDisabled}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={handleInput}
          onBlur={handleBlur}
          p="0px 12px"
          h="40px"
          fontWeight="medium"
          fontSize="16px"
          rounded="8px"
          border="1px solid var(--chakra-colors-gray_3)"
          _placeholder={{ color: 'gray_4' }}
          bg="gray_2"
        />

        {/* <InputRightElement children={<Icon as={BiPencil} boxSize="24px" />} /> */}
      </InputGroup>

      {errors && (
        <Text color="cancel" fontSize="14px">
          {errors}
        </Text>
      )}
    </Flex>
  );
};

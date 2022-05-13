import { useState, useEffect } from 'react';

import { Flex, Box, Input } from '@chakra-ui/react';

type FilterInputProps = {
  label: string;
  name: string;
  type?: string;
  isDisabled?: boolean;
  placeholder?: string;
  defaultValue?: any;
  updateValue: (e?: any) => any;
};

export const FilterInput = ({ label, name, type, placeholder, isDisabled, defaultValue, updateValue }: FilterInputProps) => {
  const [value, setValue] = useState<any>(defaultValue);
  const [timeoutkey, setTimeoutkey] = useState<any>();

  useEffect(() => {
    if (timeoutkey) {
      clearTimeout(timeoutkey);
      setTimeoutkey(undefined);
    }

    setValue(defaultValue);
  }, [defaultValue]);

  function onChange(event: any) {
    const value = event.target.value;

    setValue(value);
  }

  function onBlur() {
    updateValue({ [name]: value });
  }

  return (
    <Flex w="100%" direction="column" gap="12px">
      <Box as="label" fontSize="14px" lineHeight="16px" fontWeight="bold">
        {label}
      </Box>

      <Input
        bg="gray_1"
        rounded="8px"
        color="black"
        type={type}
        onBlur={onBlur}
        onChange={onChange}
        value={value || ''}
        isDisabled={isDisabled}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e?.key === 'Enter') onBlur();
        }}
      />
    </Flex>
  );
};

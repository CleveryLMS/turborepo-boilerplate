import { useState, useEffect } from 'react';

import { Flex, Box, Input } from '@chakra-ui/react';

type FilterRangeInputProps = {
  label: string;
  isDisabled?: boolean;

  minInput: {
    name: string;
    placeholder?: string;
    defaultValue?: number;
  };

  maxInput: {
    name: string;
    placeholder?: string;
    defaultValue?: number;
  };

  updateValue: (e?: any) => any;
};

export const FilterRangeInput = ({ label, isDisabled, updateValue, minInput, maxInput }: FilterRangeInputProps) => {
  const [valueMin, setValueMin] = useState<any>(minInput.defaultValue);
  const [valueMax, setValueMax] = useState<any>(maxInput.defaultValue);
  const [timeoutkey, setTimeoutkey] = useState<any>();

  useEffect(() => {
    if (timeoutkey) {
      clearTimeout(timeoutkey);
      setTimeoutkey(undefined);
    }

    setValueMin(minInput.defaultValue);
    setValueMax(maxInput.defaultValue);
  }, [minInput.defaultValue, maxInput.defaultValue]);

  function onChangeMin(event: any) {
    const value = event.target.value;

    setValueMin(value);
  }

  function onChangeMax(event: any) {
    const value = event.target.value;

    setValueMax(value);
  }

  function onBlur() {
    updateValue({ [minInput.name]: valueMin, [maxInput.name]: valueMax });
  }

  return (
    <Flex w="100%" direction="column" gap="12px">
      <Box as="label" fontSize="14px" lineHeight="16px" fontWeight="bold">
        {label}
      </Box>

      <Flex direction="row" gap="10px" align="center" justify="center">
        <Input
          bg="gray_1"
          rounded="8px"
          color="black"
          type="number"
          onBlur={onBlur}
          onChange={onChangeMin}
          value={valueMin || 0}
          isDisabled={isDisabled}
          placeholder={minInput.placeholder}
          onKeyDown={(e) => {
            if (e?.key === 'Enter') onBlur();
          }}
        />

        <Box fontWeight="bold">-</Box>

        <Input
          bg="gray_1"
          rounded="8px"
          color="black"
          type="number"
          onBlur={onBlur}
          onChange={onChangeMax}
          value={valueMax || 0}
          isDisabled={isDisabled}
          placeholder={maxInput.placeholder}
          onKeyDown={(e) => {
            if (e?.key === 'Enter') onBlur();
          }}
        />
      </Flex>
    </Flex>
  );
};

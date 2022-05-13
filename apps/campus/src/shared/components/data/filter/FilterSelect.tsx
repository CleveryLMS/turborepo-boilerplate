import { useState, useEffect } from 'react';

import Select from 'react-select';
import { Box, Flex } from '@chakra-ui/react';

type SelectInputProps = {
  label: string;
  name: string;
  placeholder?: string;

  defaultValue?: { label: string; value: any };

  options?: { label: string; value: any }[];

  isMulti?: boolean;

  updateValue: (e?: any) => any;
};

export const SelectInput = ({
  label,
  name,
  defaultValue,
  options,
  isMulti,
  placeholder,
  updateValue,
}: SelectInputProps) => {
  const [value, setValue] = useState<any>(defaultValue);
  const [update, setUpdate] = useState<'idle' | 'editing' | 'loading'>('idle');

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (isMulti) setValue(defaultValue);
    else setValue({ label: defaultValue?.label, value: defaultValue?.value });
  }, [defaultValue]);

  const onChange = (e: any) => {
    setUpdate('loading');

    if (isMulti)
      updateValue({ [name]: [...e?.map((item: any) => item.value)] }).then(
        (res: any) => setUpdate('idle')
      );
    else if (e !== null)
      updateValue({ [name]: e.value }).then((res: any) => setUpdate('idle'));
    else updateValue({ [name]: null }).then((res: any) => setUpdate('idle'));
  };

  return (
    <Flex w="100%" direction="column" gap="12px">
      <Box as="label" fontSize="14px" lineHeight="16px" fontWeight="bold">
        {label}
      </Box>

      <Select
        value={value}
        isMulti={isMulti}
        options={options}
        onChange={onChange}
        styles={selectStyles}
        placeholder={placeholder}
        closeMenuOnSelect
      />
    </Flex>
  );
};

const selectStyles = {
  container: (styles: any, { isDisabled }: any) => ({
    ...styles,
    cursor: isDisabled ? 'not-allowed' : 'default',
  }),
  singleValue: (styles: any) => ({
    ...styles,
    color: 'var(--chakra-colors-black)',
    fontWeight: 'normal',
  }),
  indicatorSeparator: (styles: any) => ({ display: 'none' }),
  control: (styles: any) => ({
    ...styles,
    background: 'var(--chakra-colors-gray_1)',
    borderRadius: '8px',
    border: 'none',
  }),
  option: (styles: any, { isFocused }: any) => ({
    ...styles,
    cursor: 'pointer',
    textAlign: 'left',
    color: 'var(--chakra-colors-black)',
    backgroundColor: isFocused
      ? 'var(--chakra-colors-primary_light)'
      : 'var(--chakra-colors-white)',
    fontWeight: 'medium',
  }),
};

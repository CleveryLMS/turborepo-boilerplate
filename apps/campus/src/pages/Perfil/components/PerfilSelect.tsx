import { useEffect, useState } from 'react';

import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { Flex, Box, InputGroup } from '@chakra-ui/react';

type PerfilSelectProps = {
  name: string;
  label: string;
  options: any[];
  placeholder?: string;
  onChange: (e?: any) => void;
  defaultValue?: any;
  isDisabled?: boolean;
};

export const PerfilSelect = ({
  name,
  label,
  options,
  placeholder,
  onChange,
  defaultValue,
  isDisabled = false,
}: PerfilSelectProps) => {
  function handleOnChange(event: any) {
    onChange(event.value);
  }

  return (
    <Flex w="100%" direction="column" mb="24px">
      <Box fontSize="14px" fontWeight="bold" mb="10px">
        {label}
      </Box>

      <InputGroup h="fit-content">
        <Select
          name={name}
          isDisabled={isDisabled}
          defaultValue={defaultValue}
          placeholder={placeholder}
          onChange={handleOnChange}
          options={options}
          styles={selectStyles}
        />
      </InputGroup>
    </Flex>
  );
};

export const PerfilAsyncSelect = ({
  isDisabled,
  name,
  loadOptions,
  onChange,
  defaultValue = null,
  placeholder,
  label,
  defaultOptions,
}: any) => {
  const [value, setValue] = useState(defaultValue);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setValue(defaultValue ? { ...defaultValue } : null);
  }, [defaultValue]);

  function handleOnChange(event: any) {
    setValue(event);
    onChange(event.value);
  }

  return (
    <Flex w="100%" direction="column">
      <Box fontSize="17px" fontWeight="semibold" mb="10px">
        {label}
      </Box>

      <InputGroup h="fit-content">
        <AsyncSelect
          name={name}
          value={value}
          isSearchable
          closeMenuOnSelect
          styles={selectStyles}
          isDisabled={isDisabled}
          onChange={handleOnChange}
          placeholder={placeholder}
          loadOptions={loadOptions}
          onInputChange={setInputValue}
          defaultOptions={defaultOptions}
          loadingMessage={() => 'Buscando información...'}
          noOptionsMessage={() =>
            inputValue !== ''
              ? 'No se encuentran resultados'
              : 'Escribe para mostrar opciones...'
          }
        />
      </InputGroup>
    </Flex>
  );
};

const selectStyles = {
  indicatorSeparator: (styles: any) => ({ ...styles, display: 'none' }),
  control: (styles: any, { isDisabled }: any) => ({
    ...styles,
    cursor: isDisabled ? 'not-allowed' : 'default',
    border: '1px solid var(--chakra-colors-gray_3)',
    backgroundColor: 'var(--chakra-colors-gray_2)',
    borderRadius: '12px',
    padding: '0px 12px',
    textAlign: 'left',
    height: '40px',
  }),
  dropdownIndicator: (styles: any) => ({
    ...styles,
    color: 'var(--chakra-colors-black)',
  }),
  container: (styles: any) => ({ ...styles, width: '100%' }),
  menu: (styles: any) => ({
    ...styles,
    backgroundColor: 'var(--chakra-colors-white)',
  }),
  valueContainer: (styles: any) => ({ ...styles, padding: '0px' }),
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
  singleValue: (styles: any) => ({
    ...styles,
    color: 'var(--chakra-colors-black)',
    fontWeight: 'medium',
  }),
};

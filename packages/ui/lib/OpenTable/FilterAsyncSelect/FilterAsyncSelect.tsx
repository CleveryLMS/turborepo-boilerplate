import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';

import AsyncSelect from 'react-select/async';

type FilterAsyncSelectProps = {
  value?: any;
  loadOptions: any;
  onChange: (e?: any) => any;
  placeholder?: string;
  isMulti?: boolean;
  isClearable?: boolean;
  defaultOptions?: any;
  debounceDeps: any[];
};

export const FilterAsyncSelect = ({
  value,
  loadOptions,
  onChange,
  placeholder,
  isMulti,
  isClearable = true,
  defaultOptions,
  debounceDeps = [],
}: FilterAsyncSelectProps) => {
  const [_value, setValue] = useState(value);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (value !== undefined) setValue(value);
  }, [value]);

  const handleChange = (e: any) => {
    setValue(e);
    onChange(e);
  };

  const _loadOptions = useCallback(
    debounce((inputValue, callback) => {
      loadOptions(inputValue).then((options: any) => callback(options));
    }, 350),
    [...debounceDeps]
  );

  return (
    <AsyncSelect
      value={_value}
      isMulti={isMulti}
      loadOptions={_loadOptions}
      onChange={handleChange}
      onInputChange={setInputValue}
      placeholder={placeholder}
      isClearable={isClearable}
      defaultOptions={defaultOptions}
      styles={filterSelectStyles}
      loadingMessage={() => 'Buscando información...'}
      closeMenuOnSelect={!isMulti}
      noOptionsMessage={() =>
        inputValue !== ''
          ? 'No se encuentran resultados'
          : 'Escribe para mostrar opciones...'
      }
    />
  );
};

const filterSelectStyles = {
  control: (styles: any, { isFocused }: any) => ({
    ...styles,
    backgroundColor: 'white',
    border: '1px solid #E7E7E7',
  }),
  singleValue: (styles: any) => ({
    ...styles,
    color: '#131340',
    fontSize: '12px',
    fontWeight: '500',
  }),
  placeholder: (styles: any) => ({
    ...styles,
    color: '#C7C8CD',
    fontSize: '12px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  }),
  noOptionsMessage: (styles: any) => ({
    ...styles,
    fontSize: '16px',
    textAlign: 'left',
  }),
  indicatorSeparator: (styles: any) => ({ ...styles, display: 'none' }),
  dropdownIndicator: (styles: any) => ({ ...styles, color: '#A3A3B4' }),
  option: (styles: any, { isFocused }: any) => ({
    ...styles,
    backgroundColor: isFocused ? '#E8EDFF' : 'white',
    color: '#131340',
    fontSize: '16px',
  }),
};

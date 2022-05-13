import { useState, useCallback } from 'react';

import { Field } from 'formik';
import { debounce } from 'lodash';
import AsyncSelect from 'react-select/async';
import { FormLabel, FormControl, FormErrorMessage } from '@chakra-ui/react';

export const FormAsyncSelect = ({
  name,
  label,
  loadOptions,
  placeholder,
  isMulti = false,
  defaultValue,
  closeMenuOnSelect = true,
  isSearchable = true,
  isClearable = false,
  controlStyle = {},
  isDisabled = false,
  onChangeCallback = (e: any) => {},
}: any) => {
  const [inputValue, setInputValue] = useState('');

  const onChange = (e: any, form: any) => {
    if (isMulti)
      form.setFieldValue(name, [...e?.map((item: any) => item.value)]);
    else form.setFieldValue(name, e !== null ? e.value : null);

    if (onChangeCallback) onChangeCallback(e);
  };

  const _loadOptions = useCallback(
    debounce((inputValue, callback) => {
      loadOptions(inputValue).then((options: any) => callback(options));
    }, 350),
    []
  );

  return (
    <Field name={name}>
      {({ form }: { field: any; form: any }) => (
        <FormControl
          style={controlStyle}
          isInvalid={form.errors[name] && form.touched[name]}
        >
          <FormLabel className="form-label" htmlFor={name} color="black">
            {label}
          </FormLabel>

          <AsyncSelect
            isMulti={isMulti}
            styles={selectStyles}
            isDisabled={isDisabled}
            isClearable={isClearable}
            placeholder={placeholder}
            loadOptions={_loadOptions}
            isSearchable={isSearchable}
            defaultValue={defaultValue}
            onInputChange={setInputValue}
            onChange={(e) => onChange(e, form)}
            loadingMessage={() => 'Buscando información...'}
            closeMenuOnSelect={closeMenuOnSelect}
            noOptionsMessage={() =>
              inputValue !== ''
                ? 'No se encuentran resultados'
                : 'Escribe para mostrar opciones...'
            }
          />
          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

const selectStyles = {
  noOptionsMessage: (styles: any) => ({
    ...styles,
    fontSize: '16px',
    textAlign: 'left',
  }),
  indicatorSeparator: (styles: any) => ({ display: 'none' }),
  control: (styles: any, { isDisabled }: any) => ({
    ...styles,
    cursor: isDisabled ? 'not-allowed' : 'default',
    border: '1px solid var(--chakra-colors-gray_3)',
    backgroundColor: 'var(--chakra-colors-gray_2)',
    borderRadius: '12px',
    paddingLeft: '15px',
    textAlign: 'left',
    height: '45px',
  }),
  container: (styles: any) => ({ ...styles, width: '100%' }),
  valueContainer: (styles: any) => ({ ...styles, padding: '0px' }),
  dropdownIndicator: (styles: any) => ({ display: 'none' }),
  menu: (styles: any) => ({
    ...styles,
    backgroundColor: 'var(--chakra-colors-white)',
  }),
  option: (styles: any) => ({
    ...styles,
    textAlign: 'left',
    color: 'var(--chakra-colors-black)',
    backgroundColor: 'var(--chakra-colors-white)',
    fontWeight: 'medium',
  }),
  singleValue: (styles: any) => ({
    ...styles,
    color: 'var(--chakra-colors-black)',
    fontWeight: 'medium',
    fontSize: '14px',
  }),
  placeholder: (styles: any) => ({
    ...styles,
    fontWeight: 'medium',
    fontSize: '14px',
  }),
};

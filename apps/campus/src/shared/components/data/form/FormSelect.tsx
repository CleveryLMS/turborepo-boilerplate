import React, { useEffect, useState } from 'react';

import * as _Select from 'react-select';

import { Field } from 'formik';
import { FormLabel, FormControl, FormErrorMessage } from '@chakra-ui/react';

export const Select = (props: any) => {
  return <_Select.default {...props} />;
};

export const FormSelect = ({
  name,
  label,
  options,
  placeholder,
  isMulti = false,
  defaultValue,
  isSearchable = true,
  isDisabled = false,
  isClearable = false,
  controlStyle = {},
  isOptionDisabled,
  style = {},
}: any) => {
  const [_value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const onChange = (e: any, form: any) => {
    if (isMulti)
      form.setFieldValue(name, [...e?.map((item: any) => item.value)]);
    else form.setFieldValue(name, e !== null ? e.value : null);
  };

  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl
          style={controlStyle}
          isInvalid={form.errors[name] && form.touched[name]}
        >
          <FormLabel className="form-label" htmlFor={name} color="#84889A">
            {label}
          </FormLabel>

          <Select
            name={name}
            isMulti={isMulti}
            options={options}
            styles={selectStyles}
            isDisabled={isDisabled}
            isClearable={isClearable}
            placeholder={placeholder}
            isSearchable={isSearchable}
            closeMenuOnSelect={!isMulti}
            isOptionDisabled={isOptionDisabled}
            onChange={(option: any) => onChange(option, form)}
            value={
              options
                ? options.find((option: any) => option.value === field.value) ||
                  null
                : ''
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
    fontSize: '14px',
  }),
  placeholder: (styles: any) => ({
    ...styles,
    fontWeight: 'medium',
    fontSize: '14px',
  }),
};

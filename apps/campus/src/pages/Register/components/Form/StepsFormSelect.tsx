import { useState, useEffect } from 'react';

import { Field } from 'formik';
import Select, { components } from 'react-select';
import { BiCheckCircle } from 'react-icons/bi';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
  Flex,
  Icon,
} from '@chakra-ui/react';

import '../../Register.scss';

export const StepsFormSelect = ({
  name,
  label,
  options,
  placeholder,
  defaultValue,
  onChange,
  ...props
}: any) => {
  const [_value, setValue] = useState(defaultValue);
  const [showCheck, setShowCheck] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const _onChange = (e: any, form: any) => {
    if (onChange) onChange(e);
    setShowCheck(true);
    form.setFieldValue(name, e !== null ? e.value : null);
  };

  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl
          className="steps-form--form-control"
          isInvalid={form.errors[name] && form.touched[name]}
        >
          <FormLabel className="steps-form--form-control--label" htmlFor={name}>
            <Text variant="h5_heading">{label}</Text>
          </FormLabel>

          <Flex
            align="center"
            position="relative"
            maxW={{
              base: showCheck && !form.errors[name] ? '90%' : '100%',
              sm: '100%',
            }}
            {...props}
          >
            <Select
              name={name}
              options={options}
              styles={selectStyles}
              placeholder={placeholder}
              onInputChange={setInputValue}
              onChange={(option: any) => _onChange(option, form)}
              noOptionsMessage={() =>
                inputValue !== ''
                  ? 'Sin opciones disponibles'
                  : 'Escribe para mostrar opciones...'
              }
              value={
                options
                  ? options.find((o: any) => o.value === field.value) || null
                  : ''
              }
              components={{ Option: CustomOption }}
            />

            {showCheck && !form.errors[name] && (
              <Icon
                as={BiCheckCircle}
                position="absolute"
                right="-32px"
                color="primary"
                boxSize="24px"
              />
            )}
          </Flex>

          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

const CustomOption = (props: any) =>
  components.Option && (
    <components.Option
      {...props}
      innerProps={Object.assign(
        {},
        props?.innerProps,
        props?.data['data-cy'] ? { 'data-cy': props?.data['data-cy'] } : {}
      )}
    />
  );

const selectStyles = {
  indicatorSeparator: (styles: any) => ({ display: 'none' }),
  control: (styles: any, { isDisabled }: any) => ({
    ...styles,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    border: '1px solid var(--chakra-colors-gray_3)',
    backgroundColor: 'var(--chakra-colors-white)',
    borderRadius: '13px',
    padding: '12px 15px',
    textAlign: 'left',
    width: '100%',
  }),
  placeholder: (styles: any) => ({
    ...styles,
    color: 'var(--chakra-colors-gray_4)',
  }),
  indicatorDropdown: (styles: any) => ({
    ...styles,
    color: 'var(--chakra-colors-gray_3)',
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
    fontWeight: 'medium',
    color: 'var(--chakra-colors-black)',
    backgroundColor: isFocused
      ? 'var(--chakra-colors-primary_light)'
      : 'var(--chakra-colors-white)',
  }),
  singleValue: (styles: any) => ({
    ...styles,
    color: 'var(--chakra-colors-black)',
    fontWeight: 500,
    fontSize: '14px',
  }),
};

import React from 'react';

import { Field } from 'formik';
import {
  Box,
  Checkbox,
  FormLabel,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';

type FormCheckboxProps = {
  inputRef?: any;
  name: string;
  label?: string;
  onBlur?: (e?: any) => void | any;
  labelColor?: string;
  controlStyle?: React.CSSProperties;
  'data-cy'?: string;
};

export const StepsFormCheckbox = ({
  name,
  label,
  controlStyle = {},
  labelColor,
  inputRef,
  onBlur,
  ...props
}: FormCheckboxProps) => {
  const onChange = (value: any, form: any) => {
    form.setFieldValue(name, value);
  };

  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl
          style={controlStyle}
          isInvalid={form.errors[name] && form.touched[name]}
        >
          {label && (
            <FormLabel
              htmlFor={name}
              className="form-label"
              color={labelColor || 'black'}
            >
              {label}
            </FormLabel>
          )}

          <Checkbox
            {...field}
            isChecked={field.value || false}
            onChange={(e) => onChange(e.target.checked, form)}
            {...props}
          >
            Acepto los{' '}
            <Box
              as="a"
              target="_blank"
              textDecoration="underline"
              href={
                process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS'
                  ? 'https://open-marketers.com/politica-privacidad'
                  : 'https://open-marketers.com/terminos-condiciones'
              }
            >
              Términos y Condiciones
            </Box>
            .
          </Checkbox>

          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

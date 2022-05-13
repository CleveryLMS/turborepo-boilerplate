import { Field } from 'formik';
import { FormLabel, FormControl, FormErrorMessage } from '@chakra-ui/react';

import { OpenEditor } from '../../OpenEditor';

import 'react-quill/dist/quill.bubble.css';

export const FormTextEditor = ({
  name,
  label,
  placeholder,
  controlStyle = {},
  onBlur = () => {},
  isDisabled = false,
}: any) => {
  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl
          style={controlStyle}
          isInvalid={form.errors[name] && form.touched[name]}
        >
          <FormLabel className="form-label" htmlFor={name} color="black">
            {label}
          </FormLabel>

          <OpenEditor
            value={field.value}
            placeholder={placeholder}
            onChange={(data: any) => form.setFieldValue(name, data)}
          />

          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

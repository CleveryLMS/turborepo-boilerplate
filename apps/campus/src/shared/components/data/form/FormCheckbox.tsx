import { Field } from 'formik';
import { FormControl, FormErrorMessage, Checkbox as ChakraCheckbox } from '@chakra-ui/react';

export const Checkbox = ({
  name,
  label,
  style = {},
  controlStyle = {},
  onBlur = () => {},
  isDisabled = false,
}: any) => {
  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl style={controlStyle} isInvalid={form.errors[name] && form.touched[name]}>
          <ChakraCheckbox {...field} style={style} id={name} onBlur={onBlur} isDisabled={isDisabled}>
            {label}
          </ChakraCheckbox>

          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

import { useState } from 'react';

import { Field } from 'formik';
import { BiHide, BiShow } from 'react-icons/bi';
import { FormControl, FormLabel, Input, FormErrorMessage, InputRightElement, InputGroup, Icon, Text } from '@chakra-ui/react';

import '../../OnBoarding.scss';

export const StepsTextInput = ({
  type,
  name,
  label,
  placeholder,
  validate,
  isDisabled = false,
}: {
  isDisabled?: boolean;
  type?: any;
  name: string;
  label: string;
  placeholder?: string;
  validate?: (value: any) => any;
}) => {
  const [show, setShow] = useState(false);

  return (
    <Field name={name} validate={validate}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl className="steps-form--form-control" isInvalid={form.errors[name] && form.touched[name]}>
          <FormLabel className="steps-form--form-control--label" htmlFor={name}>
            <Text variant="h5_heading"> {label}</Text>
          </FormLabel>

          <InputGroup>
            <Input
              {...field}
              id={name}
              type={type === 'password' ? (show ? 'text' : 'password') : type}
              rounded="13px"
              p="12px 15px"
              fontSize="14px"
              color="black"
              isDisabled={isDisabled}
              fontWeight="medium"
              border="1px solid"
              borderColor="#E6E8EE"
              placeholder={placeholder}
              value={field.value || ''}
              _placeholder={{ color: '#878EA0' }}
            />

            {type === 'password' && (
              <InputRightElement>
                <Icon as={show ? BiHide : BiShow} cursor={'pointer'} onClick={() => setShow(!show)}>
                  {show ? 'Hide' : 'Show'}
                </Icon>
              </InputRightElement>
            )}
          </InputGroup>

          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

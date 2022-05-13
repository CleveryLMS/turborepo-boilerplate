import { useState } from 'react';

import { isMobile } from 'react-device-detect';
import { Field, useFormikContext, FormikContextType } from 'formik';
import { BiCheckCircle, BiHide, BiShow } from 'react-icons/bi';
import {
  Flex,
  Icon,
  Text,
  Input,
  InputGroup,
  FormLabel,
  FormControl,
  FormErrorMessage,
  InputRightElement,
} from '@chakra-ui/react';

import '../../Register.scss';

type StepsTextInputProps = {
  type?: any;
  name: string;
  label: string;
  placeholder?: string;
  validate?: (value: any, form: FormikContextType<any>) => any;
  'data-cy'?: string;

  autoComplete?: 'on' | 'off';
  showErrorWithoutTouch?: boolean;
};

export const StepsTextInput = ({
  type,
  name,
  label,
  placeholder,
  autoComplete,
  showErrorWithoutTouch,
  validate,
  ...props
}: StepsTextInputProps) => {
  const form = useFormikContext();

  const [show, setShow] = useState<boolean>(false);
  const [showCheck, setShowCheck] = useState<boolean>(false);

  return (
    <Field name={name} validate={validate}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl
          className="steps-form--form-control"
          isInvalid={
            form.errors[name] && (showErrorWithoutTouch || form.touched[name])
          }
        >
          <FormLabel className="steps-form--form-control--label" htmlFor={name}>
            <Text variant="h5_heading">{label}</Text>
          </FormLabel>

          <Flex align="center" position="relative" w="100%">
            <InputGroup w="100%">
              <Input
                {...field}
                id={name}
                w="100%"
                bg="white"
                p="12px 15px"
                color="black"
                rounded="13px"
                fontSize="14px"
                fontWeight="medium"
                border="1px solid"
                borderColor="gray_3"
                placeholder={placeholder}
                value={field.value || ''}
                transition="all 0.3s linear"
                _placeholder={{ color: '#878EA0' }}
                type={type === 'password' ? (show ? 'text' : 'password') : type}
                _focus={{
                  border: 'none',
                  boxShadow: '0 0 0 3px var(--chakra-colors-primary)',
                }}
                onBlur={(e) => {
                  setShowCheck(true);
                  if (field.onBlur) field.onBlur(e);
                }}
                {...props}
              />

              {isMobile && showCheck && !form.errors[name] && field.value && (
                <InputRightElement>
                  <Icon
                    as={BiCheckCircle}
                    color="primary"
                    boxSize="24px"
                    mr={type === 'password' ? '50px' : ''}
                  />
                </InputRightElement>
              )}

              {type === 'password' && (
                <InputRightElement>
                  <Icon
                    cursor="pointer"
                    as={show ? BiHide : BiShow}
                    onClick={() => setShow(!show)}
                  >
                    {show ? 'Hide' : 'Show'}
                  </Icon>
                </InputRightElement>
              )}
            </InputGroup>

            {!isMobile && showCheck && !form.errors[name] && field.value && (
              <Icon
                as={BiCheckCircle}
                right="-32px"
                boxSize="24px"
                color="primary"
                position="absolute"
              />
            )}
          </Flex>

          <Flex h="fit-content" minH="22px" mt={{ base: '5px', sm: '0' }}>
            <FormErrorMessage pt="5px" m="0">
              {form.errors[name]}
            </FormErrorMessage>
          </Flex>
        </FormControl>
      )}
    </Field>
  );
};

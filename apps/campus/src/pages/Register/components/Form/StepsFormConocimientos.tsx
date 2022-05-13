import { Field } from 'formik';
import {
  Text,
  Image,
  FormControl,
  Flex,
  FormErrorMessage,
} from '@chakra-ui/react';

import AvanzadoOB from '../../../../assets/onboarding/openbootcamp/AvanzadoIMG.png';
import AvanzadoOM from '../../../../assets/onboarding/openmarketers/AvanzadoIMG.png';
import PrincipianteOB from '../../../../assets/onboarding/openbootcamp/PrincipianteIMG.png';
import PrincipianteOM from '../../../../assets/onboarding/openmarketers/PrincipianteIMG.png';

export const StepsFormConocimientos = ({ name }: { name: string }) => {
  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl
          className="steps-form--form-control"
          isInvalid={form.errors[name] && form.touched[name]}
        >
          <Flex
            gap="20px"
            align="center"
            justify="center"
            direction={{ base: 'column', sm: 'row' }}
          >
            <Card
              icon={
                process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS'
                  ? AvanzadoOM
                  : AvanzadoOB
              }
              data-cy="conocimientos_avanzado"
              title="Ya cuento con conocimientos"
              isActive={field.value === 'avanzado'}
              onClick={() => form.setFieldValue(name, 'avanzado')}
            />

            <Card
              icon={
                process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS'
                  ? PrincipianteOM
                  : PrincipianteOB
              }
              data-cy="conocimientos_principiante"
              title="Soy principiante"
              isActive={field.value === 'principiante'}
              onClick={() => form.setFieldValue(name, 'principiante')}
            />
          </Flex>
        </FormControl>
      )}
    </Field>
  );
};

const Card = ({
  title,
  icon,
  isActive,
  onClick,
  ...props
}: {
  title: string;
  icon: any;
  isActive: boolean;
  onClick: () => any;
  'data-cy'?: string;
}) => {
  return (
    <Flex
      tabIndex={-1}
      overflow="visible"
      direction="column"
      align="center"
      p="20px 24px"
      zIndex={1}
      cursor="pointer"
      transition="all 0.2s ease"
      mb={{ base: '20px', sm: 'unset' }}
      onClick={onClick}
      gap="19px"
      rounded="13px"
      border="1px solid"
      bg="white"
      minH="223px"
      minW={{ base: '290', sm: '396px' }}
      boxShadow={isActive ? '0px 2px 4px rgba(0, 0, 0, 0.22)' : ''}
      borderColor={isActive ? 'primary' : 'gray_5'}
      _hover={{
        zIndex: 2,
        transform: 'translate(0px, -5px)',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.22)',
      }}
      _focus={{
        zIndex: 2,
        transform: 'translate(0px, -5px)',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.22)',
      }}
      position="relative"
      {...props}
    >
      <Image
        src={icon}
        alt={title}
        maxW="300px"
        bottom="52px"
        position="absolute"
      />

      <Text variant="card_title" position="absolute" bottom="30px">
        {title}
      </Text>
    </Flex>
  );
};

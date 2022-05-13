import { useState, useEffect, useCallback, useRef } from 'react';

import * as Yup from 'yup';

import { debounce } from 'lodash';
import { Form, Formik } from 'formik';
import { BiLeftArrowAlt } from 'react-icons/bi';
import { Button, Flex, Text } from '@chakra-ui/react';

import { getItem, setItem, updateUser, checkIfUsernameExists } from 'data';
import { USER_ONBOARDING_ID, USER_ONBOARDING_STEP_CREDENCIALES } from '.';

import { Stepper, StepsTextInput } from '../../components';

import { LogoOBFullBlack } from 'apps/campus/src/assets/logos/openbootcamp/LogoOBFullBlack';
import { LogoOMFullBlack } from 'apps/campus/src/assets/logos/openmarketers/LogoOMFullBlack';
import { LogoImaginaFullBlack } from 'apps/campus/src/assets/logos/imagina/LogoImaginaFullBlack';

import '../../Register.scss';

type StepCredencialesProps = {
  totalSteps: number;
  currentStep: number;
  onNextStep: (nextStep?: number) => void;
  onPrevStep: () => void;
};

type StepCredencialesValues = {
  username: string;
  password: string;
  password_confirmation: string;
};

const validateUsername = debounce(async (value: string, resolve: (val: boolean) => void) => {
  let error = '',
    storageValues = getItem(USER_ONBOARDING_STEP_CREDENCIALES);

  const res: any = await checkIfUsernameExists({ username: value });

  if (res?.data?.exists !== false)
    if ((!storageValues?.username && value) || (value && value !== storageValues?.username))
      // Si el username ya está guardado en el LocalStorage y existe
      // en la BBDD implica que ya pasamos el primer paso.
      error = res?.data?.message || 'Este nombre de usuario ya está en uso.';

  return resolve(error === '');
}, 500);

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required('¡El username es obligatorio!')
    .typeError('El username es obligatorio.')
    .matches(/^[a-z0-9_]+$/, 'El nombre de usuario solo puede contener letras minúsculas, números y "_".')
    .test(
      'Username duplicado',
      'Este nombre de usuario ya está en uso.',
      async (value) => new Promise((resolve) => validateUsername(value || '', resolve))
    ),
  password: Yup.string()
    .required('Introduce una contraseña.')
    .min(8, 'Contraseña muy corta. Debe tener como mínimo 8 carácteres.')
    .max(50, 'Contraseña muy larga. Debe tener como máximo 50 carácteres.')
    .matches(/(?=.*\d){1}/, 'La contraseña debe contener al menos un número.')
    .matches(/(?=.*[a-z]){1}/, 'La contraseña debe contener al menos una letra en minúscula.')
    .matches(/(?=.*[A-Z]){1}/, 'La contraseña debe contener al menos una letra en mayúscula.')
    .matches(/(?=.[!@#$%^&()-=+{};:,<.>]){1}/, 'La contraseña debe contener al menos un carácter especial.')
    .test('Espacios en blanco', '¡La contraseña no puede contener espacios en blanco!', (value) => !/(\s)/g.test(value || ''))
    .typeError('Introduce tu contraseña.'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir.')
    .required('Las contraseñas deben coincidir.'),
});

const onKeyDown = (keyEvent: any) => {
  if ((keyEvent.charCode || keyEvent.keyCode) === 13) keyEvent.stopPropagation();
};

const StepCredenciales = ({ totalSteps, currentStep, onNextStep, onPrevStep }: StepCredencialesProps) => {
  const formik = useRef<any>();

  const [initialValues, setInitialValues] = useState<StepCredencialesValues>({
    username: '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    let storageValues = getItem(USER_ONBOARDING_STEP_CREDENCIALES);

    if (storageValues)
      setInitialValues({
        username: storageValues?.username,
        password: storageValues?.password,
        password_confirmation: storageValues?.password_confirmation,
      });
  }, []);

  const onSubmit = async (values: StepCredencialesValues) => {
    let storageId = getItem(USER_ONBOARDING_ID);
    let storageValues = getItem(USER_ONBOARDING_STEP_CREDENCIALES);

    // Si tenemos valores en el localstorage IGUALES a los del formulario
    // y tenemos ya un userID en el localStorage, saltamos la actualización del usuario.
    if (
      storageId &&
      storageValues?.username === values?.username &&
      storageValues?.password === values?.password &&
      storageValues?.password_confirmation === values?.password_confirmation
    ) {
      onNextStep();
      return;
    }

    // Guardamos los valores en el localStorage por si perdemos sesión
    setItem(USER_ONBOARDING_STEP_CREDENCIALES, {
      username: values?.username,
      password: values?.password,
      password_confirmation: values?.password_confirmation,
    });

    if (storageId)
      await updateUser({
        id: storageId,
        user: {
          username: values?.username,
          password: values?.password,
          password_confirmation: values?.password_confirmation,
        },
      });

    onNextStep();
  };

  return (
    <Flex
      boxSize="100%"
      align="center"
      justify="start"
      direction="column"
      pt={{ base: '45px', sm: '75px' }}
      gap={{ base: '30px', sm: '60px' }}
    >
      {process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? (
        <LogoOBFullBlack />
      ) : process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS' ? (
        <LogoOMFullBlack w="184" h="51" />
      ) : (
        <LogoImaginaFullBlack w="184" h="51" />
      )}

      <Stepper steps={totalSteps} currentStep={currentStep} />

      <Flex gap="10px" direction="column" align={{ base: 'start', sm: 'center' }}>
        <Text variant="h1_heading" data-cy="second_step__title">
          Elige tus credenciales
        </Text>

        <Text color="gray_4" variant="card_title" data-cy="second_step__description">
          Indícanos tu nombre de usuario y tu contraseña para acceder al campus.
        </Text>
      </Flex>

      <Flex w="100%" maxW="100%" direction="column">
        <Formik
          innerRef={formik}
          enableReinitialize
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {({ handleSubmit, isValid, isSubmitting, values }) => (
            <Form onSubmit={handleSubmit} onKeyDown={onKeyDown}>
              <Flex w="100%" mb="30px" gap="20px" maxW="100%" direction="column" data-cy="second_step__form">
                <StepsTextInput
                  name="username"
                  data-cy="username"
                  autoComplete="off"
                  label="Nombre de usuario:"
                  placeholder={process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS' ? 'marketer14' : 'desarrolladorpro14'}
                />

                <StepsTextInput
                  type="password"
                  name="password"
                  autoComplete="off"
                  label="Contraseña:"
                  data-cy="password"
                  placeholder="Debe contener 8 carácteres mínimo."
                />

                <StepsTextInput
                  type="password"
                  name="password_confirmation"
                  label="Repite la contraseña:"
                  data-cy="password_confirmation"
                  placeholder="Debe coinicidir con la anterior."
                />
              </Flex>

              <Flex
                w="100%"
                mt="50px"
                gap="12px"
                direction={{ base: 'column', sm: 'row' }}
                align={{ base: 'flex-end', sm: 'center' }}
                justify={{ base: 'center', sm: 'flex-end' }}
              >
                <Button
                  id="register_previous_button"
                  variant="outline"
                  onClick={onPrevStep}
                  isDisabled={isSubmitting}
                  leftIcon={<BiLeftArrowAlt />}
                >
                  Volver
                </Button>

                <Button
                  type="submit"
                  id="register_next_button"
                  variant="primary"
                  isLoading={isSubmitting}
                  isDisabled={!isValid || !values.username || !values.password || !values.password_confirmation}
                >
                  Siguiente paso
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Flex>
    </Flex>
  );
};

export default StepCredenciales;

/*
   

*/

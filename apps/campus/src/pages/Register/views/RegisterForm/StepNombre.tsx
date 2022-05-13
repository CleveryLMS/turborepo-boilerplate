import { useCallback, useEffect, useRef, useState } from 'react';

import * as Yup from 'yup';
import { debounce } from 'lodash';
import { Form, Formik } from 'formik';
import { BiLeftArrowAlt } from 'react-icons/bi';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

import { setItem, getItem, createUser, LOGIN_TOKEN, checkIfEmailExists } from 'data';
import { USER_ONBOARDING_ID, USER_ONBOARDING_TOKEN, USER_ONBOARDING_STEP_NOMBRE } from '.';
import { useQuery } from 'utils';
import { Stepper, StepsTextInput, StepsFormCheckbox } from '../../components';

import { LogoOBFullBlack } from 'apps/campus/src/assets/logos/openbootcamp/LogoOBFullBlack';
import { LogoOMFullBlack } from 'apps/campus/src/assets/logos/openmarketers/LogoOMFullBlack';
import { LogoImaginaFullBlack } from 'apps/campus/src/assets/logos/imagina/LogoImaginaFullBlack';

type StepNombreProps = {
  totalSteps: number;
  currentStep: number;
  onNextStep: (nextStep?: number) => void;
};

type StepNombreValues = {
  nombre: string;
  apellidos: string;
  email: string;
  terminos_condiciones: boolean;
};

const validateEmail = debounce(async (value: string, resolve: (val: boolean) => void) => {
  let error = '',
    storageValues = getItem(USER_ONBOARDING_STEP_NOMBRE);

  const res: any = await checkIfEmailExists({ email: value });

  if (res?.data?.exists !== false)
    if ((!storageValues?.email && value) || (value && value !== storageValues?.email))
      // Si el email ya está guardado en el LocalStorage y existe
      // en la BBDD implica que ya pasamos el primer paso.
      error = res?.data?.message || 'Este email ya está en uso.';

  return resolve(error === '');
}, 500);

const validationSchema = Yup.object().shape({
  nombre: Yup.string()
    .required('¡El nombre es obligatorio!')
    .typeError('El nombre es obligatorio.')
    .matches(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g, 'Por favor, introduce únicamente letras en este campo.')
    .test(
      'Espacios en blanco',
      '¡El nombre no puede contener espacios en blanco al principio o al final!',
      (value) => !/^\s+|\s+$/.test(value || '')
    ),
  apellidos: Yup.string()
    .required('¡Los apellidos son obligatorios!')
    .typeError('¡Los apellidos son obligatorios!')
    .matches(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g, 'Por favor, introduce únicamente letras en este campo.')
    .test(
      'Espacios en blanco',
      '¡Los apellidos no pueden contener espacios en blanco al principio o al final!',
      (value) => !/^\s+|\s+$/.test(value || '')
    ),
  email: Yup.string()
    .email('¡Escribe una dirección de email válida!')
    .required('¡El email es obligatorio!')
    .typeError('El email es obligatorio.')
    .test(
      'Espacios en blanco',
      '¡El email no puede contener espacios en blanco al principio o al final!',
      (value) => !/^\s+|\s+$/.test(value || '')
    )
    .test(
      'Email duplicado',
      'Este email ya está en uso.',
      async (value) =>
        // debounced function does not return Promise, can't use async/await
        new Promise((resolve) => validateEmail(value || '', resolve))
    ),
  terminos_condiciones: Yup.boolean()
    .oneOf([true], 'Debes aceptar para continuar.')
    .required('Debes aceptar para continuar.')
    .typeError('Debes aceptar para continuar.'),
});

const onKeyDown = (keyEvent: any) => {
  if ((keyEvent.charCode || keyEvent.keyCode) === 13) keyEvent.stopPropagation();
};

const StepNombre = ({ totalSteps, currentStep, onNextStep }: StepNombreProps) => {
  const formik = useRef<any>();

  const query = useQuery();
  const rndPassword = 'OpenBootcamp_' + Math.floor(Math.random() * 1001);

  const [initialValues, setInitialValues] = useState<StepNombreValues>({
    email: '',
    nombre: '',
    apellidos: '',
    terminos_condiciones: false,
  });

  useEffect(() => {
    let storageValues = getItem(USER_ONBOARDING_STEP_NOMBRE);

    if (storageValues)
      setInitialValues({
        email: storageValues?.email,
        nombre: storageValues?.nombre,
        apellidos: storageValues?.apellidos,
        terminos_condiciones: false,
      });
  }, []);

  const onSubmit = async (values: StepNombreValues) => {
    let storageId = getItem(USER_ONBOARDING_ID);
    let storageValues = getItem(USER_ONBOARDING_STEP_NOMBRE);

    // Si tenemos valores en el localstorage IGUALES a los del formulario
    // y tenemos ya un userID en el localStorage, saltamos la creación del usuario.
    if (
      storageId &&
      storageValues?.email === values.email &&
      storageValues?.nombre === values.nombre &&
      storageValues?.apellidos === values.apellidos
    ) {
      onNextStep();
      return;
    }

    // Guardamos los valores en el localStorage por si perdemos sesión
    setItem(USER_ONBOARDING_STEP_NOMBRE, {
      email: values?.email,
      nombre: values?.nombre,
      apellidos: values?.apellidos,
    });

    // Propiedades del usuario nuevo
    let userToCreate: any = {
      nombre: values?.nombre,
      apellidos: values?.apellidos,
      username: values?.email.substring(0, values?.email.lastIndexOf('@')) + Math.floor(Math.random() * 100001),
      email: values?.email,
      password: rndPassword,
      password_confirmation: rndPassword,
    };

    const campanya: any = query.get('campanya'),
      grupoAnalitica: any = query.get('grupo'),
      palabraClave: any = query.get('palabraClave');

    // Datos analítica
    if (campanya && grupoAnalitica && palabraClave) {
      // Actualizamos el usuario a crear con la analítica
      userToCreate = {
        ...userToCreate,
        campanya,
        grupoAnalitica,
        palabraClave,
      };
    }

    // Creamos al usuario
    await createUser({ user: userToCreate })
      .then((response) => {
        // Guardamos el ID y el token de acceso al campus.
        setItem(USER_ONBOARDING_ID, response.value.user.id);
        setItem(USER_ONBOARDING_TOKEN, response?.value?.token?.token);

        // Además guardamos el token para hacer el resto de peticiones de update
        setItem(LOGIN_TOKEN, response?.value?.token?.token);
      })
      .catch((error: any) => {
        console.log({ error });
        formik.current?.validateForm();
      });

    onNextStep();
  };

  return (
    <Flex
      maxW="100%"
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
        <Text variant="h1_heading" data-cy="first_step__title">
          ¡Bienvenido/a! Vamos a crear tu perfil
        </Text>

        <Text color="gray_4" fontSize="16px" variant="card_title" data-cy="first_step__description">
          Necesitamos que nos indiques unos datos antes de empezar.
        </Text>
      </Flex>

      <Flex w="100%" maxW="100%" direction="column">
        <Formik
          innerRef={formik}
          validateOnBlur
          enableReinitialize
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
        >
          {({ values, handleSubmit, isValid, isSubmitting }) => (
            <Form onSubmit={handleSubmit} onKeyDown={onKeyDown}>
              <Flex w="100%" mb="30px" gap="20px" maxW="100%" direction="column" data-cy="first_step__form">
                <StepsTextInput
                  name="email"
                  data-cy="email"
                  showErrorWithoutTouch
                  label="Indícanos tu email:"
                  placeholder="ejemplo@gmail.com"
                />

                <StepsTextInput name="nombre" label="Nombre:" placeholder="Nombre" data-cy="nombre" />

                <StepsTextInput name="apellidos" label="Apellidos:" placeholder="Apellido Apellido" data-cy="apellidos" />

                <Box as="p">
                  Al completar mis datos acepto la{' '}
                  <Box
                    as="a"
                    target="_blank"
                    textDecoration="underline"
                    href={
                      process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS'
                        ? 'https://open-marketers.com/politica-privacidad'
                        : 'https://open-bootcamp.com/politica-privacidad'
                    }
                  >
                    Política de Privacidad
                  </Box>
                  .
                </Box>

                <StepsFormCheckbox name="terminos_condiciones" data-cy="terminos_condiciones" />
              </Flex>

              <Flex
                w="100%"
                mt="50px"
                gap="12px"
                direction={{ base: 'column', sm: 'row' }}
                align={{ base: 'flex-end', sm: 'center' }}
                justify={{ base: 'center', sm: 'flex-end' }}
              >
                <Button isDisabled variant="outline" id="register_previous_button" leftIcon={<BiLeftArrowAlt />}>
                  Volver
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  id="register_next_button"
                  isLoading={isSubmitting}
                  isDisabled={!isValid || !values.email || !values.nombre || !values.apellidos}
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

export default StepNombre;

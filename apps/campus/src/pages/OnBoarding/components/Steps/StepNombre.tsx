import { useContext } from 'react';

import { Form as FormikForm, Formik } from 'formik';
import { Flex, Button, Text, Image } from '@chakra-ui/react';

import { Logo, Stepper, StepsTextInput } from '..';
import { LoginContext } from '../../../../shared/context';

import { LogoOBFullBlack } from 'apps/campus/src/assets/logos/openbootcamp/LogoOBFullBlack';
import { LogoOMFullBlack } from 'apps/campus/src/assets/logos/openmarketers/LogoOMFullBlack';
import { LogoImaginaFullBlack } from 'apps/campus/src/assets/logos/imagina/LogoImaginaFullBlack';

import '../../OnBoarding.scss';

const StepNombre = ({
  onNextStep,
  totalSteps,
  currentStep,
}: {
  onNextStep: (value: any) => void;
  totalSteps: number;
  currentStep: number;
}) => {
  const { user } = useContext(LoginContext);

  const makePasswd = () => {
    let passwd = '';
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const nums = '0123456789';
    const special = '*';

    for (let i = 1; i < 8; i++) {
      const c = Math.floor(Math.random() * chars.length + 1);
      const n = Math.floor(Math.random() * nums.length + 1);
      passwd += chars.charAt(c) + nums.charAt(n) + special;
    }

    return passwd;
  };

  const onSubmit = (response: {
    nombre: string;
    apellidos: string;
    email: string;
    username: string;
    password: string;
  }) => {
    onNextStep({
      nombre: response.nombre,
      apellidos: response.apellidos,
      // username: response.nombre.toLowerCase() + '_' + response.apellidos.replace(' ', '_').toLowerCase(),
      // email: response.email,
      // password: makePasswd(),
    });
  };

  return (
    <Flex
      direction="column"
      boxSize="100%"
      pt="75px"
      gap="60px"
      align="center"
      justify="start"
    >
      {process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? (
        <LogoOBFullBlack />
      ) : process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS' ? (
        <LogoOMFullBlack w="184" h="51" />
      ) : (
        <LogoImaginaFullBlack w="184" h="51" />
      )}

      <Stepper steps={totalSteps} currentStep={currentStep} />

      <Flex direction="column" align="center" gap="10px">
        <Text variant="h1_heading">¡Bienvenido/a! Vamos a crear tu perfil</Text>

        <Text variant="card_title" fontSize="16px" color="gray_4">
          Necesitamos que nos indiques unos datos antes de empezar.
        </Text>
      </Flex>

      <FormularioStepNombre
        onSubmit={onSubmit}
        defaultValues={{
          email: user?.email || '',
          nombre: user?.nombre || ' ',
          apellidos: user?.apellidos || ' ',
        }}
      />
    </Flex>
  );
};

export default StepNombre;

const FormularioStepNombre = ({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (response: any) => void;
  defaultValues: { nombre: string; apellidos: string; email: string };
}) => {
  // const validationSchema = Yup.object().shape({
  //   nombre: Yup.string()
  //     .min(2, '¡Nombre demasiado corto!')
  //     .required('El nombre es obligatorio.')
  //     .typeError('El nombre es obligatorio.'),
  //   apellidos: Yup.string()
  //     .min(2, 'Apellidos demasiado cortos!')
  //     .required('Los apellidos son obligatorios.')
  //     .typeError('Los apellidos son obligatorios.'),
  //   email: Yup.string().email().required('El email es obligatorio.').typeError('El email es obligatorio.'),
  // });

  const initialValues = {
    nombre: defaultValues?.nombre || '',
    apellidos: defaultValues?.apellidos || '',
    email: defaultValues?.email || '',
  };

  function onKeyDown(keyEvent: any) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13)
      keyEvent.stopPropagation();
  }

  return (
    <Formik
      enableReinitialize
      onSubmit={onSubmit}
      validateOnBlur
      validateOnChange={false}
      initialValues={initialValues}
      // validationSchema={validationSchema}
    >
      {(formik) => {
        const { values, handleSubmit } = formik;

        return (
          <FormikForm
            className="steps-form"
            onSubmit={handleSubmit}
            onKeyDown={onKeyDown}
          >
            <Flex direction="column" gap="30px" mb="30px" w="100%">
              <StepsTextInput
                name="email"
                label="Indícanos tu email"
                placeholder="example@mail.com"
                isDisabled
              />

              <StepsTextInput
                name="nombre"
                label="Tu nombre"
                placeholder="Nombre"
              />

              <StepsTextInput
                name="apellidos"
                label="Tus apellidos"
                placeholder="Apellido Apellido"
              />
            </Flex>

            <Button
              w="100%"
              h="50px"
              p="15px"
              color="#fff"
              type="submit"
              rounded="13px"
              isDisabled={!values.nombre && !values.apellidos && !values.email}
              bg={
                !values.nombre && !values.apellidos && !values.email
                  ? 'gray_5'
                  : 'primary'
              }
            >
              Continuar
            </Button>
          </FormikForm>
        );
      }}
    </Formik>
  );
};

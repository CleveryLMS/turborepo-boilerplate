import { useEffect, useState } from 'react';

import * as Yup from 'yup';
import { Form as FormikForm, Formik, useFormikContext } from 'formik';
import { Box, Flex, Button, Image } from '@chakra-ui/react';

import { Stepper, StepsTextInput } from '..';
import { checkIfUsernameExists } from 'data';

import { LogoOBFullBlack } from 'apps/campus/src/assets/logos/openbootcamp/LogoOBFullBlack';
import { LogoOMFullBlack } from 'apps/campus/src/assets/logos/openmarketers/LogoOMFullBlack';
import { LogoImaginaFullBlack } from 'apps/campus/src/assets/logos/imagina/LogoImaginaFullBlack';

import '../../OnBoarding.scss';

const StepCredenciales = ({
  onNextStep,
  totalSteps,
  currentStep,
}: {
  onNextStep: (value: any) => void;
  totalSteps: number;
  currentStep: number;
}) => {
  const onSubmit = (response: { password: string; password_confirmation: string }) => {
    onNextStep(response);
  };

  return (
    <Flex direction="column" boxSize="100%" pt="75px" gap="60px" align="center" justify="start">
      {process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? (
        <LogoOBFullBlack />
      ) : process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS' ? (
        <LogoOMFullBlack w="184" h="51" />
      ) : (
        <LogoImaginaFullBlack w="184" h="51" />
      )}

      <Stepper steps={totalSteps} currentStep={currentStep} />

      <Flex direction="column" align="center" gap="10px">
        <Box fontSize="34px" fontWeight="bold" lineHeight="40px" textTransform="capitalize">
          Configura tus credenciales
        </Box>

        <Box fontSize="16px" fontWeight="medium" lineHeight="19px" color="gray_4">
          Indica la contraseña que quieres utilizar, podrás cambiarla más tarde si lo deseas.
        </Box>
      </Flex>

      <FormularioStepCredenciales onSubmit={onSubmit} />
    </Flex>
  );
};

export default StepCredenciales;

const FormularioStepCredenciales = ({ onSubmit }: { onSubmit: (response: any) => void }) => {
  const formStep = useFormikContext();

  const [tmout, setTmout] = useState<NodeJS.Timeout>();
  const [usernameIsTyping, setUsernameIsTyping] = useState<boolean>(true);

  const initialValues = { password: '', password_confirmation: '' };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('¡El username es obligatorio!').typeError('El username es obligatorio.').nullable(),
    password: Yup.string()
      .required('Introduce una contraseña.')
      .min(8, 'Contraseña muy corta. Debe tener como mínimo 8 carácteres.')
      .max(50, 'Contraseña muy larga. Debe tener como máximo 50 carácteres.')
      .matches(/(?=.*\d){1}/, 'La contraseña debe contener al menos un número.')
      .matches(/(?=.*[a-z]){1}/, 'La contraseña debe contener al menos una letra en minúscula.')
      .matches(/(?=.*[A-Z]){1}/, 'La contraseña debe contener al menos una letra en mayúscula.')
      .matches(/(?=.[!@#$%^&()-=+{};:,<.>]){1}/, 'La contraseña debe contener al menos un carácter especial.')
      .typeError('Introduce tu contraseña.'),
    password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir'),
  });

  useEffect(() => {
    return () => {
      if (tmout) clearTimeout(tmout);
    };
  }, []);

  function onKeyDown(keyEvent: any) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) keyEvent.stopPropagation();
  }

  const validateUsername = async (value: string) => {
    let error;

    // Si empezamos a escribir, ponemos esta guarda a TRUE
    // y ejecutamos la validación.
    if (!usernameIsTyping) setUsernameIsTyping(true);
    // Si ya estamos escribiendo, creamos un timeout para cuando dejemos de escribir
    // y cancelamos la validación actual.
    else {
      if (tmout) clearTimeout(tmout);

      setTmout(
        setTimeout(() => {
          setUsernameIsTyping(false);
          formStep.validateField('username');
        }, 1000)
      );

      return error;
    }

    const res: any = await checkIfUsernameExists({ username: value });

    if (res?.data?.exists !== false) error = res.data.message;

    return error;
  };

  return (
    <Formik onSubmit={onSubmit} initialValues={initialValues} validationSchema={validationSchema}>
      {(formik) => {
        const { values, handleSubmit } = formik;

        return (
          <FormikForm className="steps-form" onSubmit={handleSubmit} onKeyDown={onKeyDown}>
            <Flex direction="column" gap="30px" mb="30px" w="100%">
              <StepsTextInput
                name="username"
                label="Introduce tu nombre de usuario"
                placeholder="Nombre de usuario"
                validate={validateUsername}
              />
              <StepsTextInput
                type="password"
                name="password"
                label="Introduce la contraseña deseada"
                placeholder="Debe contener 8 carácteres mínimo."
              />

              <StepsTextInput
                type="password"
                name="password_confirmation"
                label="Repite la contraseña"
                placeholder="Debe coinicidir con la anterior."
              />
            </Flex>

            <Button
              w="100%"
              h="50px"
              p="15px"
              rounded="13px"
              isDisabled={!values.password && !values.password_confirmation}
              bg={!values.password && !values.password_confirmation ? 'gray_5' : 'primary'}
              color="#fff"
              type="submit"
            >
              Continuar
            </Button>
          </FormikForm>
        );
      }}
    </Formik>
  );
};

import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { Flex, Box, Button, useToast, Stack, HStack, PinInput, PinInputField } from '@chakra-ui/react';

import { LogoOBFullWhite } from 'apps/campus/src/assets/logos/openbootcamp/LogoOBFullWhite';
import { LogoOMFullWhite } from 'apps/campus/src/assets/logos/openmarketers/LogoOMFullWhite';
import { LogoImaginaFullWhite } from 'apps/campus/src/assets/logos/imagina/LogoImaginaFullWhite';

import { login } from 'data';
import { onFailure } from 'utils';
import { LoginContext } from '../../../shared/context';
import { Checkbox, FormInput } from '../../../shared/components';

const LoginForm = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const loginContext = useContext(LoginContext);

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [requires2FA, setRequires2FA] = useState<boolean>(false);

  const loginUser = async (email: string, password: string, remember: boolean, code?: string) => {
    login({ email, password, code })
      .then(({ token, data }) => {
        loginContext
          .login(token, data.id, remember)
          .then(() => {
            toast.closeAll();
            navigate('/');
          })
          .catch((error: any) => {
            setIsLoggingIn(false);

            let errorMsg =
              typeof error.message === 'string'
                ? error.message
                : 'Actualice la página y contacte con soporte si el error persiste..';

            console.log('❌ ERROR EN LOGIN ❌', { error });
            onFailure(toast, 'Error al iniciar sesión', errorMsg, 8000);
          });
      })
      .catch((error) => {
        setIsLoggingIn(false);

        console.log('❌ ERROR EN LOGIN ❌', { error });

        if (error?.message === 'E_ROW_NOT_FOUND: Row not found')
          onFailure(toast, 'Error al iniciar sesión', 'No existe una cuenta con esta dirección de correo');
        else if (error?.error?.response?.data?.requires2FA) setRequires2FA(true);
        else if (error?.response?.data === 'Error 2FA')
          onFailure(toast, 'Error al iniciar sesión', 'El código del authenticator no es correcto.');
        else
          onFailure(
            toast,
            'Error al iniciar sesión',
            error?.error?.response?.data || 'Actualice la página y contacte con soporte si el error persiste..',
            8000
          );

        return;
      });
  };

  return (
    <Flex
      bg="#161822"
      color="white"
      align="center"
      direction="column"
      justify="space-between"
      p="30px 30px 30px 20px"
      minW={{ lg: '30rem' }}
      w={{ base: '100%', lg: '20rem' }}
      boxShadow="0px 4px 71px rgba(7, 15, 48, 0.15)"
    >
      <Flex direction="column" p={[0, 20, 120]} align="center">
        <Box mb="60px">
          {process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? (
            <LogoOBFullWhite />
          ) : process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS' ? (
            <LogoOMFullWhite w="184" h="51" />
          ) : (
            <LogoImaginaFullWhite w="184" h="51" />
          )}
        </Box>

        <FormLoginForm
          login={loginUser}
          requires2FA={requires2FA}
          isLoggingIn={isLoggingIn}
          setIsLoggingIn={setIsLoggingIn}
          onRegister={() => navigate('/register')}
          onPassRecovery={() => navigate('/login/recovery')}
          showRegister={!(process.env.NX_DISABLED_PAGES || '')?.split(' ')?.includes('register')}
        />
      </Flex>

      <Box mt="30px" fontSize="12px" textAlign="center" fontWeight="medium" color="rgba(255, 255, 255, 0.75)">
        <Box>
          Copyright © {new Date().getFullYear()}
          {process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? ' Open Bootcamp SL, Imagina Group' : ' Imagina Group'}
        </Box>
        <Box>Todos los derechos reservados.</Box>

        <Box
          as="a"
          href={
            process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP'
              ? 'https://open-bootcamp.com/politica-privacidad'
              : process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS'
              ? 'https://open-marketers.com/politica-privacidad'
              : 'https://imaginaformacion.com/politica-privacidad'
          }
          target="_blank"
          textDecoration="underline"
        >
          Política de Privacidad
        </Box>
      </Box>
    </Flex>
  );
};

export default LoginForm;

const FormLoginForm = ({
  login,
  isLoggingIn,
  showRegister,
  onRegister,
  onPassRecovery,
  setIsLoggingIn,
  requires2FA,
}: {
  login: any;
  showRegister: boolean;
  onRegister: () => void;
  onPassRecovery: () => void;
  isLoggingIn: boolean;
  setIsLoggingIn: (e?: any) => void | any;
  requires2FA: boolean;
}) => {
  const initialValues = { email: '', password: '', remember: false };
  const [code, setCode] = useState<string | undefined>(undefined);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Introduce una dirección de correo válida.')
      .required('Introduce una dirección de correo.')
      .typeError('Introduce una dirección de correo.')
      .test(
        'Espacios en blanco',
        '¡El email no puede contener espacios en blanco al principio o al final!',
        (value) => !/^\s+|\s+$/.test(value || '')
      ),
    password: Yup.string()
      .required('Introduce una contraseña.')
      .typeError('Introduce tu contraseña.')
      .test(
        'Espacios en blanco',
        '¡La contraseña no puede contener espacios en blanco!',
        (value) => !/(\s)/g.test(value || '')
      ),
    remember: Yup.boolean().notRequired().nullable(),
  });

  const submitForm = async (values: any) => {
    setIsLoggingIn(true);

    await login(values.email, values.password, values.remember, code).catch((error: any) => {
      console.log('¡Error inesperado durante el login!', { error });
    });
  };

  return (
    <Formik onSubmit={submitForm} initialValues={initialValues} validationSchema={validationSchema}>
      {(formik) => {
        const { handleSubmit } = formik;

        if (requires2FA)
          return (
            <Form onSubmit={handleSubmit}>
              <Flex color="#FFFFFF" direction="column" w="100%" gap="30px">
                <Stack>
                  <Box fontSize="16px" fontWeight="semibold" lineHeight="29px">
                    Introduce el pin de tu Authenticator
                  </Box>

                  <HStack>
                    <PinInput type="number" onChange={setCode}>
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                    </PinInput>
                  </HStack>
                </Stack>

                <Flex align="center" justify="space-between">
                  <Button
                    isLoading={isLoggingIn}
                    h="auto"
                    _hover={{
                      bg: 'var(--chakra-colors-primary)',
                      opacity: 0.7,
                      color: '#000',
                    }}
                    color={process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? '#000' : '#fff'}
                    bg="primary"
                    w="100%"
                    p="12px 20px"
                    type="submit"
                    rounded="12px"
                  >
                    <Box fontSize="16px" fontWeight="semibold" lineHeight="29px">
                      Iniciar sesión
                    </Box>
                  </Button>
                </Flex>
              </Flex>
            </Form>
          );

        return (
          <Form onSubmit={handleSubmit}>
            <Flex gap="30px" direction="column" w={{ base: '250px', sm: '100%' }}>
              <FormInput
                data-cy="login_email"
                name="email"
                label="Email"
                type="email"
                color="#fff"
                labelColor="#fff"
                background="transparent"
                placeholder="Introduce tu email"
                gradient="linear(to-l, rgba(58, 61, 78, 0), rgba(60, 63, 79, 0.6))"
              />

              <FormInput
                data-cy="login_password"
                name="password"
                label="Contraseña"
                type="password"
                color="#fff"
                labelColor="#fff"
                background="transparent"
                placeholder="Introduce tu contraseña"
                gradient="linear(to-l, rgba(58, 61, 78, 0), rgba(60, 63, 79, 0.6))"
              />

              <Flex
                w="100%"
                gap="10px"
                justify="space-between"
                align={{ base: 'start', sm: 'center' }}
                direction={{ base: 'column', sm: 'row' }}
              >
                <Checkbox
                  name="remember"
                  label="Recuérdame"
                  style={{ color: '#fff', fontSize: '14px' }}
                  controlStyle={{
                    textAlign: 'left',
                    color: 'rgba(255, 255, 255, 0.4)',
                  }}
                />

                <Box
                  whiteSpace="nowrap"
                  color="primary_neon"
                  fontSize="14px"
                  cursor="pointer"
                  fontWeight="semibold"
                  onClick={onPassRecovery}
                  _hover={{ textDecoration: 'underline' }}
                >
                  ¿Has olvidado la contraseña?
                </Box>
              </Flex>

              <Flex gap="12px" align="center" justify="space-between" direction={{ base: 'column', sm: 'row' }}>
                <Button
                  data-cy="login_submit"
                  isLoading={isLoggingIn}
                  h="auto"
                  _hover={{
                    bg: 'var(--chakra-colors-primary)',
                    opacity: 0.7,
                    color: '#000',
                  }}
                  color={process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? '#000' : '#fff'}
                  bg="primary"
                  p="12px 20px"
                  type="submit"
                  rounded="12px"
                  w={{ base: '250px', sm: '100%' }}
                >
                  <Box fontSize="16px" fontWeight="semibold" lineHeight="29px">
                    Iniciar sesión
                  </Box>
                </Button>

                {showRegister && (
                  <Button
                    h="auto"
                    w={{ base: '250px', sm: '100%' }}
                    bg="primary"
                    p="12px 20px"
                    rounded="12px"
                    onClick={onRegister}
                    _hover={{
                      bg: 'var(--chakra-colors-primary)',
                      opacity: 0.7,
                      color: '#000',
                    }}
                    color={process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? '#000' : '#fff'}
                  >
                    <Box fontSize="16px" fontWeight="semibold" lineHeight="29px">
                      Registrarse
                    </Box>
                  </Button>
                )}
              </Flex>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
};

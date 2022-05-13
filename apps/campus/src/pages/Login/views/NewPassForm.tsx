import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { BiChevronsLeft } from 'react-icons/bi';
import { Flex, Box, Button, Icon, useToast } from '@chakra-ui/react';

import { onFailure } from 'utils';
import { FormInput } from '../../../shared/components';
import { LoginContext } from '../../../shared/context';
import { checkCode, resetPassword } from 'data';

const NewPassForm = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const { hashCode } = useParams<any>();
  const loginContext = useContext(LoginContext);

  const [loading, setLoading] = useState(true);
  const [hashValid, setHashValid] = useState(false);

  useEffect(() => {
    if (!hashCode) {
      onFailure(toast, 'No se reconoce el hashcode', 'Actualize la página y contacte con soporte si el error persiste.');
      return;
    }

    checkCode({ hashCode })
      .then((res: any) => {
        setLoading(false);
        setHashValid(res.isAxiosError === true ? false : true);
      })
      .catch(() => {
        setLoading(false);
        setHashValid(false);
      });
  }, [hashCode]);

  const onSubmit = async (password: string) => {
    const { token, data, error } = await resetPassword({
      hashCode: hashCode || '',
      password,
    });

    if (error) {
      onFailure(
        toast,
        'Error al iniciar sesión',
        error.message || 'Actualize la página y contacte con soporte si el error persiste..'
      );
    } else {
      loginContext
        .login(token, data.id, false)
        .then(() => {
          toast.closeAll();
          navigate('/');
        })
        .catch((error: any) => {
          onFailure(
            toast,
            'Error al iniciar sesión',
            error.message || 'Actualize la página y contacte con soporte si el error persiste..'
          );
        });
    }
  };

  return (
    <Flex
      minW="684px"
      bg="#161822"
      color="#fff"
      direction="column"
      align="center"
      justify="space-between"
      p="30px 30px 30px 20px"
      w={{ base: '100%', lg: '684px' }}
      boxShadow="0px 4px 71px rgba(7, 15, 48, 0.15)"
    >
      <Flex direction="column" p="120px" align="center" gap="60px">
        <Flex direction="column" gap="15px" textAlign="left">
          <Flex
            color="#71747D"
            fontSize="15px"
            fontWeight="bold"
            lineHeight="18px"
            cursor="pointer"
            align="center"
            onClick={() => navigate('/login')}
          >
            <Icon as={BiChevronsLeft} boxSize="24px" mr="6px" /> Volver a Inicio de Sesión
          </Flex>

          <Box fontWeight="black" fontSize="34px" lineHeight="40px">
            Cambio de Contraseña
          </Box>

          {!loading ? (
            hashValid ? (
              <Box fontWeight="medium" fontSize="16px" lineHeight="24px">
                Por favor, indica tu nueva contraseña
              </Box>
            ) : (
              <Box
                bg="rgba(246, 90, 90, 0.15)"
                rounded="11px"
                borderLeft="4px solid var(--chakra-colors-cancel)"
                color="cancel"
                p="10px 15px"
              >
                El enlace de recuperación ha caducado. Por favor, solicita otro desde la{' '}
                <a href="/login/recovery">página de recuperación.</a>
              </Box>
            )
          ) : null}
        </Flex>

        {!loading && hashValid && <FormNewPassForm onSubmit={onSubmit} />}
      </Flex>

      <Box mt="30px" fontSize="12px" textAlign="center" fontWeight="medium" color="rgba(255, 255, 255, 0.75)">
        <Box>
          Copyright © {new Date().getFullYear()}
          {process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? ' Open Bootcamp SL, Imagina Group' : ' Imagina Group'}
        </Box>

        <Box>Todos los derechos reservados.</Box>
        <Box
          as="a"
          target="_blank"
          textDecoration="underline"
          href={
            process.env.NX_ORIGEN_CAMPUS === 'OPENBOOTCAMP'
              ? 'https://open-bootcamp.com/politica-privacidad'
              : process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS'
              ? 'https://open-marketers.com/politica-privacidad'
              : 'https://imaginaformacion.com/politica-privacidad'
          }
        >
          Política de Privacidad
        </Box>
      </Box>
    </Flex>
  );
};

export default NewPassForm;

const FormNewPassForm = ({ onSubmit }: { onSubmit: (password: string) => void }) => {
  const initialValues = { password: '', confirmPassword: '' };

  const validationSchema = Yup.object().shape({
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
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
      .required(),
  });

  const submitForm = (values: any) => onSubmit(values.password);

  return (
    <Formik initialValues={initialValues} onSubmit={submitForm} validationSchema={validationSchema}>
      {(formik) => {
        const { handleSubmit } = formik;

        return (
          <Form onSubmit={handleSubmit}>
            <Flex direction="column" gap="20px">
              <FormInput
                name="password"
                label="Nueva contraseña"
                type="password"
                placeholder="Introduce tu contraseña"
                color="#fff"
                controlStyle={{ minWidth: '400px' }}
                background="transparent"
                gradient="linear(to-l, rgba(58, 61, 78, 0), rgba(60, 63, 79, 0.6))"
              />

              <FormInput
                name="confirmPassword"
                label="Confirma la contraseña"
                type="password"
                placeholder="Introduce tu contraseña"
                color="#fff"
                controlStyle={{ minWidth: '400px' }}
                background="transparent"
                gradient="linear(to-l, rgba(58, 61, 78, 0), rgba(60, 63, 79, 0.6))"
              />

              <Button
                h="auto"
                _hover={{
                  bg: '#26FC95',
                  opacity: 0.7,
                  color: 'var(--chakra-colors-black)',
                }}
                color="#fff"
                bg="#26FC95"
                w="100%"
                p="12px 20px"
                type="submit"
              >
                <Box fontSize="16px" fontWeight="semibold" lineHeight="29px">
                  Guardar nueva contraseña
                </Box>
              </Button>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
};

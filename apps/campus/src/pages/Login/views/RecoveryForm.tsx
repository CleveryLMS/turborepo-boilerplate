import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Flex, Box, Button, Icon, Input } from '@chakra-ui/react';
import { BiCheckCircle, BiChevronsLeft } from 'react-icons/bi';

import { recoverRequest } from 'data';

const RecoveryForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [emailEnviado, setEmailEnviado] = useState<boolean>(false);
  const [emailErroneo, setEmailErroneo] = useState<string>();

  const onSubmit = () => {
    recoverRequest({ email })
      .then((res: any) => {
        if (res?.error?.response?.status === 404) setEmailErroneo('Este email no existe en nuestra base de datos.');
        else setEmailErroneo(undefined);

        setEmailEnviado(true);
      })
      .catch((err) => {
        setEmailEnviado(true);
        setEmailErroneo('Error inesperado');
      });
  };

  useEffect(() => {
    if ((email && emailErroneo) || (email && emailEnviado)) {
      setEmailErroneo(undefined);
      setEmailEnviado(false);
    }
  }, [email]);

  return (
    <Flex
      w={{ base: '100%', lg: '684px' }}
      minW="684px"
      direction="column"
      bg="#161822"
      p="30px 30px 30px 20px"
      boxShadow="0px 4px 71px rgba(7, 15, 48, 0.15)"
      color="#fff"
      justify="space-between"
      align="center"
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

          <Box fontWeight="medium" fontSize="16px" lineHeight="24px">
            Te enviaremos un correo a tu email con un enlace para cambiar tu contraseña.
          </Box>
        </Flex>

        <Flex w="100%" direction="column" textAlign="left" gap="30px">
          <Flex direction="column" gap="8px">
            <Box fontSize="14px" fontWeight="bold" lineHeight="20px">
              Email
            </Box>

            <Input
              p="17px"
              h="auto"
              type="email"
              border="1px"
              rounded="13px"
              value={email}
              placeholder="Introduce tu email"
              borderColor="rgba(255, 255, 255, 0.4)"
              onChange={(e) => setEmail(e.target.value)}
              bg="linear-gradient(90deg, #3C3F4F -0.12%, rgba(58, 61, 78, 0) 99.88%)"
            />
          </Flex>

          <Button
            h="auto"
            w="100%"
            p="13px 15px"
            rounded="13px"
            onClick={onSubmit}
            isDisabled={!email || !email?.includes('@')}
            color={emailEnviado ? '#fff' : '#10172E'}
            bg={emailEnviado ? 'transparent' : '#26FC95'}
            border={`1px solid ${emailEnviado ? '#E6E8EE' : '#26FC95'}`}
            rightIcon={emailEnviado ? <Icon as={BiCheckCircle} color="#36F097" boxSize="20px" /> : undefined}
            _hover={{ bg: '#26FC95', opacity: 0.7, color: '#fff' }}
          >
            <Box fontSize="16px" fontWeight="semibold" lineHeight="29px">
              Enviar mail
            </Box>
          </Button>

          {emailEnviado &&
            (!emailErroneo ? (
              <Flex bg="rgba(38, 200, 171, 0.15)" rounded="11px" borderLeft="4px solid #36F097" color="#36F097" p="10px 15px">
                Te hemos enviado al email las instrucciones para cambiar tu contraseña.
              </Flex>
            ) : (
              <Box
                rounded="11px"
                color="cancel"
                p="10px 15px"
                bg="rgba(246, 90, 90, 0.15)"
                borderLeft="4px solid var(--chakra-colors-cancel)"
              >
                {emailErroneo}
              </Box>
            ))}
        </Flex>
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

export default RecoveryForm;

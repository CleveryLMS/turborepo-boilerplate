import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import TagManager from 'react-gtm-module';
import { BiLeftArrowAlt } from 'react-icons/bi';
import { Button, Flex, Text, Image } from '@chakra-ui/react';

import { getEstados, getItem, getPaises, IEstado, IPais, updateUser, UserOrigenEnum } from 'data';
import { capitalizeFirst } from 'utils';
import { LoginContext } from '../../../../shared/context';
import { USER_ONBOARDING_ID, USER_ONBOARDING_TOKEN } from '.';
import { Stepper, StepsFormSelect, StepsFormRadio } from '../../components';

import { LogoOBFullBlack } from 'apps/campus/src/assets/logos/openbootcamp/LogoOBFullBlack';
import { LogoOMFullBlack } from 'apps/campus/src/assets/logos/openmarketers/LogoOMFullBlack';
import { LogoImaginaFullBlack } from 'apps/campus/src/assets/logos/imagina/LogoImaginaFullBlack';

import '../../Register.scss';

const onKeyDown = (keyEvent: any) => {
  if ((keyEvent.charCode || keyEvent.keyCode) === 13) keyEvent.stopPropagation();
};

type StepBienvenidoValues = {
  pais?: any;
  estado?: any;
  origen?: string | null;
  trabajoRemoto?: boolean | null;
  posibilidadTraslado?: boolean | null;
};

const validationSchema = Yup.object().shape({
  pais: Yup.object().notRequired().nullable(),
  estado: Yup.object().notRequired().nullable(),
  trabajoRemoto: Yup.boolean().notRequired().nullable(),
  posibilidadTraslado: Yup.boolean().notRequired().nullable(),
  origen: Yup.string()
    .oneOf([...Object.values(UserOrigenEnum), null])
    .notRequired()
    .typeError('¡Escoge un valor del listado!')
    .nullable(),
});

const initialValues: StepBienvenidoValues = {
  pais: null,
  estado: null,
  origen: null,
  trabajoRemoto: null,
  posibilidadTraslado: null,
};

type StepBienvenidoProps = {
  totalSteps: number;
  currentStep: number;
  onPrevStep: () => void;
  cleanStorage: (bool: boolean) => void;
};

const StepBienvenido = ({ totalSteps, currentStep, onPrevStep, cleanStorage }: StepBienvenidoProps) => {
  const navigate = useNavigate();
  const { login } = useContext(LoginContext);

  const [pais, setPais] = useState<IPais | null>(null);
  const [paises, setPaises] = useState([]);
  const [estados, setEstados] = useState([]);

  useEffect(() => {
    getPaises({}).then((res: any) =>
      setPaises(
        res?.map((pais: IPais) => ({
          value: pais,
          label: `${pais.bandera} ${pais.nombre}`,
          'data-cy': 'option_' + pais.nombre.toLocaleLowerCase(),
        }))
      )
    );
  }, []);

  useEffect(() => {
    if (pais)
      getEstados({ query: [{ pais_id: pais?.id }] }).then((res: any) =>
        setEstados(
          res?.map((estado: IEstado) => ({
            value: estado,
            label: estado.nombre,
            'data-cy': 'option_' + estado.nombre.toLocaleLowerCase(),
          }))
        )
      );
  }, [pais]);

  const onSubmit = async (values: any) => {
    values.step = 5;

    const userId = getItem(USER_ONBOARDING_ID);
    const userToken = getItem(USER_ONBOARDING_TOKEN);

    if (userId)
      await updateUser({
        id: userId,
        user: {
          paisId: values.pais?.id,
          origen: values.origen,
          estadoId: values.estado?.id,
          trabajoRemoto: values.trabajoRemoto,
          posibilidadTraslado: values.posibilidadTraslado,
        },
      });

    await login({ token: userToken }, userId, true)
      .then(() => {
        navigate('/');

        cleanStorage(false);
      })
      .catch((error: any) => {
        console.log('Error en el login del register', { error, userId });
        navigate('/login');

        cleanStorage(true);
      });

    // Enviamos a GTM que ha terminado el OnBoarding
    TagManager.dataLayer({ dataLayer: { onBoarding: 'ended' } });
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

      <Flex gap="10px" id="head_last_step" direction="column" align={{ base: 'start', sm: 'center' }}>
        <Text variant="h1_heading" id="head_last_step__title" data-cy="last_step__title">
          ¡Ya estás casi!
        </Text>

        <Text color="gray_4" variant="card_title" id="head_last_step__description" data-cy="last_step__description">
          Con estos datos buscaremos ofertas de trabajo que encajen contigo.
        </Text>
      </Flex>

      <Flex w="100%" maxW="100%" direction="column">
        <Formik enableReinitialize onSubmit={onSubmit} initialValues={initialValues} validationSchema={validationSchema}>
          {(props) => (
            <Form onSubmit={props.handleSubmit} onKeyDown={onKeyDown}>
              <Flex w="100%" mb="30px" gap="30px" direction="column" id="body_last_step" data-cy="last_step__form">
                <StepsFormSelect
                  label="¿En qué país vives? *"
                  name="pais"
                  placeholder="Ej: España"
                  options={paises}
                  onChange={(e: any) => setPais(e.value)}
                  data-cy="pais"
                />

                <StepsFormSelect
                  label="¿En qué región? *"
                  name="estado"
                  options={estados}
                  placeholder="Ej: Comunidad Valenciana"
                  data-cy="estado"
                />

                <StepsFormSelect
                  name="trabajoRemoto"
                  data-cy="trabajoRemoto"
                  label="¿Qué tipo de trabajo prefieres?"
                  placeholder="Escoge uno de la lista"
                  options={[
                    {
                      label: 'Remoto',
                      value: true,
                      'data-cy': 'option_remoto',
                    },
                    {
                      label: 'Presencial',
                      value: false,
                      'data-cy': 'option_presencial',
                    },
                  ]}
                />

                <StepsFormSelect
                  name="origen"
                  data-cy="origen"
                  label="¿Cómo nos has conocido?"
                  placeholder="Escoge uno de la lista"
                  options={Object.values(UserOrigenEnum).map((v) => ({
                    label: capitalizeFirst(v),
                    value: v,
                    'data-cy': 'option_' + v.toLocaleLowerCase(),
                  }))}
                />

                <StepsFormRadio
                  name="posibilidadTraslado"
                  data-cy="posibilidadTraslado"
                  label="¿Estarías dispuesto a trasladarte?"
                  options={[
                    { label: 'Sí', value: 'true', 'data-cy': 'option_si' },
                    { label: 'No', value: 'false', 'data-cy': 'option_no' },
                  ]}
                />
              </Flex>

              <Flex
                w="100%"
                mb="50px"
                gap="12px"
                direction={{ base: 'column', sm: 'row' }}
                align={{ base: 'flex-end', sm: 'center' }}
                justify={{ base: 'center', sm: 'flex-end' }}
              >
                <Button
                  id="register_previous_button"
                  variant="outline"
                  leftIcon={<BiLeftArrowAlt />}
                  onClick={onPrevStep}
                  isDisabled={props.isSubmitting}
                >
                  Volver
                </Button>

                <Button id="acces_to_campus_button" type="submit" variant="primary" isLoading={props.isSubmitting}>
                  ¡Empezar mi formación!
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>
      </Flex>
    </Flex>
  );
};

export default StepBienvenido;

import { useState, useEffect } from 'react';

import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import TagManager from 'react-gtm-module';
import { BiLeftArrowAlt } from 'react-icons/bi';
import { Button, Flex, Text, Image } from '@chakra-ui/react';

import { getItem, setItem, updateUser, updateProgresoGlobal } from 'data';
import { USER_ONBOARDING_ID, USER_ONBOARDING_STEP_RUTA, USER_ONBOARDING_STEP_CONOCIMIENTOS } from '.';
import { useQuery } from 'utils';
import { Stepper, StepsFormRuta } from '../../components';

import { LogoOBFullBlack } from 'apps/campus/src/assets/logos/openbootcamp/LogoOBFullBlack';
import { LogoOMFullBlack } from 'apps/campus/src/assets/logos/openmarketers/LogoOMFullBlack';
import { LogoImaginaFullBlack } from 'apps/campus/src/assets/logos/imagina/LogoImaginaFullBlack';

import '../../Register.scss';

type rutaType =
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'principiantes_programacion'
  | 'estrategia_organizacion'
  | 'branding_comunicacion'
  | 'performance'
  | 'seo_contenidos_cro'
  | 'analista_web'
  | undefined;

const getRutaId = (rutaNombre: rutaType) => {
  switch (rutaNombre) {
    case 'frontend':
      return 11;
    case 'backend':
      return 12;
    case 'fullstack':
      return 13;
    case 'principiantes_programacion':
      return 3;
    case 'estrategia_organizacion':
      return 4;
    case 'branding_comunicacion':
      return 5;
    case 'performance':
      return 6;
    case 'seo_contenidos_cro':
      return 7;
    case 'analista_web':
      return 8;
    default:
      return 14;
  }
};

type StepRutaProps = {
  totalSteps: number;
  currentStep: number;
  onNextStep: (nextStep?: number) => void;
  onPrevStep: () => void;
};

type StepRutaValues = {
  ruta?: rutaType;
};

const validationSchema = Yup.object().shape({
  ruta: Yup.string().notRequired(),
});

const onKeyDown = (keyEvent: any) => {
  if ((keyEvent.charCode || keyEvent.keyCode) === 13) keyEvent.stopPropagation();
};

const StepRuta = ({ totalSteps, currentStep, onNextStep, onPrevStep }: StepRutaProps) => {
  const query = useQuery();

  const [initialValues, setInitialValues] = useState<StepRutaValues>({
    ruta: undefined,
  });

  useEffect(() => {
    let ruta: any = query.get('ruta');
    let storageValues = getItem(USER_ONBOARDING_STEP_RUTA);

    if (storageValues) setInitialValues({ ruta: storageValues.ruta });
    else if (ruta) setInitialValues({ ruta });
  }, []);

  const onSubmit = async (values: StepRutaValues) => {
    const ruta = values?.ruta;
    const userId = getItem(USER_ONBOARDING_ID);

    let storageValues = getItem(USER_ONBOARDING_STEP_CONOCIMIENTOS) || {};

    // Guardamos los valores en el localStorage por si perdemos sesión
    setItem(USER_ONBOARDING_STEP_RUTA, { ruta });

    if (userId)
      updateUser({
        id: userId,
        user: { preferencias: { ...storageValues, ruta } },
      }).then((response) => {
        const progresoGlobalId = response.value?.data?.progresoGlobal?.id;

        if (progresoGlobalId)
          updateProgresoGlobal({
            id: progresoGlobalId,
            progresoGlobal: { rutaId: getRutaId(ruta) },
          });
      });

    // Enviamos a GTM el roadmap
    TagManager.dataLayer({ dataLayer: { roadmap: values.ruta } });

    onNextStep();
  };

  return (
    <Flex
      boxSize="100%"
      align="center"
      direction="column"
      justify="flex-start"
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

      <Flex direction="column" align="center" gap="10px" p="30px">
        <Text variant="h1_heading" data-cy="fourth_step__title">
          Ya casi está, unos últimos ajustes
        </Text>

        <Text variant="card_title" color="gray_4" fontSize="16px" data-cy="fourth_step__description">
          {process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS'
            ? 'Necesitemos que nos indiques el tipo de marketer que eres para ofrecerte diferentes especializaciones.'
            : 'Necesitemos que nos indiques el tipo de desarrollador que eres para ofrecerte diferentes especializaciones.'}
        </Text>
      </Flex>

      <Flex w="100%" maxW="100%" direction="column">
        <Formik enableReinitialize onSubmit={onSubmit} initialValues={initialValues} validationSchema={validationSchema}>
          {(props) => (
            <Form onSubmit={props.handleSubmit} onKeyDown={onKeyDown}>
              <Flex mb="30px" gap="30px" align="center" data-cy="fourth_step__form">
                <StepsFormRuta name="ruta" />
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
                  isDisabled={props.isSubmitting}
                  leftIcon={<BiLeftArrowAlt />}
                >
                  Volver
                </Button>

                <Button
                  type="submit"
                  id="register_next_button"
                  variant="primary"
                  // !TODO isDisabled={!props?.isValid || props?.isSubmitting}
                  isLoading={props.isSubmitting}
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

export default StepRuta;

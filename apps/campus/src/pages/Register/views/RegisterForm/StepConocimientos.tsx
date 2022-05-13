import { useState, useEffect } from 'react';

import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import TagManager from 'react-gtm-module';
import { BiLeftArrowAlt } from 'react-icons/bi';
import { Flex, Text, Button, Image } from '@chakra-ui/react';

import { getItem, setItem, updateProgresoGlobal, updateUser } from 'data';
import { Stepper, StepsFormConocimientos } from '../../components';
import { USER_ONBOARDING_ID, USER_ONBOARDING_STEP_CONOCIMIENTOS } from '.';

import { LogoOBFullBlack } from 'apps/campus/src/assets/logos/openbootcamp/LogoOBFullBlack';
import { LogoOMFullBlack } from 'apps/campus/src/assets/logos/openmarketers/LogoOMFullBlack';
import { LogoImaginaFullBlack } from 'apps/campus/src/assets/logos/imagina/LogoImaginaFullBlack';

import '../../Register.scss';

type StepConocimientosProps = {
  totalSteps: number;
  currentStep: number;
  onNextStep: (nextStep?: number) => void;
  onPrevStep: () => void;
};

type StepConocimientosValues = {
  conocimientos?: 'principiante' | 'avanzado';
};

const validationSchema = Yup.object().shape({
  conocimientos: Yup.string().oneOf(['principiante', 'avanzado']).required(),
});

const onKeyDown = (keyEvent: any) => {
  if ((keyEvent.charCode || keyEvent.keyCode) === 13) keyEvent.stopPropagation();
};

const StepConocimientos = ({ totalSteps, currentStep, onNextStep, onPrevStep }: StepConocimientosProps) => {
  const [initialValues, setInitialValues] = useState<StepConocimientosValues>({
    conocimientos: undefined,
  });

  useEffect(() => {
    let storageValues = getItem(USER_ONBOARDING_STEP_CONOCIMIENTOS);

    if (storageValues) setInitialValues({ conocimientos: storageValues.conocimientos });
  }, []);

  const onSubmit = async (values: StepConocimientosValues) => {
    const userId = getItem(USER_ONBOARDING_ID);

    // Guardamos los valores en el localStorage por si perdemos sesión
    setItem(USER_ONBOARDING_STEP_CONOCIMIENTOS, {
      conocimientos: values.conocimientos,
    });

    if (userId)
      await updateUser({
        id: userId,
        user: { preferencias: { conocimientos: values.conocimientos } },
      }).then((response) => {
        if (values.conocimientos === 'principiante') {
          const progresoGlobalId = response.value?.data?.progresoGlobal?.id;

          if (progresoGlobalId)
            updateProgresoGlobal({
              id: progresoGlobalId,
              progresoGlobal: {
                rutaId: process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS' ? 1 : 14,
              },
            });
        }
      });

    // Enviamos a GTM el nivel de conocimientos
    TagManager.dataLayer({
      dataLayer: {
        knowledge: values.conocimientos === 'avanzado' ? 'pro' : 'rookie',
      },
    });

    if (values.conocimientos === 'principiante') {
      // Enviamos a GTM que la ruta es la de incubación
      TagManager.dataLayer({ dataLayer: { roadmap: 'incubation' } });

      // Saltamos al último paso
      onNextStep(5);
    } else {
      // Si no, pasamos al siguiente paso
      onNextStep(4);
    }
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

      <Flex p="30px" gap="10px" direction="column" align={{ base: 'start', sm: 'center' }}>
        <Text variant="h1_heading" data-cy="third_step__title">
          {process.env.NX_ORIGEN_CAMPUS === 'OPENMARKETERS' ? '¿Ya sabes de marketing?' : '¿Sabes programar?'}
        </Text>

        <Text color="gray_4" fontSize="16px" variant="card_title" data-cy="third_step__description">
          Utilizaremos tu respuesta para crear una hoja de ruta personalizada que se adecúe a tu nivel de conocimientos y
          experiencia.
        </Text>
      </Flex>

      <Flex w="100%" maxW="100%" direction="column">
        <Formik enableReinitialize onSubmit={onSubmit} initialValues={initialValues} validationSchema={validationSchema}>
          {(props) => (
            <Form onSubmit={props.handleSubmit} onKeyDown={onKeyDown}>
              <Flex mb="30px" gap="30px" align="center" data-cy="third_step__form">
                <StepsFormConocimientos name="conocimientos" />
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

                <Button type="submit" id="register_next_button" variant="primary" isLoading={props.isSubmitting}>
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

export default StepConocimientos;

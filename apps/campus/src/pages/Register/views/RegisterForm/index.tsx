import { useContext, useEffect, useState } from 'react';

import { Flex } from '@chakra-ui/react';
import TagManager from 'react-gtm-module';

import { getItem, LOGIN_TOKEN, removeItem, setItem } from 'data';

import StepRuta from './StepRuta';
import StepNombre from './StepNombre';
import StepBienvenido from './StepBienvenido';
import StepCredenciales from './StepCredenciales';
import StepConocimientos from './StepConocimientos';
import { LoginContext } from '../../../../shared/context';

/** ID del usuario creado con la información del primer paso.  */
export const USER_ONBOARDING_ID = 'userOnboardingId';
/** Último paso por el que se quedó el usuario.  */
export const USER_ONBOARDING_STEP = 'userOnboardingStep';
/** TOKEN del usuario creado con la información del primer paso.  */
export const USER_ONBOARDING_TOKEN = 'userOnboardingToken';
/** Indica si el usuario está activo al crearse durante el primer paso.  */
export const USER_ONBOARDING_ACTIVO = 'userOnboardingActivo';

/** Objetos del usuario con la información almacenada del paso actual.  */
export const USER_ONBOARDING_STEP_RUTA = 'userOnboardingRuta';
export const USER_ONBOARDING_STEP_NOMBRE = 'userOnboardingNombre';
export const USER_ONBOARDING_STEP_BIENVENIDO = 'userOnboardingBienvenido';
export const USER_ONBOARDING_STEP_CREDENCIALES = 'userOnboardingCredenciales';
export const USER_ONBOARDING_STEP_CONOCIMIENTOS = 'userOnboardingConocimientos';

export const RegisterForm = () => {
  const steps = [1, 2, 3, 4, 5];
  const { logout } = useContext(LoginContext);

  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    const id = getItem(USER_ONBOARDING_ID);
    const token = getItem(USER_ONBOARDING_TOKEN);
    const step = getItem(USER_ONBOARDING_STEP) || 1;

    setActiveStep(step);

    // Si el usuario es nuevo, guardamos en el dataLayer el evento
    if (!id) TagManager.dataLayer({ dataLayer: { onBoarding: 'started' } });

    // Si existe el token en el localStorage, actualizamos el LOGIN_TOKEN
    if (token) setItem(LOGIN_TOKEN, token);
  }, []);

  const onNextStep = async (nextStep: number = activeStep + 1) => {
    if (nextStep < 6) {
      setActiveStep(nextStep);
      setItem(USER_ONBOARDING_STEP, nextStep);

      // Enviamos a GTM el step activo
      TagManager.dataLayer({ dataLayer: { step: nextStep } });

      // Hacemos scroll al inicio de la ventana.
      document?.getElementById('top_point')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const onPrevStep = async () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  /** Limpiamos el localstorage de la información que ya no necesitamos */
  const cleanStorage = (doLogout: boolean) => {
    if (doLogout) logout();

    removeItem(USER_ONBOARDING_ID);
    removeItem(USER_ONBOARDING_STEP);
    removeItem(USER_ONBOARDING_TOKEN);

    removeItem(USER_ONBOARDING_STEP_RUTA);
    removeItem(USER_ONBOARDING_STEP_NOMBRE);
    removeItem(USER_ONBOARDING_STEP_BIENVENIDO);
    removeItem(USER_ONBOARDING_STEP_CREDENCIALES);
    removeItem(USER_ONBOARDING_STEP_CONOCIMIENTOS);
  };

  return (
    <Flex direction="column" mb="20px" id="top_point">
      <Flex w="100%" gap="27px" maxW="100vw" direction="column" px={{ base: '30px', sm: 'unset' }}>
        {activeStep === 1 && <StepNombre totalSteps={steps.length} currentStep={activeStep} onNextStep={onNextStep} />}

        {activeStep === 2 && (
          <StepCredenciales
            totalSteps={steps.length}
            currentStep={activeStep}
            onNextStep={onNextStep}
            onPrevStep={onPrevStep}
          />
        )}

        {activeStep === 3 && (
          <StepConocimientos
            totalSteps={steps.length}
            currentStep={activeStep}
            onNextStep={onNextStep}
            onPrevStep={onPrevStep}
          />
        )}

        {activeStep === 4 && (
          <StepRuta totalSteps={steps.length} currentStep={activeStep} onNextStep={onNextStep} onPrevStep={onPrevStep} />
        )}

        {activeStep === 5 && (
          <StepBienvenido
            totalSteps={steps.length}
            currentStep={activeStep}
            onPrevStep={onPrevStep}
            cleanStorage={cleanStorage}
          />
        )}
      </Flex>
    </Flex>
  );
};

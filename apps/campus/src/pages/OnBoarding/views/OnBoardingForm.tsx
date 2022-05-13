import { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Flex, Spinner, useToast } from '@chakra-ui/react';

import { onFailure } from 'utils';
import { LoginContext } from '../../../shared/context';
import StepNombre from '../components/Steps/StepNombre';
import StepBienvenido from '../components/Steps/StepBienvenido';
import StepCredenciales from '../components/Steps/StepCredenciales';
import { updateUser, checkHashOnboarding, disableOnboardingSession } from 'data';

export const OnBoardingForm = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const { hashCode } = useParams<any>();
  const { user, setUser, login } = useContext(LoginContext);

  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'nombre' | 'credenciales' | 'bienvenido'>('nombre');

  useEffect(() => {
    if (!hashCode) {
      setLoading(false);
      onFailure(toast, 'Error al reconocer el hashCode del onboarding', '');

      navigate('/login');

      return;
    }

    // if (!user?.activo) {
    //   setLoading(false);
    //   onFailure(
    //     toast,
    //     'Este usuario está inactivo',
    //     'Tu cuenta de usuario no tiene acceso al campus. Por favor, contacte con nosotros si fuera un error.'
    //   );

    //   navigate('/login');

    //   return;
    // }

    checkHashOnboarding({ hashCode: hashCode || '' })
      .then((res: any) => {
        setLoading(false);

        if (res.isAxiosError) {
          onFailure(toast, 'Error al reconocer el hashCode del onboarding', res.message || '');

          navigate('/login');
        } else {
          login(res?.token, res?.data.id, false)
            .then(() => {
              // Si ya ha completado el onBoarding redirigimos al inicio.
              if (res.data.onboardingCompletado) navigate('/');
            })
            .catch((error: any) => {
              onFailure(toast, 'Error al iniciar sesión', res.message || '');
            });
        }
      })
      .catch((err) => {
        setLoading(false);
        onFailure(toast, 'Error al reconocer el hashCode del onboarding', err.message || '');

        navigate('/login');
      });
  }, [hashCode]);

  const onNextStep = async (response: any) => {
    if (!user?.id) {
      onFailure(toast, 'Error inesperado', 'El ID de usuario es undefined. Por favor, contacte con soporte.');
      return;
    }

    switch (step) {
      case 'nombre':
        // Push new state to user
        await updateUser({ id: user.id, user: { ...response } }).then((res) => {
          setUser({ ...res.value.data });
        });

        setStep('credenciales');

        break;
      case 'credenciales':
        // Push new state to user
        await updateUser({ id: user.id, user: { ...response } }).then((res) => {
          setUser({ ...res.value.data });
        });

        setStep('bienvenido');

        break;

      case 'bienvenido':
        // Push new state to user
        updateUser({
          id: user.id,
          user: { ...response, onboardingCompletado: true },
        })
          .then(async (res) => {
            setUser({ ...res.value.data });
            navigate('/');

            disableOnboardingSession({ hashCode: hashCode || '' });
          })
          .catch((err) => console.error({ err }));

        break;
    }
  };

  return loading ? (
    <Flex boxSize="100%" align="center" justify="center">
      <Spinner />
    </Flex>
  ) : step === 'nombre' ? (
    <StepNombre onNextStep={onNextStep} totalSteps={3} currentStep={1} />
  ) : step === 'credenciales' ? (
    <StepCredenciales onNextStep={onNextStep} totalSteps={3} currentStep={2} />
  ) : (
    <StepBienvenido onNextStep={onNextStep} />
  );
};

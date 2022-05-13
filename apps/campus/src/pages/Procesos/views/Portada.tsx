import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Box, Button, Flex, Icon, Progress, useToast, useDisclosure } from '@chakra-ui/react';
import { BiBriefcase, BiBarChart, BiDirections, BiMapPin, BiUserPlus, BiX } from 'react-icons/bi';

import {
  getCursos,
  useProceso,
  getRutaByID,
  applyToProceso,
  useCheckProceso,
  removeFromProceso,
  filterCursosByRuta,
  updateProgresoGlobal,
  getCertificacionesRequeridas,
} from 'data';
import { OpenParser } from 'ui';
import { onFailure, onSuccess } from 'utils';
import { GlobalCard } from '../../../shared/components';
import { RoadmapModal } from '../components/RoadmapModal';
import { ICertificacion, ICurso, IHabilidad } from 'data';
import { LoginContext, ProgresoGlobalContext, RoadmapContext } from '../../../shared/context';
import { Avatar, ItemLoader, GlobalCardType, CardCertificacionLoader } from '../../../shared/components';

const ProcesosCover = () => {
  const { procesoId } = useParams<any>();

  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { setRuta } = useContext(RoadmapContext);
  const { user, setUser } = useContext(LoginContext);
  const { progresoGlobal } = useContext(ProgresoGlobalContext);

  const { proceso, isLoading } = useProceso({
    id: +(procesoId || 0),
    strategy: 'invalidate-on-undefined',
  });

  const { isAbleToApply, isLoading: isCheckingApplyability } = useCheckProceso({
    id: +(procesoId || 0),
    strategy: 'invalidate-on-undefined',
  });

  const [rutaProceso, setRutaProceso] = useState<any>([]);
  const [isInscrito, setIsInscrito] = useState<boolean | null>(null);
  const [progresoProceso, setProgresoProceso] = useState<number>(0);
  const [totalCompletadas, setTotalCompletadas] = useState<number>(0);
  const [certificaciones, setCertificaciones] = useState<ICertificacion[]>([]);

  useEffect(() => {
    (async () => {
      if ((proceso?.habilidades?.length || 0) > 0) {
        const ids = proceso?.habilidades?.map((h: IHabilidad) => h.id);
        const niveles = proceso?.habilidades?.map((h: IHabilidad) => h.meta?.pivot_nivel);

        const certis = await getCertificacionesRequeridas({
          query: [{ habilidades: `${[ids]}` }, { nivel: `[${niveles}]` }],
          strategy: 'invalidate-on-undefined',
          certificacionesCompletadas: progresoGlobal?.meta?.certificacionesCompletadas || [],
          certificacionesIniciadas: progresoGlobal?.meta?.certificacionesIniciadas || [],
        });

        setTotalCompletadas(
          progresoGlobal?.meta?.certificacionesCompletadas?.filter((n) => !!certis?.find((c: any) => c.id === n))?.length || 0
        );
        setProgresoProceso((totalCompletadas / certis?.length) * 100 || 0);
        setCertificaciones(certis);
      } else {
        setCertificaciones([]);
        setTotalCompletadas(0);
        setProgresoProceso(0);
      }
    })();

    (async () => {
      const dataRuta = await getRutaByID({
        id: proceso?.rutaId || 0,
        client: 'campus',
        strategy: 'invalidate-on-undefined',
      });

      const dataItinerario = await getCursos({
        userId: user?.id,
        client: 'campus',
        strategy: 'invalidate-on-undefined',
        query: [{ ruta: dataRuta?.itinerario }],
      });

      setRutaProceso(dataItinerario || []);
    })();
  }, [proceso]);

  const followProcesoRoadmap = async () => {
    if (user?.progresoGlobal.id && proceso?.rutaId)
      updateProgresoGlobal({
        id: user?.progresoGlobal.id,
        progresoGlobal: { rutaId: proceso?.rutaId },
      })
        .then(async () => {
          const dataRuta = await getRutaByID({
            id: proceso?.rutaId || 0,
            client: 'campus',
            strategy: 'invalidate-on-undefined',
          });

          setRuta({ ...dataRuta });
          onSuccess(toast, 'Se ha actualizado la hoja de ruta');

          onClose();
        })
        .catch((error) => console.error('Error al cambiar de ruta', { error }));
  };

  const handleInscribirse = async () => {
    if (user?.id && procesoId) {
      applyToProceso({ id: +procesoId })
        .then(() => {
          setIsInscrito(true);
          const _user = { ...user };
          _user.procesos?.push(proceso);

          setUser({ ..._user });
        })
        .catch(() => onFailure(toast, 'Error interno', 'No se ha podido procesar la solicitud'));
    }
  };

  const handleRemoveFromProceso = async () => {
    if (user?.id && procesoId) {
      removeFromProceso({ id: +procesoId })
        .then(() => {
          setIsInscrito(false);
          const _user = { ...user };
          _user.procesos = _user.procesos?.filter((p) => p.id !== proceso?.id);

          setUser({ ..._user });
        })
        .catch(() => onFailure(toast, 'Error interno', 'No se ha podido procesar la solicitud'));
    }
  };

  return (
    <>
      <Flex w="100%" p="40px" gap="40px" direction={{ base: 'column', lg: 'row' }}>
        <Flex direction="column" gap="28px" w="100%">
          <Flex direction="column" gridRowGap="30px">
            <Flex
              w="100%"
              align="center"
              justify="space-between"
              gap={{ base: '20px', sm: 'unset' }}
              direction={{ base: 'column', sm: 'row' }}
            >
              <Flex w="100%" align={{ base: 'center', sm: 'unset' }} direction={{ base: 'column', sm: 'row' }}>
                <Box rounded="20px" mr={{ base: '', sm: '30px' }} border="4px solid var(--chakra-colors-gray_3)">
                  <Avatar
                    size="90px"
                    rounded="18px"
                    fontSize="32px"
                    src={proceso?.imagen?.url}
                    name={proceso?.titulo?.substring(0, 2)}
                  />
                </Box>
                <Flex gap="10px" direction="column" mt={{ base: '20px', sm: 'unset' }} align={{ base: 'center', sm: 'unset' }}>
                  <Box color="gray_5" fontSize="14px" lineHeight="16px" fontWeight="semibold">
                    VACANTE
                  </Box>

                  <Box fontSize="24px" fontWeight="bold" textOverflow="ellipsis">
                    {proceso?.titulo}
                  </Box>

                  <Flex gap="12px" fontSize="14px" color="gray_5">
                    <Flex gap="8px" align="center" fontSize="14px" lineHeight="16px">
                      <Icon boxSize="20px" as={BiBarChart} color="gray_6" />

                      {proceso?.tipoContrato}
                    </Flex>

                    <Flex gap="8px" align="center" fontSize="14px" lineHeight="16px">
                      <Icon boxSize="20px" as={BiMapPin} color="gray_6" />
                      {proceso?.localidad}
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>

              <Flex direction="column" align={{ base: 'center', sm: 'end' }}>
                {isCheckingApplyability && <ItemLoader />}

                {(isInscrito === null && user?.procesos?.map((p) => `${p.id}`)?.includes(procesoId || '0')) || isInscrito ? (
                  <Button
                    minW="218px"
                    color="gray_5"
                    bgColor="white"
                    w="fit-content"
                    onClick={handleRemoveFromProceso}
                    rightIcon={<Icon as={BiX} boxSize="20px" />}
                  >
                    Cancelar inscripción
                  </Button>
                ) : (
                  <Button
                    minW="218px"
                    w="fit-content"
                    bgColor="gray_3"
                    isDisabled={!isAbleToApply}
                    onClick={handleInscribirse}
                    rightIcon={<Icon as={BiUserPlus} boxSize="20px" />}
                  >
                    Inscribirse
                  </Button>
                )}

                {!isAbleToApply && (
                  <Box mt="10px" color="gray_4" fontSize="14px" fontWeight="semibold">
                    Te faltan certificaciones
                  </Box>
                )}
              </Flex>
            </Flex>

            <CaracteristicasVacante
              remoto={proceso?.remoto}
              tipoPuesto={proceso?.tipoPuesto}
              salarioMin={proceso?.salarioMin}
              salarioMax={proceso?.salarioMax}
            />

            <Flex direction="column" gap="10px">
              <Box fontWeight="extrabold" fontSize="14px" lineHeight="16px">
                Descripción del puesto
              </Box>

              <Box pl="20px" fontSize="15px" lineHeight="22px" fontWeight="medium">
                <OpenParser value={proceso?.descripcion || ''} />
              </Box>
            </Flex>

            <Box w="100%" h="1px" bg="gray_3" />

            <Flex w="100%" gap={{ base: '0px', sm: '24px' }} direction="column">
              <Flex align="center" justify="space-between" direction={{ base: 'column', sm: 'row' }}>
                <Box
                  fontSize="14px"
                  lineHeight="16px"
                  fontWeight="extrabold"
                  pb={{ base: '5px', sm: 'unset' }}
                  w={{ base: 'auto', sm: '200px' }}
                >
                  Hoja de ruta de la vacante
                </Box>

                <Button
                  h="42px"
                  bg="white"
                  minW="200px"
                  rounded="12px"
                  w="fit-content"
                  fontSize="15px"
                  lineHeight="18px"
                  p="10px 25px 10px 25px"
                  border="1px solid var(--chakra-colors-gray_4)"
                  rightIcon={<Icon as={BiDirections} boxSize="20px" color="black" />}
                  onClick={onOpen}
                >
                  Seguir hoja de ruta
                </Button>
              </Flex>

              <Flex
                w="100%"
                wrap="wrap"
                gap="12px"
                mt={{ base: '', sm: '40px' }}
                mb={{ base: '40px', sm: '40px' }}
                direction={{ base: 'column', lg: 'row' }}
              >
                {isLoading || !rutaProceso
                  ? Array.from(Array(4).keys()).map((n) => (
                      <GlobalCard
                        maxPerRow={2}
                        gapBetween="12px"
                        type={GlobalCardType.ROADMAP}
                        key={'roadmap-card-placeholder-' + n}
                        props={{ isLoading: true }}
                      />
                    ))
                  : filterCursosByRuta(proceso?.ruta?.meta?.itinerario, rutaProceso)?.map((curso: ICurso, index: number) => (
                      <GlobalCard
                        maxPerRow={2}
                        gapBetween="12px"
                        key={'roadmap-card-' + index}
                        type={GlobalCardType.ROADMAP}
                        onClick={() => navigate(`/cursos/${curso.id}`)}
                        props={{
                          curso: curso,
                          isCompleted: curso.meta?.isCompleted,
                          isBlocked: curso.meta?.isBlocked,
                        }}
                      />
                    ))}
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <Box bg="gray_3" minW={{ base: '100%', lg: '1px' }} minH={{ base: '1px', lg: 'unset' }} />

        <Flex h="100%" gap="30px" direction="column" minW={{ base: '', sm: '480px' }} w={{ base: '100%', lg: 'fit-content' }}>
          <ProgresoVacante value={progresoProceso} />

          <Flex w="100%" direction="column" gap="16px">
            <Flex w="100%" gap="10px" whiteSpace="nowrap" justify="space-between">
              <Box fontSize="14px" fontWeight="extrabold" lineHeight="16px">
                Certificaciones requeridas
              </Box>

              <Box color="primary" fontSize="14px" lineHeight="16px">
                {totalCompletadas}/{certificaciones?.length} superadas
              </Box>
            </Flex>

            <Flex direction="column" gap="20px">
              {isLoading ? (
                [1, 2, 3]?.map((id) => <CardCertificacionLoader key={'certificacion_placeholder-item-' + id} />)
              ) : certificaciones?.length === 0 ? (
                <Box color="gray_4" fontWeight="bold" fontSize="16px" lineHeight="100%">
                  Aún no hay certificaciones disponibles para esta vacante
                </Box>
              ) : (
                certificaciones?.map((c: ICertificacion) => (
                  <GlobalCard
                    maxPerRow={1}
                    gapBetween="20px"
                    props={{ certificacion: c }}
                    key={'certificacion-item-' + c.id}
                    type={GlobalCardType.CERTIFICACION}
                    onClick={() => navigate('/certificaciones/' + c.id)}
                  />
                ))
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <RoadmapModal isOpen={isOpen} proceso={proceso} onClose={onClose} followProcesoRoadmap={followProcesoRoadmap} />
    </>
  );
};

export default ProcesosCover;

const CaracteristicasVacante = ({
  remoto,
  tipoPuesto,
  salarioMin,
  salarioMax,
}: {
  remoto: string;
  tipoPuesto: string;
  salarioMin: number;
  salarioMax: number;
}) => {
  return (
    <Flex
      p="24px"
      gap="24px"
      bg="white"
      rounded="14px"
      border="1px solid"
      borderColor="gray_3"
      direction={{ base: 'column', sm: 'row' }}
    >
      <Flex
        w="100%"
        color="black"
        justify="center"
        direction="column"
        whiteSpace="nowrap"
        gap={{ base: '2px', sm: '8px' }}
        align={{ base: 'center', sm: 'unset' }}
      >
        <Box fontWeight="bold" fontSize="14px" lineHeight="16px">
          Presencial / Remoto
        </Box>

        <Box fontSize="14px" lineHeight="16px">
          {remoto ? 'En remoto' : 'Presencial'}
        </Box>
      </Flex>

      <Box minW="1px" bg="gray_3" />

      <Flex
        w="100%"
        justify="center"
        direction="column"
        whiteSpace="nowrap"
        gap={{ base: '2px', sm: '8px' }}
        align={{ base: 'center', sm: 'unset' }}
      >
        <Box fontWeight="bold" fontSize="14px" lineHeight="16px">
          Tipo de puesto
        </Box>

        <Box fontSize="14px" lineHeight="16px">
          {tipoPuesto}
        </Box>
      </Flex>

      <Box minW="1px" bg="gray_3" />

      <Flex
        w="100%"
        justify="center"
        direction="column"
        whiteSpace="nowrap"
        gap={{ base: '2px', sm: '8px' }}
        align={{ base: 'center', sm: 'unset' }}
      >
        <Box fontWeight="bold" fontSize="14px" lineHeight="16px">
          Rango salarial
        </Box>

        <Box fontSize="14px" lineHeight="16px">
          {salarioMin} - {salarioMax}€ / Año
        </Box>
      </Flex>
    </Flex>
  );
};

const ProgresoVacante = ({ value }: { value: number }) => {
  return (
    <Flex
      h="90px"
      p="24px"
      gap="8px"
      bg="gray_2"
      rounded="20px"
      direction="column"
      border="1px solid var(--chakra-colors-gray_3)"
    >
      <Flex justify="space-between" align="center">
        <Flex gap="4px" align="center">
          <Box fontWeight="bold" fontSize="21px">
            {value}%
          </Box>

          <Box fontSize="13px" fontWeight="bold" color="gray_5">
            COMPATIBLE
          </Box>
        </Flex>

        <Icon color="gray_5" boxSize="20px" as={BiBriefcase} />
      </Flex>

      <Progress value={value} w="100%" minH="8px" rounded="full" bg="white" sx={{ '& > div': { background: 'primary' } }} />
    </Flex>
  );
};

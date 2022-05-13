import { useContext, useEffect, useState } from 'react';

import { BiX, BiCheck } from 'react-icons/bi';
import { Image, Modal, ModalOverlay, ModalContent, ModalHeader, Flex, Box, IconButton, Icon, Button } from '@chakra-ui/react';

import { fmtMnts } from 'utils';
import { ICurso, IProceso } from 'data';
import { ProgresoGlobalContext, LoginContext } from '../../../shared/context';
import { filterCursosByRuta, getCursos, getRutaByID } from 'data';

export const RoadmapModal = ({
  proceso,
  onClose,
  isOpen,
  followProcesoRoadmap,
}: {
  proceso: IProceso;
  onClose: () => void;
  isOpen: boolean;
  followProcesoRoadmap: () => void;
}) => {
  const { user } = useContext(LoginContext);
  const { progresoGlobal } = useContext(ProgresoGlobalContext);

  const [rutaProceso, setRutaProceso] = useState<any>([]);

  useEffect(() => {
    if (isOpen) refreshRuta();
  }, [isOpen]);

  const refreshRuta = async () => {
    const dataRuta = await getRutaByID({
      id: proceso?.rutaId,
      strategy: 'invalidate-on-undefined',
    });

    const dataItinerario = await getCursos({
      query: [{ ruta: dataRuta?.itinerario }],
      userId: user?.id,
      strategy: 'invalidate-on-undefined',
    });

    setRutaProceso(dataItinerario || []);
  };

  return (
    <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent p="30px">
          <ModalHeader>
            <Flex justify="space-between">
              <Box fontSize="18px" gridColumnGap="20px" fontWeight="bold">
                ¿Quieres seguir la Hoja de Ruta para esta vacante?
              </Box>

              <IconButton
                bg="transparent"
                aria-label="Close button"
                onClick={onClose}
                icon={<Icon boxSize="40px" color="gray_4" as={BiX} />}
              />
            </Flex>
          </ModalHeader>

          <Flex direction="column">
            <Flex w="100%" my="30px">
              <Flex w="100%" h="400px" direction="column" gap="15px" overflow="auto">
                <Box w="100%" h="1px" bg="gray_5" pb="1px" />

                {filterCursosByRuta(proceso?.ruta?.meta?.itinerario, rutaProceso)?.map((curso: ICurso, index: number) => (
                  <Flex direction="column">
                    <Flex rounded="14px" h="80px" w="100%" p="15px" align="center" gap="15px">
                      {!progresoGlobal?.meta?.cursosCompletados.includes(curso.id || 0) ? (
                        <Flex
                          align="center"
                          justify="center"
                          h="30px"
                          w="30px"
                          fontSize="16px"
                          fontWeight="extrabold"
                          color="gray_4"
                          bg="gray_5"
                          rounded="full"
                        >
                          {index + 1}
                        </Flex>
                      ) : (
                        <Flex
                          align="center"
                          justify="center"
                          h="30px"
                          w="30px"
                          fontSize="16px"
                          fontWeight="extrabold"
                          bg="primary"
                          rounded="full"
                        >
                          <Icon fontWeight="extrabold" color="white" fontSize="24px" as={BiCheck} />
                        </Flex>
                      )}

                      <Image boxSize="50px" src={`data:image/svg+xml;utf8,${curso.icono}`} />

                      <Flex w="100%" justify="space-between">
                        <Box fontWeight="bold" fontSize="18px">
                          {curso?.titulo}
                        </Box>

                        <Box color="gray_3">
                          {fmtMnts(curso?.meta?.duracionTotal || 0)} - {curso?.modulos?.length || 0} módulos
                        </Box>
                      </Flex>
                    </Flex>

                    <Box w="100%" h="1px" bg="gray_3" />
                  </Flex>
                ))}
              </Flex>
            </Flex>

            <Button onClick={followProcesoRoadmap} bg="gray_4" h="42px" color="white">
              Seguir hoja de ruta
            </Button>
          </Flex>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

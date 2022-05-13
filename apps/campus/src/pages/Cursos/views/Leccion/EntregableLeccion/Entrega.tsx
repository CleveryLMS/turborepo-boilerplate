import { useState, useEffect } from 'react';

import {
  useToast,
  Flex,
  Box,
  Icon,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Input,
  IconButton,
} from '@chakra-ui/react';
import { BsGithub } from 'react-icons/bs';
import { BiFile, BiPencil, BiPlus, BiFolder, BiTrash } from 'react-icons/bi';

import { updateEntregable, uploadAdjuntoEntregable, removeEntregableAdjunto, removeEntregableGithub } from 'data';
import { onFailure, onSuccess } from 'utils';
import { EntregableEstadoEnum, IEntregable } from 'data';
import { FileUploader } from '../../../../../shared/components';

export const EntregaTarea = ({
  entregable,
  setEntregable,
  realizarEntrega,
}: {
  entregable?: IEntregable;
  setEntregable: (e?: any) => void | any;
  realizarEntrega: () => void;
}) => {
  const toast = useToast();

  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubiendoArchivos, setIsSubiendoArchivos] = useState(true);
  const [enlaceGithub, setEnlaceGithub] = useState(entregable?.enlaceGithub || '');

  useEffect(() => {
    setEnlaceGithub(entregable?.enlaceGithub || '');
    setFiles([]);
  }, [entregable?.id]);

  /** Gestión de la actualización de enlaces de github al entregable */
  const updateEnlaceGithub = () => {
    if (!entregable?.id) return Promise.reject({ message: 'No hay entregable_id' });
    if (!enlaceGithub || !enlaceGithub?.startsWith('https://'))
      return Promise.reject({ message: '¡No has añadido ningún enlace!' });

    removeEntregableAdjunto({ id: entregable?.id })
      .then((res) => res)
      .catch((err) => err);

    setEntregable({
      ...entregable,
      enlaceGithub: enlaceGithub,
      adjunto: undefined,
    });

    return enlaceGithub === ''
      ? removeEntregableGithub({ id: entregable?.id })
      : updateEntregable({
          id: entregable?.id,
          entregable: {
            ...entregable,
            enlaceGithub: enlaceGithub,
            estado: EntregableEstadoEnum.PENDIENTE_CORRECCION,
            fechaEntrega: new Date().toISOString(),
          },
        })
          .then((res) => res)
          .catch((err) => ({ message: err }));
  };

  /** Gestión de la eliminación de adjuntos del entregable */
  const handleEliminarArchivo = () => {
    if (!entregable?.id) return Promise.reject('No hay entregable_id');

    removeEntregableAdjunto({ id: entregable?.id });
    setEntregable({ ...entregable, adjunto: null });
  };

  const handleOnDeleteFile = (file: File) => {
    setFiles(files.filter((f) => f.name !== file.name && f.size !== file.size && f.type !== file.type));
  };

  const handleOnLoadedFiles = (files: File[]) => {
    if (entregable?.id) setFiles(files);
  };

  /** Entrega de la solución del ejercicio (Adjunto o GitHub) */
  const handleGuardarCambios = async (type: string) => {
    if (entregable?.id) {
      if (type === 'git') {
        updateEnlaceGithub()
          .then(() => {
            onSuccess(toast, 'Entregable actualizado correctamente.');
          })
          .catch((error) => {
            onFailure(toast, 'Error en la entrega', error.message);
          });
      } else {
        setIsUploading(true);

        uploadAdjuntoEntregable({ id: entregable?.id, adjunto: files[0] })
          .then((res) => {
            setEntregable({ ...res?.value?.data });

            onSuccess(toast, 'Entregable actualizado correctamente.');

            setFiles([]);
          })
          .catch((error) => {
            onFailure(toast, 'Error en la entrega', error.message);
          });

        setIsUploading(false);
      }

      realizarEntrega();
    }
  };

  return (
    <Flex direction="column" w="100%" gap="20px">
      <Box fontWeight="bold" fontSize="18px">
        Entrega de la tarea
      </Box>

      <Flex w="100%" h="auto" direction="column">
        {!isSubiendoArchivos && entregable?.adjunto ? (
          <Flex direction="column" gap="10px">
            <Box w="130px" color="gray_3" fontSize="13px" fontWeight="extrabold">
              Archivos subidos
            </Box>

            <Flex
              w="100%"
              bg="gray_2"
              rounded="12px"
              align="center"
              p="10px 10px 10px 15px"
              border="1px solid var(--chakra-colors-gray_3)"
            >
              <Icon as={BiFile} color="primary" boxSize="24px" />

              <Box>NOMBRE DEL FICHERO</Box>
            </Flex>

            <Button
              p="15px"
              h="auto"
              color="black"
              w="fit-content"
              background="white"
              border="1px solid var(--chakra-colors-gray_3)"
              onClick={() => setIsSubiendoArchivos(!isSubiendoArchivos)}
              leftIcon={<Icon as={BiPencil} color="gray_4" boxSize="14px" />}
            >
              Editar entrega
            </Button>
          </Flex>
        ) : !isSubiendoArchivos && entregable?.enlaceGithub ? (
          <Flex direction="column" gap="10px">
            <Box w="130px" color="gray_3" fontSize="13px" fontWeight="extrabold">
              Enlace a Github
            </Box>

            <Flex w="100%" p="15px" rounded="12px" align="center" border="1px solid" borderColor="gray_5" bg="gray_2">
              {entregable?.enlaceGithub}
            </Flex>

            <Button
              h="auto"
              color="black"
              w="fit-content"
              background="white"
              p="10px 15px 10px 20px"
              border="1px solid var(--chakra-colors-gray_3)"
              onClick={() => setIsSubiendoArchivos(!isSubiendoArchivos)}
              leftIcon={<Icon as={BiPencil} color="gray_4" boxSize="14px" />}
            >
              Editar entrega
            </Button>
          </Flex>
        ) : !isSubiendoArchivos ? (
          <Button
            h="auto"
            color="black"
            w="fit-content"
            background="white"
            border="1px solid"
            borderColor="gray_5"
            p="10px 15px 10px 20px"
            onClick={() => setIsSubiendoArchivos(true)}
            leftIcon={<Icon as={BiPlus} color="gray_4" boxSize="14px" />}
          >
            Añadir entrega
          </Button>
        ) : (
          <Tabs w="100%" minW="200px" variant="solid-rounded">
            <Box w="130px" color="gray_5" fontSize="13px" mb="10px" fontWeight="extrabold">
              Tipo de entrega
            </Box>

            <TabList>
              <Flex direction={{ base: 'column', sm: 'row' }} gap={{ base: '10px', sm: '0px' }}>
                <Tab
                  h="44px"
                  whiteSpace="nowrap"
                  rounded={{ base: '10px', sm: '10px 0px 0px 10px' }}
                  _selected={{
                    backgroundColor: 'primary',
                    color: 'white',
                    rounded: { base: '10px', sm: '10px 0px 0px 10px' },
                  }}
                >
                  <Icon boxSize="25px" mr="10px" as={BsGithub} />
                  Enlace a GitHub
                </Tab>

                <Tab
                  h="44px"
                  whiteSpace="nowrap"
                  rounded={{ base: '10px', sm: '0px 10px 10px 0px' }}
                  _selected={{
                    backgroundColor: 'primary',
                    color: 'white',
                    rounded: { base: '10px', sm: '0px 10px 10px 0px' },
                  }}
                >
                  <Icon boxSize="25px" mr="10px" as={BiFolder} />
                  Archivo .zip
                </Tab>
              </Flex>
            </TabList>

            <TabPanels>
              <TabPanel p="0px" mt="20px">
                <Flex direction="column" gap="10px">
                  <Box w="130px" color="gray_5" fontSize="13px" fontWeight="extrabold">
                    Enlace a Github
                  </Box>

                  <Input
                    h="40px"
                    w="100%"
                    value={enlaceGithub}
                    placeholder="https://github.com/rust-lang/rust"
                    onChange={(e) => setEnlaceGithub(e.target.value)}
                  />
                </Flex>

                <Button
                  mt="34px"
                  h="55px"
                  minH="55px"
                  p="5px 20px"
                  bg="primary"
                  color="white"
                  w="fit-content"
                  rounded="8px"
                  fontSize="18px"
                  lineHeight="21px"
                  fontWeight="bold"
                  onClick={() => handleGuardarCambios('git')}
                  isDisabled={enlaceGithub === ''}
                >
                  Guardar cambios
                </Button>
              </TabPanel>

              <TabPanel mt="20px" p="0px">
                <Flex direction="column" gap="10px">
                  <Box w="130px" color="gray_5" fontSize="13px" fontWeight="extrabold">
                    Archivos a enviar
                  </Box>

                  {entregable?.adjunto && (
                    <Flex h="60px" w="100%" bg="gray_1" rounded="10px" py="10px" px="15px" align="center">
                      <Icon color="gray_5" as={BiFile} />

                      <Flex color="gray_5" w="100%">
                        <Flex direction="column" w="100%" px="10px">
                          <Box p="0px" fontSize="13px" color="black">
                            {entregable.adjunto.name}
                          </Box>

                          <Box p="0px" fontSize="11px">
                            {(entregable?.adjunto?.size / 1000).toFixed(0)} KB
                          </Box>
                        </Flex>
                      </Flex>

                      <IconButton
                        bg="white"
                        aria-label="Borrar"
                        onClick={handleEliminarArchivo}
                        icon={<Icon color="gray_5" as={BiTrash} />}
                      />
                    </Flex>
                  )}

                  {!entregable?.adjunto && (
                    <FileUploader
                      files={files}
                      maxFiles={1}
                      maxSize="20MB"
                      isUploading={isUploading}
                      supportedFormats={['.zip', '.rar']}
                      hideDropZone={files.length > 0}
                      onDeleteFile={handleOnDeleteFile}
                      onLoadedFiles={(files) => handleOnLoadedFiles(files)}
                    />
                  )}
                </Flex>

                <Button
                  mt="34px"
                  h="55px"
                  minH="55px"
                  p="5px 20px"
                  bg="primary"
                  color="white"
                  w="fit-content"
                  rounded="8px"
                  fontSize="18px"
                  lineHeight="21px"
                  fontWeight="bold"
                  id="entregable_button"
                  isDisabled={files.length === 0}
                  onClick={() => handleGuardarCambios('file')}
                >
                  Guardar cambios
                </Button>
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </Flex>
    </Flex>
  );
};

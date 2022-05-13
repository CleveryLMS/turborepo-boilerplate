import { useCallback } from 'react';

import { useDropzone } from 'react-dropzone';

import { BiFile, BiPlus, BiTrash } from 'react-icons/bi';
import { Box, Button, Flex, Icon, Progress, useToast } from '@chakra-ui/react';
import { onFailure } from 'utils';

interface FileUploaderProps {
  files: File[];
  maxFiles?: number;
  maxSize?: string;
  supportedFormats?: string[];
  isUploading?: boolean;
  hideDropZone?: boolean;
  onDeleteFile?: (file: File) => void;
  onLoadedFiles?: (files: File[]) => void;
}

const emptyFunc = () => {};
const regex = /(^\d+)([T|G|M|K])B/;

export const FileUploader = ({
  files,
  maxFiles = 1,
  maxSize = '2MB',
  supportedFormats = ['.png'],
  isUploading = false,
  onDeleteFile = emptyFunc,
  onLoadedFiles = emptyFunc,
  hideDropZone = false,
}: FileUploaderProps) => {
  const toast = useToast();
  const onDrop = useCallback(async (acceptedFiles, fileRejections) => {
    fileRejections.forEach((file: any) => {
      file.errors.forEach((err: any) => {
        if (err.code === 'file-too-large') {
          onFailure(toast, 'Ha habido un error', 'El tamaño máximo de los archivos es de ' + maxSize);
        }

        if (err.code === 'file-invalid-type') {
          onFailure(
            toast,
            'Ha habido un error',
            'No es un tipo de archivo valido. Archivos válidos: ' + supportedFormats.join(',')
          );
        }
      });
    });
    await onLoadedFiles(acceptedFiles);
  }, []);

  const parseSize = (size: string) => {
    const match = size.match(regex);
    let magnitude = 1;

    if (match)
      switch (match[2]) {
        case 'T':
          magnitude = 1000000000000;
          break;
        case 'G':
          magnitude = 1000000000;
          break;
        case 'M':
          magnitude = 1000000;
          break;
        case 'K':
          magnitude = 1000;
          break;
      }

    if (match) return parseInt(match[1]) * magnitude;
    else return 0;
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: supportedFormats.join(','),
    maxFiles: maxFiles,
    maxSize: parseSize(maxSize),
  });

  return (
    <Flex gap="10px" direction="column">
      {!hideDropZone && (
        <Flex w="100%" h="175px" bg="gray_2" rounded="15px" p="15px" {...getRootProps()} direction="column" cursor="pointer">
          <Flex w="100%" h="78px" mb="10px" p="25px" border="1px dashed rgba(135, 142, 160, 0.4)" rounded="10px" align="center">
            <Icon boxSize="20px" color="white" bg="#36F097" rounded="full" as={BiPlus} />
            <Flex direction="column" justify="center" pl="10px">
              <Box color="gray_5" fontSize="15px" fontWeight="bold">
                Arrastra y sube tus archivos
              </Box>

              <Box color="gray_5" fontSize="12px" fontWeight="semibold">
                O <u>búscalos</u> en tus documentos
              </Box>
            </Flex>
          </Flex>

          <Flex direction="column" fontSize="12px" color="#878EA0" fontWeight="semibold">
            <Box>
              Archivos soportados: <b>{supportedFormats.join(',')}</b>
            </Box>

            <Box>
              Tamaño máximo de archivo: <b>{maxSize}</b>
            </Box>

            <Box>
              Núm. máx. de archivos: <b>{maxFiles}</b>
            </Box>
          </Flex>

          <input {...getInputProps()} />
        </Flex>
      )}

      {files?.map((file: File) => (
        <Flex h="60px" w="100%" bg="gray_2" rounded="10px" py="10px" px="15px" align="center">
          <Icon color="gray_5" as={BiFile} />

          <Flex color="gray_5" w="100%">
            <Flex direction="column" w="100%" px="10px">
              <Box p="0px" fontSize="13px" color="black">
                {file.name}
              </Box>

              {!isUploading ? (
                <Box p="0px" fontSize="11px">
                  {(file.size / 1000).toFixed(0)} KB
                </Box>
              ) : (
                <Progress colorScheme="whatsapp" rounded="full" boxSize="14px" isIndeterminate />
              )}
            </Flex>
          </Flex>

          <Button bg="white" onClick={() => {}} isDisabled={!!files?.find((f) => +(f.size / 1048576).toFixed(1) > 20)}>
            <Icon color="gray_5" as={BiTrash} onClick={() => onDeleteFile(file)} />
          </Button>
        </Flex>
      ))}
    </Flex>
  );
};

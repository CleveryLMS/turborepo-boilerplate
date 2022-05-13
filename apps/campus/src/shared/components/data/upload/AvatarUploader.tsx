import { Flex, Icon, Image, Center, Spinner } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { BiEdit } from 'react-icons/bi';

export interface AvatarUploaderProps {
  size: string;
  name: string;
  src?: string;
  allowGif?: boolean;
  isUploading: boolean;
  onUpload: (...args: any[]) => any;
}

export const OpenAvatarUploader = ({
  size,
  name,
  src,
  isUploading,
  onUpload,
  allowGif = false,
}: AvatarUploaderProps) => {
  const onDrop = useCallback((file) => {
    onUpload(file);
  }, []);

  const acceptedFormats = allowGif
    ? ['.png', '.jpg', '.jpeg', '.gif']
    : ['.png', '.jpg', '.jpeg'];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats,
  });

  if (isUploading)
    return (
      <Flex
        w={size}
        h={size}
        minW={size}
        minH={size}
        rounded="50%"
        align="center"
        justify="center"
        bg="black"
      >
        <Spinner color="white" />
      </Flex>
    );

  return (
    <Flex
      pos="relative"
      overflow="hidden"
      rounded="full"
      {...getRootProps()}
      cursor="pointer"
    >
      <input {...getInputProps()} />
      {src ? (
        <Image
          fit="cover"
          minW={size}
          minH={size}
          h={size}
          w={size}
          rounded="50%"
          alt={name}
          src={src}
        />
      ) : (
        <Center
          bg="primary"
          color="#fff"
          lineHeight="20px"
          fontWeight="bold"
          w={size}
          h={size}
          minW={size}
          minH={size}
          rounded="50%"
          fontSize="30px"
          textTransform="uppercase"
        >
          {name}
        </Center>
      )}
      <Flex
        _hover={{ opacity: 1 }}
        opacity="0"
        pos="absolute"
        boxSize="100%"
        bg="blackAlpha.500"
        alignItems="center"
        justifyContent="center"
      >
        <Icon boxSize="25px" color="white" as={BiEdit} />
      </Flex>
    </Flex>
  );
};

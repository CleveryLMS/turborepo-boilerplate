import { Icon, Flex, Image, Box, Badge, Skeleton, Center, Button } from '@chakra-ui/react';
import stc from 'string-to-color';
import { BiPlus, BiPlusCircle } from 'react-icons/bi';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

import { OpenParser } from 'ui';
import { IProyecto } from 'data';
import { Avatar, FavButton } from '../../core';

export type CardProyectoProps = {
  proyecto: IProyecto;
  style?: React.CSSProperties;

  isFavved: boolean;

  onEdit?: () => any;
  onRemove?: () => any;
  onClick?: () => any;

  onFav?: () => any;
};

export const CardProyectoPropio = (
  { proyecto, isFavved, onClick, onFav, style, onEdit, onRemove }: CardProyectoProps,
  isLoading = false
) => {
  return isLoading ? (
    <Flex style={style} direction="column" onClick={onClick} w="100%" p="20px" rounded="xl">
      <Box maxW="100%" maxH="200" border="2px" borderColor="gray_3" rounded="10px" overflow="hidden">
        <Image
          w="100%"
          objectFit="cover"
          objectPosition="top"
          bgColor={stc(proyecto?.titulo || 'Lorem Ipsum')}
          src={`https://api.microlink.io/?url=${proyecto?.enlaceDemo}&screenshot&embed=screenshot.url&apiKey=${process.env.NX_MICROLINK_APIKEY}`}
        />
      </Box>

      <Flex w="100%" direction="column" p="10px" pt="24px" gap="20px">
        <Box fontWeight="bold" fontSize="15px" lineHeight="18px" color="black">
          {proyecto?.titulo}
        </Box>

        <Box
          color="black"
          maxH="1.5em"
          fontSize="13px"
          lineHeight="1.8em"
          fontWeight="medium"
          wordBreak="break-word"
          textOverflow="ellipsis"
          overflow="hidden"
          noOfLines={1}
        >
          <OpenParser value={proyecto?.contenido || ''} />
        </Box>

        <Flex wrap="wrap" w="100%">
          {proyecto?.habilidades && proyecto.habilidades?.length >= 1 ? (
            proyecto?.habilidades?.map((habilidades) => (
              <Badge
                rounded="5px"
                p="6px 12px"
                w="fit-content"
                key={habilidades.id}
                color="primary"
                bg="rgba(50, 212, 164, 0.1)"
                mr="10px"
              >
                {habilidades.nombre}
              </Badge>
            ))
          ) : (
            <Badge rounded="5px" p="6px 12px" w="fit-content" color="primary" bg="transparent" mr="10px"></Badge>
          )}
        </Flex>

        <Flex w="100%" align="center" gridColumnGap="10px" justify="space-between">
          <Flex w="100%" justify="space-between">
            <Flex gridColumnGap="15px" lineHeight="15px" fontSize="13px" color="gray_3">
              <Flex align="center" gridColumnGap="5px">
                <FavButton
                  w="16px"
                  h="16px"
                  isFavved={isFavved}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onFav) onFav();
                  }}
                />
                <Box color="gray_4">{proyecto?.meta?.totalFavoritos}</Box>
              </Flex>
            </Flex>
          </Flex>

          <Flex>
            {proyecto?.publico ? (
              <Flex color="black" fontSize="14px" align="center">
                <Icon as={IoEyeOutline} mr="6px" />
                Público
              </Flex>
            ) : (
              <Flex color="gray_4" fontSize="14px" align="center">
                <Icon as={IoEyeOffOutline} mr="6px" />
                Privado
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  ) : (
    <Flex direction="column" p="20px" w="100%">
      <Skeleton h="200px" w="100%" rounded="5px" mb="24px" />
      <Skeleton h="22px" w="50%" mb="10px" />
      <Skeleton h="22px" w="100%" mb="5px" />
      <Skeleton h="22px" w="100%" mb="5px" />
      <Skeleton h="22px" w="100%" mb="20px" />

      <Flex w="100%" justify="space-between" mb="24px">
        <Skeleton h="22px" w="32%" />
        <Skeleton h="22px" w="32%" />
        <Skeleton h="22px" w="32%" />
      </Flex>

      <Flex w="100%" justify="space-between">
        <Skeleton h="20px" w="75px" />
        <Skeleton h="30px" w="30px" rounded="full" />
      </Flex>
    </Flex>
  );
};

export const CardProyectoPublico = ({ proyecto, isFavved, onClick, onFav, style }: CardProyectoProps, isLoading = false) => {
  return isLoading ? (
    <Flex style={style} direction="column" onClick={onClick} w="100%" p="20px" rounded="xl">
      <Box maxW="100%" maxH="200px" minH="200px" border="2px" borderColor="gray_3" rounded="10px" overflow="hidden">
        <Image
          w="100%"
          objectFit="cover"
          objectPosition="top"
          bgColor={stc(proyecto?.titulo || 'Lorem Ipsum')}
          src={`https://api.microlink.io/?url=${proyecto?.enlaceDemo}&screenshot&embed=screenshot.url&apiKey=${process.env.NX_MICROLINK_APIKEY}`}
        />
      </Box>

      <Flex w="100%" direction="column" p="10px" pt="24px" gap="20px">
        <Box fontWeight="bold" fontSize="15px" lineHeight="18px" color="black">
          {proyecto?.titulo}
        </Box>

        <Box
          color="black"
          maxH="1.5em"
          fontSize="13px"
          lineHeight="1.8em"
          fontWeight="medium"
          wordBreak="break-word"
          textOverflow="ellipsis"
          overflow="hidden"
          noOfLines={1}
        >
          <OpenParser value={proyecto?.contenido || ''} />
        </Box>

        <Flex wrap="wrap" w="100%">
          {proyecto?.habilidades && proyecto.habilidades?.length >= 1 ? (
            proyecto?.habilidades?.map((habilidades) => (
              <Badge
                rounded="5px"
                p="6px 12px"
                w="fit-content"
                key={habilidades.id}
                color="primary"
                bg="rgba(50, 212, 164, 0.1)"
                mr="10px"
              >
                {habilidades.nombre}
              </Badge>
            ))
          ) : (
            <Badge rounded="5px" p="6px 12px" w="fit-content" color="primary" bg="transparent" mr="10px"></Badge>
          )}
        </Flex>

        <Flex w="100%" gridColumnGap="10px" align="center" justify="space-between">
          <Flex w="100%" justify="space-between">
            <Flex gridColumnGap="15px" lineHeight="15px" fontSize="13px" color="gray_3">
              <Flex align="center" gridColumnGap="5px">
                <FavButton
                  w="16px"
                  h="16px"
                  isFavved={isFavved}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onFav) onFav();
                  }}
                />
                <Box color="gray_4">{proyecto?.meta?.totalFavoritos}</Box>
              </Flex>
            </Flex>
          </Flex>

          <Avatar size="25px" name={proyecto?.user?.username?.substring(0, 2)} src={proyecto?.user?.avatar?.url} />
        </Flex>
      </Flex>
    </Flex>
  ) : (
    <Flex direction="column" p="20px" w="100%">
      <Skeleton h="200px" w="100%" rounded="5px" mb="24px" />
      <Skeleton h="22px" w="50%" mb="10px" />
      <Skeleton h="22px" w="100%" mb="5px" />
      <Skeleton h="22px" w="100%" mb="5px" />
      <Skeleton h="22px" w="100%" mb="20px" />

      <Flex w="100%" justify="space-between" mb="24px">
        <Skeleton h="22px" w="32%" />
        <Skeleton h="22px" w="32%" />
        <Skeleton h="22px" w="32%" />
      </Flex>

      <Flex w="100%" justify="space-between">
        <Skeleton h="20px" w="75px" />
        <Skeleton h="30px" w="30px" rounded="full" />
      </Flex>
    </Flex>
  );
};

export const CardProyectoNuevo = (props: any) => {
  return (
    <Flex align="center" direction="column" w="100%" p="24px 20px" rounded="10px" border="1px dashed #E6E6EA" gap="20px">
      <Center rounded="13px" bg="gray_1" p="14px" w="100%">
        <Icon as={BiPlusCircle} color="primary" boxSize="28px" />
      </Center>

      <Box color="gray_5" fontSize="15px" lineHeight="22px" textAlign="center">
        Sube tu primer proyecto y consigue que el resto de usuarios del campus vean e interactuen con el contenido que subas.
      </Box>

      <Button variant="outline" leftIcon={<BiPlus />}>
        Sube un proyecto
      </Button>
    </Flex>
  );
};

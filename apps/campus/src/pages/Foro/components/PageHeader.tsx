import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  Skeleton,
  SkeletonCircle,
} from '@chakra-ui/react';
import { BiChevronDown, BiSearch, BiSortDown, BiSortUp, BiUserPlus, BiUserVoice } from 'react-icons/bi';

import { ICurso, getUserByID, UserRolEnum, subscribeNotificaciones } from 'data';
import { LoginContext } from '../../../shared/context';

enum TemasSortEnum {
  ACTUALIZACION = 'Actualización',
  PREGUNTAS = 'Núm. Preguntas',
  // IMPORTANCIA = 'Importancia',
}

enum Temas0rderEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export const PageHeader = ({
  curso,
  titulo,
  icono,
  bg = 'linear-gradient(91.73deg, #CD252A -0.63%, #E62A4D 13.74%, #AC1C50 97.95%)',
  onQuery,
}: {
  curso?: ICurso;
  titulo?: string;
  icono?: string;
  bg?: string;
  onQuery?: (order: string, sort: string, search: string) => void;
}) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(LoginContext);

  const [order, setOrder] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<TemasSortEnum>(TemasSortEnum.ACTUALIZACION);

  const [searchTimeout, setSearchTimeout] = useState<any>();

  useEffect(() => {
    if (onQuery) onQuery(order || 'asc', sort === TemasSortEnum.ACTUALIZACION ? 'updatedAt' : 'totalPreguntas', search || '');
  }, [order, sort]);

  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);

    if (search === '' && onQuery) {
      onQuery(order || 'asc', sort === TemasSortEnum.ACTUALIZACION ? 'updatedAt' : 'totalPreguntas', search || '');
    }

    const timeout = setTimeout(() => {
      if (onQuery) onQuery(order || 'asc', sort === TemasSortEnum.ACTUALIZACION ? 'updatedAt' : 'totalPreguntas', search || '');
    }, 500);

    setSearchTimeout(timeout);
  }, [search]);

  const onSubscribe = () => {
    if (curso?.id) {
      let subscribe: boolean = user?.isSubscribedTo ? !user?.isSubscribedTo(`Curso-${curso.id}`) : false;

      subscribeNotificaciones({
        lista: `Curso-${curso.id}`,
        subscribe,
      })
        .then(async (res) => {
          const dataUser = await getUserByID({ id: user?.id || 0 });

          if (!dataUser.isAxiosError) setUser({ ...dataUser });
          else console.error({ error: dataUser });
        })
        .catch((err) => console.error({ err }));
    }
  };

  return (
    <Flex bg={bg} maxW="100%" rounded="12px" p={{ base: '55px 0px 0px', sm: '85px 0px 0px' }}>
      <Flex
        p="24px"
        w="100%"
        bg="white"
        maxW="100%"
        wrap="wrap"
        rounded="12px"
        direction="column"
        gap={{ base: '12px', sm: '20px' }}
      >
        <Flex
          w="100%"
          maxW="100%"
          align="end"
          position="relative"
          gap={{ base: '12px', sm: '24px' }}
          direction={{ base: 'column', md: 'row' }}
        >
          <Center
            bg="white"
            rounded="20px"
            border="4px solid"
            position="absolute"
            borderColor="gray_3"
            bottom={{ base: '55px', md: '0' }}
            minW={{ base: '60px', sm: '90px' }}
            boxSize={{ base: '60px', sm: '90px' }}
          >
            {icono ? (
              <Image boxSize="100%" src={`data:image/svg+xml;utf8,${icono}`} />
            ) : (
              <SkeletonCircle rounded="20px" minW={{ base: '60px', sm: '90px' }} boxSize={{ base: '60px', sm: '90px' }} />
            )}
          </Center>

          {titulo ? (
            <Flex
              data-cy="header_titulo_foro"
              w="100%"
              maxW="100%"
              wrap="wrap"
              noOfLines={1}
              fontWeight="bold"
              lineHeight="29px"
              textOverflow="ellipsis"
              fontSize={{ base: '18px', sm: '24px' }}
              ml={{ base: 'calc(60px + 14px)', sm: 'calc(90px + 24px)' }}
            >
              {titulo}
            </Flex>
          ) : (
            <Skeleton ml="calc(90px + 24px)" maxW="100%" height="14px" />
          )}

          <Flex direction="row" gap="20px">
            {(user?.rol === UserRolEnum.ADMIN || user?.meta?.rol === UserRolEnum.ADMIN) && (
              <Button
                p="10px 16px"
                rounded="10px"
                minW="fit-content"
                bg="white"
                border="1px solid"
                borderColor="gray_4"
                leftIcon={<Icon as={BiUserPlus} boxSize="24px" />}
                onClick={() => navigate(`/foro/new`)}
              >
                Nuevo tema
              </Button>
            )}

            <Button
              bg="white"
              p="10px 16px"
              rounded="10px"
              minW="fit-content"
              border="1px solid"
              borderColor="gray_4"
              onClick={onSubscribe}
              leftIcon={<Icon as={BiUserVoice} boxSize="24px" />}
            >
              {user?.isSubscribedTo && user?.isSubscribedTo(`Curso-${curso?.id}`) ? 'Dejar de seguir' : 'Seguir'}
            </Button>
          </Flex>
        </Flex>

        <Box h="1px" bg="gray_3" />

        <Flex gap="14px" direction={{ base: 'column', sm: 'row' }}>
          <InputGroup w="100%" bg="gray_2" rounded="8px" border="none">
            <InputLeftElement pointerEvents="none" children={<BiSearch color="gray_6" />} />

            <Input
              data-cy="search_input_header"
              border="none"
              value={search}
              placeholder="Buscar temas"
              _placeholder={{ color: 'gray_4' }}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          <Menu>
            <MenuButton
              as={Button}
              bg="gray_2"
              p="5px 10px"
              rounded="8px"
              minW="fit-content"
              _hover={{ filter: 'brightness(90%)' }}
              rightIcon={<Icon as={BiChevronDown} boxSize="20px" />}
              leftIcon={
                <Icon
                  as={order === Temas0rderEnum.DESC ? BiSortDown : BiSortUp}
                  boxSize="20px"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOrder(order === Temas0rderEnum.DESC ? Temas0rderEnum.ASC : Temas0rderEnum.DESC);
                  }}
                />
              }
            >
              {sort}
            </MenuButton>

            <MenuList color="black" bg="white">
              {Object.values(TemasSortEnum).map((value, index) => (
                <MenuItem
                  cursor="pointer"
                  fontSize="16px"
                  fontWeight="bold"
                  _hover={{ bg: 'gray_1' }}
                  _focus={{ bg: 'gray_1' }}
                  key={'cursos-filter-' + index}
                  onClick={() => setSort(value)}
                >
                  {value}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Flex>
  );
};

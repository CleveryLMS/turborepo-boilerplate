import { useState, useContext, useEffect } from 'react';

import {
  Flex,
  Box,
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { BiSearch, BiChevronDown, BiSortDown, BiSortUp, BiFilterAlt } from 'react-icons/bi';

import { FavoritosContext } from '../../../shared/context';
import { FavoritoTipoEnum, IFavorito } from 'data';
import { GlobalCard, GlobalCardType } from '../../../shared/components';

enum FavoritosSortEnum {
  RECIENTES = 'Recientes',
  ALFABETICO = 'Alfabético',
}

enum Favoritos0rderEnum {
  ASC = 'asc',
  DESC = 'desc',
}

const FavoritosList = () => {
  const [search, setSearch] = useState<string>();
  const [order, setOrder] = useState<string>('asc');
  const [sort, setSort] = useState<FavoritosSortEnum | undefined>();
  const [filter, setFilter] = useState<FavoritoTipoEnum | undefined>();

  const { favoritos, removeFavorito } = useContext(FavoritosContext);

  const [favoritosList, setFavoritosList] = useState<any>();

  useEffect(() => {
    setFavoritosList(favoritos);
  }, [favoritos]);

  useEffect(() => {
    sort === FavoritosSortEnum.ALFABETICO &&
      setFavoritosList(
        favoritosList?.sort((a: any, b: any) =>
          order === 'desc'
            ? a.objeto?.titulo?.localeCompare(b.objeto?.titulo)
            : b.objeto?.titulo?.localeCompare(a.objeto?.titulo)
        )
      );

    sort === FavoritosSortEnum.RECIENTES &&
      setFavoritosList(
        favoritosList?.sort((a: any, b: any) => (order === 'desc' ? b.updatedAt - a.updatedAt : a.updatedAt - b.updatedAt))
      );
  }, [favoritosList, sort]);

  return (
    <Flex w="100%" p={{ base: '20px', sm: '34px' }} h="100%" direction="column" gap="40px">
      <Flex direction="column" gap="20px">
        <Box fontSize="18px" fontWeight="bold">
          Librería de favoritos
        </Box>

        <Flex gap="14px" direction={{ base: 'column', sm: 'row' }}>
          <InputGroup minW="150px" w="100%" bg="gray_2" rounded="8px" border="none">
            <InputLeftElement pointerEvents="none" children={<BiSearch color="gray_6" />} />

            <Input
              border="none"
              value={search}
              placeholder="Buscar favoritos"
              _placeholder={{ color: 'gray_4' }}
              onChange={(e) =>
                setFavoritosList(
                  favoritos.filter((f: any) =>
                    f?.objeto?.titulo
                      .toLowerCase()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .includes(
                        e.target.value
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                      )
                  )
                )
              }
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
              leftIcon={<Icon as={BiFilterAlt} boxSize="20px" />}
              rightIcon={<Icon as={BiChevronDown} boxSize="20px" />}
              w={{ base: '100%', md: 'auto' }}
              textAlign={{ base: 'left', md: 'center' }}
            >
              <Text textTransform="capitalize">{filter || 'Filtrar por'}</Text>
            </MenuButton>

            <MenuList color="black" bg="white">
              {Object.values(FavoritoTipoEnum).map((value, index) => (
                <MenuItem
                  cursor="pointer"
                  fontSize="16px"
                  fontWeight="bold"
                  _hover={{ bg: 'gray_1' }}
                  _focus={{ bg: 'gray_1' }}
                  key={'cursos-filter-' + index}
                  onClick={() => setFilter(value)}
                >
                  <Text textTransform="capitalize">{value}</Text>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

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
                  as={order === Favoritos0rderEnum.DESC ? BiSortDown : BiSortUp}
                  boxSize="20px"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOrder(order === Favoritos0rderEnum.DESC ? Favoritos0rderEnum.ASC : Favoritos0rderEnum.DESC);
                  }}
                />
              }
              w={{ base: '100%', md: 'auto' }}
              textAlign={{ base: 'left', md: 'center' }}
            >
              {sort || 'Ordenar por'}
            </MenuButton>

            <MenuList color="black" bg="white">
              {Object.values(FavoritosSortEnum).map((value, index) => (
                <MenuItem
                  cursor="pointer"
                  fontSize="16px"
                  fontWeight="bold"
                  _hover={{ bg: 'gray_1' }}
                  _focus={{ bg: 'gray_1' }}
                  key={'cursos-filter-' + index}
                  onClick={() => setSort(value)}
                >
                  <Text textTransform="capitalize">{value}</Text>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>

      <Flex w="100%" gap="20px" h="fit-content" wrap="wrap" pb="40px">
        {filter
          ? favoritosList
              .filter((f: any) => f.tipo === filter)
              .map((favorito: IFavorito, index: number) => (
                <GlobalCard
                  maxPerRow={3}
                  gapBetween="20px"
                  style={{ padding: '24px' }}
                  type={GlobalCardType.FAVORITO}
                  key={'favorito-' + index}
                  props={{
                    tipo: favorito.tipo,
                    contenido: favorito.objeto,
                    onDelete: () => removeFavorito(favorito),
                  }}
                />
              ))
          : favoritosList?.map((favorito: IFavorito, index: number) => (
              <GlobalCard
                maxPerRow={3}
                gapBetween="20px"
                style={{ padding: '24px' }}
                type={GlobalCardType.FAVORITO}
                key={'favorito-2-' + index}
                props={{
                  tipo: favorito.tipo,
                  contenido: favorito.objeto,
                  onDelete: () => removeFavorito(favorito),
                }}
              />
            ))}
      </Flex>
    </Flex>
  );
};

export default FavoritosList;

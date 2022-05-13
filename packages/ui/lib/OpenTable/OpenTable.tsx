import { useCallback, useEffect, useState } from 'react';

import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import {
  BiSort,
  BiSortUp,
  BiSortDown,
  BiChevronUp,
  BiChevronDown,
  BiChevronLeft,
  BiChevronRight,
} from 'react-icons/bi';

import { FilterAsyncSelect } from './FilterAsyncSelect/FilterAsyncSelect';

import './OpenTable.module.scss';
import { debounce } from 'lodash';

export interface OpenColumn {
  key: string;
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  options?: { label: String; value: any }[];
  render?: (data: any) => JSX.Element | undefined;
  loadOptions?: (
    search: string
  ) => Promise<{ label: String; value: string }[] | undefined>;
}

interface OpenTableProps {
  columns: OpenColumn[];
  data?: any[];
  total?: number;
  maxPages?: number;
  currentPage?: number;
  isLoading?: boolean;
  isExpandable?: boolean;
  rowExpansionTemplate?: any;
  onRowClick?: (row: any) => void;
  onPageChange?: (page: number) => void;
  onQueryChange?: (string: string) => void;
  isPaginable?: boolean;
}

export const OpenTable = ({
  columns,
  data,
  isLoading = true,
  isPaginable = true,
  onRowClick,
  maxPages,
  currentPage,
  onPageChange,
  total,
  onQueryChange,
  isExpandable = false,
  rowExpansionTemplate,
}: OpenTableProps) => {
  const [typing, setTyping] = useState<boolean>(false);
  const [typingTimeout, setTypingTimeout] = useState<any>();

  const [filters, setFilters] = useState<any>({});
  const [sortBy, setSortBy] = useState<string | undefined>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [isExpanded, setIsExpanded] = useState<any>({});
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    setIsExpanded({});
  }, [data]);

  const handleExpand = async (id: number) => {
    let _isExpanded = isExpanded;

    _isExpanded[id] = !isExpanded[id];
    await setIsExpanded(_isExpanded);

    setRefresh(!refresh);
  };

  useEffect(() => {
    if (typing === false) {
      let _filters = Object.keys(filters).map(
        (filter: string) => `${filter}=${filters[filter]}`
      );

      onQueryChange &&
        onQueryChange(
          `&${_filters.join(
            '&'
          )}&sort_by=${sortBy}&order=${sortOrder}&page=${currentPage}`
        );
    }
  }, [typing, currentPage]);

  const onHeaderClick = (column: OpenColumn) => {
    let _filters = Object.keys(filters).map(
      (filter: string) => `${filter}=${filters[filter]}`
    );

    let _sortOrder = sortOrder;

    if (sortBy === column.field)
      _sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';

    onQueryChange &&
      onQueryChange(
        `&${_filters.join('&')}&sort_by=${
          column.field
        }&order=${_sortOrder}&page=${currentPage}`
      );

    setSortOrder(_sortOrder);
    setSortBy(column.field);
  };

  const pageBack = async () => {
    onPageChange && onPageChange((currentPage || 1) - 1);
  };

  const pageForward = async () => {
    onPageChange && onPageChange((currentPage || 1) + 1);
  };

  const changeFilter = (key: string, value: any) => {
    setTyping(true);

    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => setTyping(false), 500));

    let _filters = filters;

    if (value === '') delete _filters[key];
    else _filters[key] = value;

    onPageChange && onPageChange(1);

    setFilters(_filters);
  };

  const loadDefaultOptions = async (...args: any[]) => {
    const options = args[0];
    const search = args[1];

    return options.filter((option: any) =>
      option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
    );
  };

  const onInputChange = useCallback(
    debounce((value, c) => changeFilter(c.field, value.target.value), 350),
    []
  );

  return (
    <Flex boxSize="100%" bg="white" direction="column" justify="space-between">
      <Flex
        bg="white"
        mb="100px"
        boxSize="100%"
        overflowX="auto"
        direction="column"
      >
        <Table>
          <Thead p="0px">
            <Tr top="0" bg="white" zIndex="20">
              {isExpandable && <Th maxW="50px" bg="gray_7"></Th>}

              {columns.map((c, index) => (
                <Th
                  key={index}
                  py="15px"
                  my="15px"
                  gap="15px"
                  bg="gray_7"
                  cursor={c.sortable ? 'pointer' : 'default'}
                  color={sortBy === c.field ? 'primary' : 'gray_4'}
                >
                  <Flex
                    h="100%"
                    mb="10px"
                    gap="12px"
                    align="center"
                    onClick={
                      c.sortable ? () => onHeaderClick(c) : () => undefined
                    }
                    _hover={
                      c.sortable && c.field !== sortBy ? { color: 'black' } : {}
                    }
                  >
                    <Box>{c.header}</Box>

                    {c.sortable && (
                      <Icon
                        fontSize="16px"
                        as={
                          sortBy === c.field
                            ? sortOrder === 'asc'
                              ? BiSortUp
                              : BiSortDown
                            : BiSort
                        }
                      />
                    )}
                  </Flex>

                  {c.filterable &&
                    (c.options || c.loadOptions ? (
                      <FilterAsyncSelect
                        defaultOptions
                        placeholder={`Filtrar por ${c.header}`}
                        onChange={(e: any) =>
                          changeFilter(c.field, e ? e.value : '')
                        }
                        loadOptions={
                          c.options
                            ? loadDefaultOptions.bind(null, c.options)
                            : c.loadOptions
                        }
                        debounceDeps={[]}
                      />
                    ) : (
                      <Input
                        m="0px"
                        h="40px"
                        bg="white"
                        color="black"
                        placeholder={`Filtrar por ${c.header}`}
                        onChange={(search) => onInputChange(search, c)}
                      />
                    ))}
                </Th>
              ))}
            </Tr>
          </Thead>

          {isLoading && (
            <Flex
              w="100%"
              gap="8px"
              mt="100px"
              align="center"
              h="fit-content"
              justify="center"
              direction="column"
              position="absolute"
            >
              <Box fontWeight="semibold" fontSize="14px">
                Cargando datos, por favor espere un momento...
              </Box>

              <Spinner />
            </Flex>
          )}

          {!isLoading && (
            <Tbody
              h={isExpandable ? 'fit-content' : 'calc(100% - 60px)'}
              maxH={isExpandable ? 'fit-content' : 'calc(100% - 60px)'}
            >
              {!data && (
                <Tr>
                  <Td>No hay datos para mostrar</Td>
                </Tr>
              )}

              {data?.map((item, index) => (
                <>
                  <Tr
                    key={index}
                    width="100%"
                    cursor="pointer"
                    _hover={{ backgroundColor: '#E5E5E5' }}
                    bg={index % 2 == 0 ? 'white' : 'gray_7'}
                  >
                    {isExpandable && (
                      <Td maxW="50px" textAlign="center" px="0px">
                        {(refresh || !refresh) && (
                          <Icon
                            as={isExpanded[index] ? BiChevronUp : BiChevronDown}
                            onClick={() => handleExpand(index)}
                          />
                        )}
                      </Td>
                    )}

                    {columns?.map((column, i) => (
                      <Td
                        key={i}
                        onClick={
                          onRowClick ? () => onRowClick(item) : () => undefined
                        }
                      >
                        {column.render
                          ? column.render(item)
                          : item[column.field] || '-'}
                      </Td>
                    ))}
                  </Tr>

                  {(refresh || !refresh) && isExpanded[index] && (
                    <Td
                      w="100%"
                      bg="gray_2"
                      alignContent="center"
                      colSpan={columns.length + 1}
                    >
                      {rowExpansionTemplate(data[index])}
                    </Td>
                  )}
                </>
              ))}
            </Tbody>
          )}
        </Table>
      </Flex>

      {isPaginable && (
        <Flex
          w="100%"
          h="60px"
          bottom="0"
          bg="white"
          align="center"
          justify="center"
          position="sticky"
        >
          {!!total && (
            <Box position="absolute" left="24px" color="grey_4">
              {total} elementos en total
            </Box>
          )}

          <Flex gap="6px" align="center">
            <Button
              bg="transparent"
              onClick={pageBack}
              isDisabled={currentPage === 1}
            >
              <Icon fontSize="20px" as={BiChevronLeft} />
            </Button>

            <Box>{currentPage}</Box>
            <Box>de {maxPages}</Box>

            <Button
              bg="transparent"
              onClick={pageForward}
              isDisabled={currentPage === maxPages}
            >
              <Icon fontSize="20px" as={BiChevronRight} />
            </Button>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

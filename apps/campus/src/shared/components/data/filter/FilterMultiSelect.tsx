import { useCallback, useState } from 'react';

import { debounce } from 'lodash';
import { BiX } from 'react-icons/bi';
import AsyncSelect from 'react-select/async';
import { Flex, Box, Badge, Icon, Center } from '@chakra-ui/react';

type MultiSelectProps = {
  name: string;
  label?: string;
  loadOptions: any;
  isDisabled?: boolean;
  placeholder?: string;
  updateValue: (e?: any) => any | void;
  extra: {
    name: string;
    metaName: string;
    options: { label: string; value: any }[];
  };
};

export const FilterMultiSelect = ({
  label,
  name,
  extra,
  loadOptions,
  isDisabled,
  placeholder,
  updateValue,
}: MultiSelectProps) => {
  const [data, setData] = useState<{ label: string; value: any; meta: any }[]>(
    []
  );

  const onChange = (event: any) => {
    if (event.length < data?.length) return;

    const newData = [...event]?.map((item: any, i: number) => {
      if (!item.id) return undefined;

      item.meta = {
        ...item.meta,
        [extra.metaName]: item?.meta[extra.metaName] || 1,
      };

      return item;
    });

    setData(newData?.filter((i) => i));
    updateValue({ [name]: newData?.filter((i) => i) });
  };

  const removeTag = (index: number) => {
    setData([...data]?.filter((t, i) => i !== index));
    updateValue({ [name]: [...data]?.filter((t, i) => i !== index) });
  };

  const updateLevel = (index: number) => {
    const newData = [...data]?.map((item: any, i: number) => {
      if (!item.id) return undefined;

      if (i === index) {
        const newLevel =
          item.meta[extra.metaName] === 3 ? 1 : item.meta[extra.metaName] + 1;

        item.meta[extra.metaName] = newLevel;
      }

      return item;
    });

    setData(newData?.filter((t) => t));
    updateValue({ [name]: newData?.filter((i) => i) });
  };

  const _loadOptions = useCallback(
    debounce((inputValue, callback) => {
      loadOptions(inputValue).then((options: any) => callback(options));
    }, 350),
    []
  );

  return (
    <Flex w="100%" direction="column" gap="12px">
      <Box as="label" fontSize="14px" fontWeight="bold" lineHeight="16px">
        {label}
      </Box>

      <AsyncSelect
        isMulti
        isSearchable
        value={data}
        isClearable={false}
        onChange={onChange}
        isDisabled={isDisabled}
        placeholder={placeholder}
        loadOptions={_loadOptions}
        loadingMessage={() => 'Buscando información...'}
        styles={{
          ...reactSelectStyles,
          multiValue: (styles: any) => ({ ...styles, display: 'none' }),
        }}
      />

      <Flex wrap="wrap" gap="10px">
        {data?.map(
          (item: { label: string; value: any; meta: any }, index: number) => (
            <Badge
              display="flex"
              p="5px 12px"
              gap="8px"
              rounded="full"
              key={`info-item-${index}`}
              bg={
                item.meta[extra.metaName]
                  ? item.meta[extra.metaName] === 3
                    ? 'primary'
                    : item?.meta[extra.metaName] === 2
                    ? '#EDA73F'
                    : '#BFBFCA'
                  : '#e8e8e8'
              }
              color={item.meta[extra.metaName] ? 'white' : '#a5a5a5'}
            >
              <Box fontSize="14px" fontWeight="medium">
                {item.label}
              </Box>

              <Flex w="fit-content" gap="4px" align="center">
                <Icon
                  as={BiX}
                  boxSize="21px"
                  cursor="pointer"
                  onClick={isDisabled ? undefined : () => removeTag(index)}
                />

                <Center
                  w="fit-content"
                  h="21px"
                  rounded="50%"
                  cursor="pointer"
                  onClick={(e) => updateLevel(index)}
                >
                  {extra?.options?.find(
                    (o) => o.value === item.meta[extra.metaName]
                  )?.label || 'Sin definir'}
                </Center>
              </Flex>
            </Badge>
          )
        )}
      </Flex>
    </Flex>
  );
};

const reactSelectStyles = {
  control: (styles: any) => ({
    ...styles,
    backgroundColor: 'var(--chakra-colors-gray_1)',
    border: 'none',
  }),
  singleValue: (styles: any) => ({
    ...styles,
    color: 'var(--chakra-colors-black)',
  }),
  placeholder: (styles: any) => ({
    ...styles,
    color: 'var(--chakra-colors-gray_4)',
    fontSize: '14px',
    fontWeight: 'medium',
  }),
  indicatorSeparator: (styles: any) => ({ ...styles, display: 'none' }),
  dropdownIndicator: (styles: any) => ({ ...styles, color: '#DBDBDB' }),
  option: (styles: any, { isFocused }: any) => ({
    ...styles,
    backgroundColor: isFocused ? '#E8EDFF' : 'white',
    color: '#131340',
    fontSize: '14px',
  }),
};
